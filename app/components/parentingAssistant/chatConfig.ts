/**
 * Configuration for the Parenting Assistant (AI chatbot) screen.
 *
 * webhookUrl: n8n webhook that fronts the AI vector database.
 *
 * Request shape (all calls):
 *   POST {
 *     "chatInput": "<user text | 'Initialize'>",
 *     "sessionId": "<uuid>",
 *     "langcode": "<selectedCountry.languageCode, e.g. 'zw-en'>",
 *     "childageid": "<active child age taxonomy id, e.g. '646'>"
 *   }
 *
 * Session start: when a NEW session begins the app sends
 * chatInput = initChatInput ("Initialize") and shows the API's reply
 * as the welcome message. If that call fails, `fallbackWelcome` below
 * is shown instead (the ONLY case where app-side content is used).
 *
 * Expected API response shape:
 * {
 *   "output": "<markdown reply>",
 *   "suggestedquestions": [
 *     { "label": "Activities for my 2 year old",
 *       "question": "What are some fun activities for a 2 year old?" },
 *     { "label": "My child is not eating well",
 *       "question": "My child is not eating well. What can I do?" }
 *   ]
 * }
 * - "output" (string, required): markdown reply. A trailing
 *   "**Sources:**" list of markdown links is rendered as tappable
 *   source cards. Source URLs are RELATIVE — "<contenttype>/<id>",
 *   e.g. "article/7516" or "activity/9491"; the app prefixes the
 *   flavour's share base URL (appConfig.shareTextButton).
 * - "suggestedquestions" (optional): chips shown above the input.
 *   Chips and sources are rendered ONLY when the API provides them.
 */
export const chatConfig = {
  webhookUrl:
    "https://chat.umntwana.app/webhook/1b12f580-f2c1-49c7-b228-c0fa26ff8df1",
  requestTimeoutMs: 60000,
  sessionStorageKey: "@parentingAssistantSessionId",
  messagesStorageKey: "@parentingAssistantMessages",

  // Sent automatically when a new session starts; the reply becomes
  // the welcome message.
  initChatInput: "Initialize",

  // Used ONLY if the Initialize call fails (offline / server error).
  fallbackWelcome: {
    // text: "For a toddler, I found these motor game ideas: music and dance, balls, throwing and catching, climbing, running, jumping, riding toys, and outdoor play. You can also try simple animal games, like running like a monkey or jumping like a bunny. If you want something quieter, building blocks, boxes, puzzles, and playdough also help motor skills. I can narrow this to indoor games or games for a 2-year-old if you like.For a toddler, I found these motor game ideas: music and dance, balls, throwing and catching, climbing, running, jumping, riding toys, and outdoor play. You can also try simple animal games, like running like a monkey or jumping like a bunny. If you want something quieter, building blocks, boxes, puzzles, and playdough also help motor skills. I can narrow this to indoor games or games for a 2-year-old if you like.",
    text: "Hello! 👋 I am your parenting assistant. I am here to support you with information about child growth and development. For urgent health concerns please contact a health worker.\n\nWhat can I help you with? 💙",
    suggestedQuestions: [
      {
        label: "Activities for my 2 year old",
        question: "What are some fun activities for a 2 year old?",
      },
      {
        label: "My child is not eating well",
        question: "My child is not eating well. What can I do?",
      },
    ],
    sources: [
      {
        title: "Feeding your toddler well",
        url: "article/3416",
      },
      {
        title: "Learning through play",
        url: "article/8661",
      },
      {
        title: "Your child's development, month by month",
        url: "activity/1251",
      },
    ],
  },

  strings: {
    title: "Parent Buddy",
    beta: "BETA",
    subtitle: "Ask the AI chatbot about parenting, child development and more.",
    inputPlaceholder: "Type your question...",
    sourcesLabel: "SOURCES",
    disclaimer:
      "This AI chatbot provides general parenting information. It may make mistakes and does not replace medical advice. For any health concerns, consult a qualified health worker.",
    errorReply:
      "Sorry, I could not answer right now. Please check your connection and try again.",
    offlineReply:
      "You seem to be offline. Please connect to the internet and try again.",
    retry: "Try again",
  },
};

export default chatConfig;
