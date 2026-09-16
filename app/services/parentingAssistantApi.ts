/**
 * Client for the Parenting Assistant n8n webhook.
 *
 * Request:  POST { chatInput, sessionId, langcode, childageid }
 * Response: {
 *   output: "<markdown reply>",
 *   suggestedquestions?: [{ label, question }, ...]
 * }
 * (also tolerates { text | answer | message | ... } and single-element
 * array wrappers that n8n sometimes produces).
 */
import {
  ChatApiReply,
  ChatSource,
  ChatSuggestedQuestion,
} from "../components/parentingAssistant/chatTypes";
import { chatConfig } from "../components/parentingAssistant/chatConfig";
import axiosService from "./axiosService";

export interface ChatRequestContext {
  langcode?: string;
  childageid?: string;
}
const ALLOWED_SOURCE_PREFIXES = [
  "article/",
  "articles/",
  "activity/",
  "activities/",
  "video-article/",
  "video-articles/",
  "games/",
];
const extractSources = (data: any): ChatSource[] => {
  if (!data || !Array.isArray(data.sources)) {
    return [];
  }

  return data.sources
    .filter((item: any) => {
      if (
        typeof item?.title !== "string" ||
        typeof item?.url !== "string"
      ) {
        return false;
      }

      return ALLOWED_SOURCE_PREFIXES.some(prefix =>
        item.url.startsWith(prefix)
      );
    })
    .map((item: any) => ({
      title: item.title.trim(),
      url: item.url.trim(),
    }));
};
const extractReplyText = (data: any): string => {
  if (data === null || data === undefined) {
    return "";
  }
  if (typeof data === "string") {
    return data;
  }
  if (Array.isArray(data)) {
    return extractReplyText(data[0]);
  }
  const candidate =
    data.output ??
    data.text ??
    data.answer ??
    data.message ??
    data.response ??
    data.reply ??
    data.result ??
    data.data;
  if (typeof candidate === "string") {
    return candidate;
  }
  if (candidate !== undefined && candidate !== data) {
    return extractReplyText(candidate);
  }
  return "";
};

const extractSuggestedQuestions = (data: any): ChatSuggestedQuestion[] => {
  if (data === null || data === undefined) {
    return [];
  }
  if (Array.isArray(data)) {
    return extractSuggestedQuestions(data[0]);
  }
  const candidate =
    data.suggestedquestions ??
    data.suggestedQuestions ??
    data.starterQuestions ??
    data.questions;
  if (!Array.isArray(candidate)) {
    return [];
  }
  const questions: ChatSuggestedQuestion[] = [];
  candidate.forEach((item: any) => {
    if (typeof item === "string" && item.trim().length > 0) {
      questions.push({ label: item.trim(), question: item.trim() });
    } else if (
      item &&
      typeof item.question === "string" &&
      item.question.trim().length > 0
    ) {
      questions.push({
        label:
          typeof item.label === "string" && item.label.trim().length > 0
            ? item.label.trim()
            : item.question.trim(),
        question: item.question.trim(),
      });
    }
  });
  return questions;
};

export const sendChatMessage = async (
  sessionId: string,
  chatInput: string,
  context?: ChatRequestContext
): Promise<ChatApiReply> => {
  console.log("api call is--",{
    chatInput,
    sessionId,
    langcode: context?.langcode ?? "",
    childageid: context?.childageid ?? "",
  })
  const response = await axiosService.post(
    chatConfig.webhookUrl,
    {
      chatInput,
      sessionId,
      langcode: context?.langcode ?? "",
      childageid: context?.childageid ?? "",
    },
    { timeout: chatConfig.requestTimeoutMs }
  );
  console.log("api call response is--",response)
  const text = extractReplyText(response?.data);
  if (!text || text.trim().length === 0) {
    throw new Error("Empty reply from chat webhook");
  }
  return {
    text: text.trim(),
    sources: extractSources(response?.data),
    suggestedQuestions: extractSuggestedQuestions(response?.data),
  };
};

export default sendChatMessage;
