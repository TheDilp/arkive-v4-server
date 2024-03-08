export interface WebsocketConversationMessage {
  data: {
    id: string;
    parent_id: string;
    sender_id?: string;
    content: string;
    type: "character" | "narration" | "place";
  };
  project_id: string;
  conversation: { id?: string; title?: string };
}
