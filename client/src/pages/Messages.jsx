
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Package,
  ArrowRight,
} from "lucide-react";

import { getMyConversations } from "../services/messageService";
import { useAuth } from "../context/AuthContext";

function Messages() {
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyConversations();

        if (isMounted) {
          setConversations(response.conversations || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load your conversations."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  const getOtherParticipant = (conversation) => {
    return conversation.participants?.find(
      (participant) =>
        participant._id !== user?.id &&
        participant._id !== user?._id
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-xl">
              <MessageCircle className="text-blue-600" size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Messages
              </h1>

              <p className="text-gray-500 mt-1">
                Chat with buyers and sellers in your community.
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <p className="text-gray-500">
              Loading your conversations...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-xl border p-10 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && conversations.length === 0 && (
          <div className="bg-white rounded-xl border p-12 text-center">
            <MessageCircle
              size={50}
              className="text-gray-300 mx-auto mb-4"
            />

            <h2 className="text-xl font-semibold text-gray-800">
              No conversations yet
            </h2>

            <p className="text-gray-500 mt-2">
              Contact a seller from a listing to start your first conversation.
            </p>

            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Explore Marketplace
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {/* Conversation List */}
        {!loading && !error && conversations.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

            {conversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              const listing = conversation.listing;
              const unreadCount = conversation.unreadCount || 0;
              const hasUnread = unreadCount > 0;

              return (
                <Link
                  key={conversation._id}
                  to={`/messages/${conversation._id}`}
                  className={`flex items-center gap-4 p-5 border-b last:border-b-0 transition ${
                    hasUnread
                      ? "bg-blue-50/60 hover:bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {/* Listing Image */}
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    {listing?.images?.[0] ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title || "Listing"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package
                        size={28}
                        className="text-blue-300"
                      />
                    )}
                  </div>

                  {/* Conversation Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`truncate ${
                      hasUnread
                        ? "font-bold text-gray-900"
                        : "font-semibold text-gray-900"
                    }`}>
                      {otherUser?.name || "LocalLoop User"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 truncate">
                      {listing?.title || "Listing unavailable"}
                    </p>

                    <p className={`text-sm mt-1 truncate ${
                      hasUnread
                        ? "font-semibold text-gray-800"
                        : "text-gray-400"
                    }`}>
                      {conversation.lastMessage || "Start a conversation"}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  <div className="flex items-center gap-3 shrink-0">
                    {hasUnread && (
                      <span className="min-w-6 h-6 px-2 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}

                    <ArrowRight
                      size={20}
                      className="text-gray-400"
                    />
                  </div>
                </Link>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default Messages;
