export interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
  streaming?: boolean;
  generatedBy?: string; // Optional field to track which LLM generated the message
}

export interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  messages?: Message[];
}
