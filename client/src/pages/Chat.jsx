
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Package,
  MessageCircle,
  Check,
  CheckCheck,
} from "lucide-react";

import {
  getConversationMessages,
  sendMessage,
} from "../services/messageService";

import { useAuth } from "../context/AuthContext";

function Chat() {
  const { conversationId } = useParams();
  const { user } = useAuth();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // Load conversation messages
  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getConversationMessages(conversationId);

        if (isMounted) {
          setConversation(response.conversation);
          setMessages(response.messages || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load this conversation."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    const text = messageText.trim();

    if (!text || sending) return;

    try {
      setSending(true);
      setError("");

      const response = await sendMessage(conversationId, text);

      setMessages((previous) => [
        ...previous,
        response.data,
      ]);

      setMessageText("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const otherParticipant = conversation?.participants?.find(
    (participant) =>
      participant._id !== user?.id &&
      participant._id !== user?._id
  );

  const listing = conversation?.listing;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <Link
          to="/messages"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-5"
        >
          <ArrowLeft size={18} />
          Back to Messages
        </Link>

        {loading ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <p className="text-gray-500">
              Loading conversation...
            </p>
          </div>
        ) : error && !conversation ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <p className="text-red-600">{error}</p>

            <Link
              to="/messages"
              className="inline-block mt-5 text-blue-600 font-semibold"
            >
              Return to Messages
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-[75vh] min-h-[500px]">

            {/* Chat Header */}
            <div className="p-5 border-b border-gray-200 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageCircle size={22} className="text-blue-600" />
              </div>

              <div className="min-w-0">
                <h2 className="font-bold text-gray-900">
                  {otherParticipant?.name || "LocalLoop User"}
                </h2>

                <p className="text-sm text-gray-500">
                  {listing?.title || "Listing conversation"}
                </p>
              </div>
            </div>

            {/* Listing Information */}
            {listing && (
              <div className="px-5 py-3 bg-gray-50 border-b flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center overflow-hidden">
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package size={24} className="text-blue-300" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {listing.title}
                  </p>

                  <p className="text-sm text-blue-600 font-semibold">
                    {listing.price === 0
                      ? "Free"
                      : `₹${listing.price?.toLocaleString("en-IN")}`}
                  </p>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <MessageCircle
                    size={42}
                    className="text-gray-300 mb-3"
                  />

                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage =
                    message.sender?._id === user?.id ||
                    message.sender?._id === user?._id;

                  return (
                    <div
                      key={message._id}
                      className={`flex ${
                        isOwnMessage
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          isOwnMessage
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm break-words whitespace-pre-wrap">
                          {message.text}
                        </p>

                        <div className="flex items-center justify-end gap-1 mt-2">
                          <span
                            className={`text-[10px] ${
                              isOwnMessage
                                ? "text-blue-100"
                                : "text-gray-400"
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>

                          {isOwnMessage && (
                            message.readAt ? (
                              <CheckCheck
                                size={14}
                                className="text-sky-200"
                                aria-label="Read"
                              />
                            ) : (
                              <Check
                                size={14}
                                className="text-blue-100"
                                aria-label="Sent"
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Error Message */}
            {error && conversation && (
              <p className="text-sm text-red-600 px-5 pt-2">
                {error}
              </p>
            )}

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 flex items-center gap-3"
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write your message..."
                maxLength={2000}
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                disabled={!messageText.trim() || sending}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-lg transition"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </form>

          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
