export interface ChatSource {
  title: string;
  url: string; // relative "article/7516" | "activity/9491" or absolute URL
}

export interface ChatSuggestedQuestion {
  label: string; // shown on the chip
  question: string; // sent to the API when tapped
}

export interface ChatApiReply {
  text: string;
  sources: ChatSource[];
  suggestedQuestions: ChatSuggestedQuestion[];
}

export interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  sources?: ChatSource[];
  isError?: boolean;
}
