/**
 * Parenting Assistant — AI chatbot screen.
 *
 * Talks to an n8n webhook backed by an AI vector database:
 *   POST { chatInput, sessionId, langcode, childageid }
 *
 * Session behaviour:
 * - On the FIRST open after an app launch the stored history and
 *   sessionId are cleared (there is no reliable "app closed" event,
 *   so the reset happens on open — equivalent for the user) and a new
 *   session starts: the app sends chatInput = "Initialize" and shows
 *   the API's reply as the welcome message after the typing dots.
 * - If the Initialize call fails, chatConfig.fallbackWelcome (text +
 *   suggested questions) is shown — the only app-side content.
 * - Re-opening the chatbot within the same app run restores the
 *   stored history (AsyncStorage) and does NOT call Initialize again.
 * - The reset icon in the header clears history + sessionId and
 *   re-runs Initialize.
 *
 * Chips and sources are rendered only when the API provides them:
 * "suggestedquestions": [{ label, question }] and a trailing
 * "**Sources:**" markdown list with relative URLs ("article/7516").
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";
import FocusAwareStatusBar from "@components/FocusAwareStatusBar";
import ChatHeader from "@components/parentingAssistant/ChatHeader";
import ChatInput from "@components/parentingAssistant/ChatInput";
import MessageBubble, {
  TypingBubble,
} from "@components/parentingAssistant/MessageBubble";
import QuickReplies from "@components/parentingAssistant/QuickReplies";
import { chatConfig } from "@components/parentingAssistant/chatConfig";
import { chatTheme } from "@components/parentingAssistant/chatTheme";
import {
  ChatMessage,
  ChatSuggestedQuestion,
} from "@components/parentingAssistant/chatTypes";
import { useAppSelector } from "../../../App";
import useNetInfoHook from "../../customHooks/useNetInfoHook";
import { sendChatMessage } from "../../services/parentingAssistantApi";
import { selectActiveChild, selectChildAge } from "../../services/selectors";

const styles = StyleSheet.create({
  // top inset is painted by FocusAwareStatusBar (header colour);
  // bottom inset stays white to match the footnote strip
  safeArea: { flex: 1, backgroundColor: chatTheme.card },
  container: { flex: 1, backgroundColor: chatTheme.surface },
  messagesList: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 0,
  },
  footnote: {
    backgroundColor: chatTheme.card,
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 2,
  },
  footnoteText: {
    textAlign: "center",
    fontSize: 11,
    lineHeight: 16,
    color: chatTheme.textSoft,
  },
});

// Module-level flag: true once the chatbot has been opened during this
// app run. On the first open per launch the stored session is wiped,
// which implements "clear history when the app closes".
let sessionResetDoneForThisLaunch = false;
let previousChatContext: {
  langcode: string;
  childageid: string;
} | null = null;

const ParentingAssistant = (): any => {
  const navigation = useNavigation<any>();
  const netInfo = useNetInfoHook();
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const sessionIdRef = useRef<string>("");
  const lastBotMessageIdRef = useRef<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chips, setChips] = useState<ChatSuggestedQuestion[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);

  // Context sent with every webhook call
  const languageCode = useAppSelector(
    (state: any) => state.selectedCountry.languageCode
  );
  const activeChild = useAppSelector(selectActiveChild);
  console.log("activechild chatbot is--", activeChild)
  const childAgeId =
    activeChild?.taxonomyData.prematureTaxonomyId ||
    activeChild?.taxonomyData.id;
  const contextRef = useRef({ langcode: "", childageid: "" });
  contextRef.current = {
    langcode: languageCode ? String(languageCode) : "",
    childageid:
      childAgeId !== null && childAgeId !== undefined
        ? String(childAgeId)
        : "",
  };

  const scrollToEnd = useCallback((): void => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);
  const scrollToLastBotResponse = useCallback((): void => {
    const lastBotIndex = [...messages]
      .map((message, index) => ({ message, index }))
      .reverse()
      .find(({ message }) => message.role === "bot")?.index;

    if (lastBotIndex === undefined) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({
          index: lastBotIndex,
          animated: true,
          viewPosition: 0,
        });
      });
    });
  }, [messages]);
  
  const appendMessage = useCallback(
    (message: ChatMessage): void => {
      setMessages((previous) => [...previous, message]);
      scrollToEnd();
    },
    [scrollToEnd]
  );

  const appendBotMessage = useCallback(
    (message: ChatMessage): void => {
      lastBotMessageIdRef.current = message.id;
  
      setMessages((previous) => {
        const newMessages = [...previous, message];
        const newMessageIndex = newMessages.length - 1;
  
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            listRef.current?.scrollToIndex({
              index: newMessageIndex,
              animated: true,
              viewPosition: 0,
            });
          });
        });
  
        return newMessages;
      });
    },
    []
  );
  const scrollToLastBotMessage = useCallback((): void => {
    const botMessageId = lastBotMessageIdRef.current;
  
    if (!botMessageId) {
      return;
    }
  
    const botIndex = messages.findIndex(
      (message) => message.id === botMessageId
    );
  
    if (botIndex === -1) {
      return;
    }
  
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({
          index: botIndex,
          animated: true,
          viewPosition: 0,
        });
      });
    });
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollToLastBotMessage();
      }
    );
  
    return () => {
      keyboardDidShowListener.remove();
    };
  }, [scrollToLastBotMessage]);
  /**
   * Sends the "Initialize" handshake for a fresh session and shows the
   * API reply (message + sources + suggested-question chips). Falls
   * back to chatConfig.fallbackWelcome when the call fails.
   */
  const initSession = useCallback(async (sessionId: string): Promise<void> => {
    setIsTyping(true);
    try {
      const reply = await sendChatMessage(
        sessionId,
        chatConfig.initChatInput,
        contextRef.current
      );
      console.log("reply is--", reply)
      // const { body } = splitSources(reply.text);
      // const { body, sources } = splitSources(reply.text); //uncomment this line and comment above when response shows sources.
      // const sources = chatConfig.fallbackWelcome.sources //remove this when response shows sources
      setChips(reply.suggestedQuestions);
      setMessages([{ id: uuidv4(), role: "bot", text: reply.text, sources: reply.sources }]);
    } catch (error) {
      setMessages([
        { id: uuidv4(), role: "bot", text: chatConfig.fallbackWelcome.text },
      ]);
      setChips(chatConfig.fallbackWelcome.suggestedQuestions);
    } finally {
      setIsTyping(false);
    }
  }, []);

  /** Clears stored history + sessionId, then starts a new session. */
  const startNewSession = useCallback(async (): Promise<void> => {
    const fresh = uuidv4();
    sessionIdRef.current = fresh;
    try {
      await AsyncStorage.setItem(chatConfig.sessionStorageKey, fresh);
      await AsyncStorage.removeItem(chatConfig.messagesStorageKey);
    } catch (error) {
      // storage unavailable: in-memory session still works for this run
    }
    setLastFailedText(null);
    setChips([]);
    setMessages([]);
    setHydrated(true);
    await initSession(fresh);
  }, [initSession]);

  useEffect(() => {
    console.log("in Parenting useeffect");

    const currentContext = contextRef.current;

    console.log(
      "previous context:",
      previousChatContext,
      "current context:",
      currentContext
    );

    // First time chatbot is opened during this app run
    if (previousChatContext === null) {
      previousChatContext = {
        langcode: currentContext.langcode,
        childageid: currentContext.childageid,
      };
      console.log("First chatbot context stored");
      return;
    }

    console.log(
      previousChatContext.childageid,
      "!==",
      currentContext.childageid
    );

    const contextChanged =
      previousChatContext.langcode !== currentContext.langcode ||
      previousChatContext.childageid !== currentContext.childageid;

    console.log("contextChanged---", contextChanged);

    if (contextChanged) {
      previousChatContext = {
        langcode: currentContext.langcode,
        childageid: currentContext.childageid,
      };

      console.log("Context changed - starting new chatbot session");

      startNewSession();
    }
  }, [languageCode, childAgeId, startNewSession]);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = (): any => {
        navigation.goBack();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      navigation.addListener("gestureEnd", backAction);

      return (): any => {
        navigation.removeListener("gestureEnd", backAction);
        backHandler.remove();
      };
    }, [])
  );
  // First open per app launch: reset. Later opens in the same run:
  // restore the stored history and skip the Initialize call.
  useEffect(() => {
    const hydrate = async (): Promise<void> => {
      if (!sessionResetDoneForThisLaunch) {
        sessionResetDoneForThisLaunch = true;
        await startNewSession();
        return;
      }
      try {
        const storedSession = await AsyncStorage.getItem(
          chatConfig.sessionStorageKey
        );
        const storedData = await AsyncStorage.getItem(
          chatConfig.messagesStorageKey
        );
        if (storedSession && storedData) {
          const parsed = JSON.parse(storedData);
          if (
            parsed?.sessionId === storedSession &&
            Array.isArray(parsed.messages) &&
            parsed.messages.length > 0
          ) {
            sessionIdRef.current = storedSession;
            setMessages(parsed.messages);
            setChips(Array.isArray(parsed.chips) ? parsed.chips : []);
            setHydrated(true);
            scrollToEnd();
            return;
          }
        }
      } catch (error) {
        // fall through to a fresh session
      }
      await startNewSession();
    };
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the conversation whenever it changes so it survives
  // navigation to DetailsScreen and screen remounts within this run.
  useEffect(() => {
    if (!hydrated || !sessionIdRef.current) {
      return;
    }
    AsyncStorage.setItem(
      chatConfig.messagesStorageKey,
      JSON.stringify({ sessionId: sessionIdRef.current, messages, chips })
    ).catch(() => {
      // best effort: chat still works without persistence
    });
  }, [messages, chips, hydrated]);

  const sendMessage = useCallback(
    async (text: string, isRetry = false): Promise<void> => {
      if (isTyping) {
        return;
      }
      if (!isRetry) {
        appendMessage({ id: uuidv4(), role: "user", text });
      }
      setLastFailedText(null);
      setChips([]); // chips reappear only if the next reply provides them

      if (netInfo.isConnected === false) {
        appendMessage({
          id: uuidv4(),
          role: "bot",
          text: chatConfig.strings.offlineReply,
          isError: true,
        });
        setLastFailedText(text);
        return;
      }

      setIsTyping(true);
      scrollToEnd();
      try {
        if (!sessionIdRef.current) {
          sessionIdRef.current = uuidv4();
        }
        const reply = await sendChatMessage(
          sessionIdRef.current,
          text,
          contextRef.current
        );
        // const { body, sources } = splitSources(reply.text);
        setChips(reply.suggestedQuestions);
        appendBotMessage({
          id: uuidv4(),
          role: "bot",
          text: reply.text,
          sources: reply.sources,
        });
      } catch (error) {
        appendMessage({
          id: uuidv4(),
          role: "bot",
          text: chatConfig.strings.errorReply,
          isError: true,
        });
        setLastFailedText(text);
      } finally {
        setIsTyping(false);
      }
    },
    [appendMessage, appendBotMessage, isTyping, netInfo.isConnected, scrollToEnd]
  );

  const handleRetry = useCallback((): void => {
    if (!lastFailedText) {
      return;
    }
    // drop the error bubble before retrying
    setMessages((previous) => previous.filter((message) => !message.isError));
    sendMessage(lastFailedText, true);
  }, [lastFailedText, sendMessage]);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }): any => (
      <MessageBubble
        busy={isTyping}
        message={item}
        onRetry={item.isError ? handleRetry : undefined}
      />
    ),
    [handleRetry]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <FocusAwareStatusBar
        animated={true}
        backgroundColor={chatTheme.headerBg}
        barStyle="dark-content"
      />
      <ChatHeader
        busy={isTyping}
        onClose={(): void => navigation.goBack()}
        onNewConversation={(): void => {
          startNewSession();
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item): string => item.id}
          contentContainerStyle={styles.messagesList}
          // onContentSizeChange={scrollToEnd}
          // onContentSizeChange={() => {
          //   requestAnimationFrame(() => {
          //     listRef.current?.scrollToEnd({ animated: false });
          //   });
          // }}
          ListFooterComponent={isTyping ? <TypingBubble /> : null}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={false}
        />
        <QuickReplies
          questions={chips}
          onSelect={(question): void => {
            sendMessage(question);
          }}
          disabled={isTyping}
        />
        <ChatInput
          onSend={(text): void => {
            sendMessage(text);
          }}
          disabled={isTyping}
        />
        <View style={styles.footnote}>
          <Text style={styles.footnoteText}>
            {chatConfig.strings.disclaimer}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ParentingAssistant;
