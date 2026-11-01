
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Package,
  ArrowLeft,
  UserCircle,
  CalendarDays,
  Tag,
  MessageCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import api from "../services/api";
import { createConversation } from "../services/messageService";
import { useAuth } from "../context/AuthContext";

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/listings/${id}`);
        setListing(response.data.listing);
        setSelectedImage(0);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load listing details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleContactSeller = async () => {
    if (!user) {
      navigate("/login", {
        state: { from: `/listing/${id}` },
      });
      return;
    }

    const sellerId = listing.seller?._id || listing.seller?.id;
    const currentUserId = user._id || user.id;

    if (sellerId && currentUserId === sellerId) {
      setContactError("You cannot contact yourself.");
      return;
    }

    try {
      setContactLoading(true);
      setContactError("");

      const response = await createConversation(listing._id);
      const conversationId = response.conversation?._id;

      if (!conversationId) {
        throw new Error("Conversation could not be created.");
      }

      navigate(`/messages/${conversationId}`);
    } catch (err) {
      setContactError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start conversation. Please try again."
      );
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-12">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-5 w-28 rounded bg-slate-200" />
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="h-[380px] rounded-2xl bg-slate-200 md:h-[480px]" />
            <div className="space-y-5">
              <div className="h-6 w-40 rounded bg-slate-200" />
              <div className="h-10 w-3/4 rounded bg-slate-200" />
              <div className="h-12 w-40 rounded bg-slate-200" />
              <div className="h-24 rounded-xl bg-slate-200" />
              <div className="h-32 rounded-xl bg-slate-200" />
              <div className="h-14 rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex min-h-[75vh] flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <Package size={38} className="text-blue-300" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900">
          Listing not found
        </h2>

        <p className="mt-2 max-w-md text-sm text-slate-500">
          {error || "This listing may have been removed."}
        </p>

        <Link
          to="/marketplace"
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const sellerId = listing.seller?._id || listing.seller?.id;
  const currentUserId = user?._id || user?.id;
  const isOwnListing =
    Boolean(user) && Boolean(sellerId) && currentUserId === sellerId;

  const images = Array.isArray(listing.images)
    ? listing.images
    : [];

  const formattedPrice =
    listing.price === 0
      ? "Free"
      : `₹${Number(listing.price || 0).toLocaleString("en-IN")}`;

  const formattedDate = listing.createdAt
    ? new Date(listing.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  const status = listing.status || "active";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-7 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Image Gallery */}
          <section>
            <div className="flex h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white sm:h-[430px] lg:h-[480px]">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage] || images[0]}
                  alt={listing.title}
                  className="h-full w-full object-contain p-3"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-blue-200">
                  <Package size={90} strokeWidth={1.2} />
                  <span className="text-sm font-medium text-slate-400">
                    No image available
                  </span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`h-20 overflow-hidden rounded-xl border-2 bg-white transition sm:h-24 ${
                      selectedImage === index
                        ? "border-blue-600"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Listing Information */}
          <section>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold capitalize text-blue-700">
                {listing.type}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600">
                {listing.category}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                  status === "active"
                    ? "bg-green-50 text-green-700"
                    : status === "sold"
                    ? "bg-slate-200 text-slate-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {status}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              {listing.title}
            </h1>

            <div className="mt-6">
              <p className="text-sm font-medium text-slate-500">
                Listing Price
              </p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-blue-600">
                {formattedPrice}
              </p>
            </div>

            {/* Location */}
            <div className="mt-7 flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <MapPin size={22} className="text-blue-600" />
              </div>

              <div>
                <p className="font-bold text-slate-900">Location</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {listing.locality
                    ? `${listing.locality}, ${listing.city}`
                    : listing.city}
                  {listing.pincode && ` - ${listing.pincode}`}
                </p>
              </div>
            </div>

            {/* Seller Card */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="mb-4 font-bold text-slate-900">
                Seller Information
              </h2>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                  <UserCircle size={31} className="text-blue-600" />
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-slate-900">
                    {listing.seller?.name || "Local Seller"}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {listing.seller?.locality ||
                      listing.seller?.city ||
                      "LocalLoop Member"}
                  </p>
                </div>

                <ShieldCheck
                  size={21}
                  className="ml-auto shrink-0 text-blue-600"
                />
              </div>
            </div>

            {/* Contact Seller */}
            <button
              type="button"
              onClick={handleContactSeller}
              disabled={contactLoading || isOwnListing || status !== "active"}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {contactLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Starting Conversation...
                </>
              ) : (
                <>
                  <MessageCircle size={20} />
                  {isOwnListing
                    ? "Your Listing"
                    : status !== "active"
                    ? "Listing Unavailable"
                    : "Contact Seller"}
                </>
              )}
            </button>

            {contactError && (
              <p className="mt-3 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
                {contactError}
              </p>
            )}

            <p className="mt-3 text-center text-xs text-slate-400">
              Connect directly with the seller through LocalLoop messaging.
            </p>
          </section>
        </div>

        {/* Description */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-900">
            Product Description
          </h2>

          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
            {listing.description}
          </p>

          <div className="mt-7 grid grid-cols-1 gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Tag size={19} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Category</p>
                <p className="mt-1 font-semibold capitalize text-slate-800">
                  {listing.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <CalendarDays size={19} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Listed On</p>
                <p className="mt-1 font-semibold text-slate-800">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
          >
            <ArrowLeft size={16} />
            Explore more listings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails;
