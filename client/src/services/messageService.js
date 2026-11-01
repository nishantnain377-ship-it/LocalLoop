
import api from "./api";

// Create a conversation or get an existing one
export const createConversation = async (listingId) => {
  const response = await api.post("/messages/conversations", {
    listingId,
  });

  return response.data;
};

// Get all conversations
export const getMyConversations = async () => {
  const response = await api.get("/messages/conversations");

  return response.data;
};

// Get messages from a conversation
export const getConversationMessages = async (conversationId) => {
  const response = await api.get(
    `/messages/conversations/${conversationId}/messages`
  );

  return response.data;
};

// Send a message
export const sendMessage = async (conversationId, text) => {
  const response = await api.post(
    `/messages/conversations/${conversationId}/messages`,
    { text }
  );

  return response.data;
};
