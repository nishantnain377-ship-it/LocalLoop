
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Plus,
  MapPin,
  Trash2,
  RefreshCw,
  Pencil,
  AlertCircle,
} from "lucide-react";

import api from "../services/api";

function ListingSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
      <div className="h-44 rounded-xl bg-slate-200" />
      <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-3 h-3 w-full rounded bg-slate-100" />
      <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
      <div className="mt-5 h-6 w-1/2 rounded bg-slate-200" />
      <div className="mt-5 h-10 rounded-lg bg-slate-100" />
    </div>
  );
}

function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/listings/user/my-listings");

      setListings(response.data.listings || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your listings. Please login first."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.delete(`/listings/${id}`);

      setListings((previous) =>
        previous.filter((listing) => listing._id !== id)
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to delete listing."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-50 text-green-700";
      case "sold":
        return "bg-blue-50 text-blue-700";
      case "inactive":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Seller Dashboard
            </span>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              My Listings
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage and track all your uploaded products.
            </p>
          </div>

          <Link
            to="/create-listing"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            <Plus size={19} />
            Create Listing
          </Link>
        </div>

        {/* Listing Count */}
        {!loading && !error && listings.length > 0 && (
          <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Package size={17} className="text-blue-600" />
            <span>
              <strong className="text-slate-800">
                {listings.length}
              </strong>{" "}
              listings found
            </span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ListingSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertCircle size={28} className="text-red-500" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Unable to load listings
            </h2>

            <p className="mt-2 text-sm text-red-600">{error}</p>

            <button
              onClick={fetchMyListings}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && listings.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Package size={34} className="text-blue-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No listings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Start selling or renting products in your community.
              Your first listing will appear here.
            </p>

            <Link
              to="/create-listing"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Create Your First Listing
            </Link>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && listings.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <article
                key={listing._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                {/* Product Image */}
                <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                  {listing.images?.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Package size={48} className="text-slate-300" />
                  )}

                  <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">
                    {listing.type}
                  </span>
                </div>

                <div className="mt-4">

                  {/* Title and Status */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 text-base font-bold text-slate-900">
                      {listing.title}
                    </h3>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(listing.status)}`}
                    >
                      {listing.status || "Pending"}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                    {listing.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin size={14} className="shrink-0 text-blue-500" />
                    <span className="truncate">
                      {listing.locality
                        ? `${listing.locality}, ${listing.city}`
                        : listing.city}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-xl font-extrabold text-blue-600">
                      {listing.price === 0
                        ? "Free"
                        : `₹${Number(listing.price).toLocaleString("en-IN")}`}
                    </p>
                  </div>

                  {/* Edit Button */}
                  <Link
                    to={`/edit-listing/${listing._id}`}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                  >
                    <Pencil size={17} />
                    Edit Listing
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(listing._id)}
                    disabled={deletingId === listing._id}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === listing._id ? (
                      <>
                        <RefreshCw size={17} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={17} />
                        Delete Listing
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyListings;
