
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Trash2,
  Package,
  ExternalLink,
  CheckCircle,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
  X,
  SlidersHorizontal,
} from "lucide-react";

import {
  getAllAdminListings,
  deleteListingByAdmin,
  updateListingStatusByAdmin,
} from "../../services/adminListingService";

const categories = [
  "Electronics",
  "Furniture",
  "Vehicles",
  "Fashion",
  "Books",
  "Home Appliances",
  "Other",
];

const statusOptions = ["active", "sold", "inactive"];

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalListings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllAdminListings(
          appliedSearch,
          category,
          status,
          page
        );

        setListings(data.listings || []);
        setPagination(
          data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalListings: 0,
          }
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load marketplace listings."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchListings();
  }, [appliedSearch, category, status, page, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((previous) => previous + 1);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const handleClearSearch = () => {
    setSearch("");
    setAppliedSearch("");
    setPage(1);
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const handleStatusChange = async (listingId, newStatus) => {
    const listing = listings.find(
      (item) => item._id === listingId
    );

    if (!listing || listing.status === newStatus) return;

    try {
      setActionLoading(listingId);
      setError("");

      await updateListingStatusByAdmin(listingId, newStatus);

      setListings((previous) =>
        previous.map((item) =>
          item._id === listingId
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (err) {
      window.alert(
        err.response?.data?.message ||
          "Unable to update listing status."
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (listing) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${listing.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(listing._id);
      setError("");

      await deleteListingByAdmin(listing._id);

      if (listings.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        setRefreshKey((previous) => previous + 1);
      }
    } catch (err) {
      window.alert(
        err.response?.data?.message ||
          "Unable to delete listing."
      );
    } finally {
      setActionLoading("");
    }
  };

  const formatPrice = (listing) => {
    if (
      listing.type?.toLowerCase() === "free" ||
      Number(listing.price) === 0
    ) {
      return "Free";
    }

    return `₹${Number(listing.price || 0).toLocaleString("en-IN")}`;
  };

  const getStatusClass = (listingStatus) => {
    switch (listingStatus) {
      case "active":
        return "border-green-200 bg-green-50 text-green-700";
      case "sold":
        return "border-blue-200 bg-blue-50 text-blue-700";
      default:
        return "border-slate-200 bg-slate-100 text-slate-700";
    }
  };

  const activeCount = listings.filter(
    (item) => item.status === "active"
  ).length;

  const soldCount = listings.filter(
    (item) => item.status === "sold"
  ).length;

  const summaryCards = [
    {
      title: "Total Listings",
      value: pagination.totalListings,
      icon: Package,
      color: "text-blue-600",
      background: "bg-blue-50",
      description: "Matching all current filters",
    },
    {
      title: "Active Listings",
      value: activeCount,
      icon: CheckCircle,
      color: "text-green-600",
      background: "bg-green-50",
      description: "On the current page",
    },
    {
      title: "Sold Listings",
      value: soldCount,
      icon: ShoppingBag,
      color: "text-violet-600",
      background: "bg-violet-50",
      description: "On the current page",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-8">
          <Link
            to="/admin"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                <ShieldCheck size={15} />
                Administration
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Listing Management
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Review, manage and moderate marketplace listings.
              </p>
            </div>

            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </header>

        {/* Statistics */}
        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                      {Number(card.value || 0).toLocaleString("en-IN")}
                    </h2>
                  </div>

                  <div className={`rounded-xl p-3 ${card.background} ${card.color}`}>
                    <Icon size={23} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  {card.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Search and Filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal size={19} className="text-blue-600" />

            <div>
              <h2 className="font-bold text-slate-900">
                Search and Filters
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Find listings by title, category or status.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 lg:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search listings by title..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Search Listings
            </button>
          </form>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <select
              value={category}
              onChange={(event) =>
                handleFilterChange(setCategory, event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
            >
              <option value="">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(event) =>
                handleFilterChange(setStatus, event.target.value)
              }
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm capitalize text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {(appliedSearch || category || status) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Active filters:</span>

              {appliedSearch && (
                <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                  Search: {appliedSearch}
                </span>
              )}

              {category && (
                <span className="rounded-full bg-purple-50 px-3 py-1 font-semibold text-purple-700">
                  {category}
                </span>
              )}

              {status && (
                <span className="rounded-full bg-green-50 px-3 py-1 font-semibold capitalize text-green-700">
                  {status}
                </span>
              )}

              <button
                onClick={() => {
                  handleClearSearch();
                  setCategory("");
                  setStatus("");
                  setPage(1);
                }}
                className="font-semibold text-blue-600 hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </section>

        {/* Error */}
        {error && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>

            <button
              onClick={handleRefresh}
              className="text-sm font-semibold text-red-700 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Listings Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">
                Marketplace Listings
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Review and manage marketplace posts.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {listings.length} shown
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-4">Listing</th>
                  <th className="px-5 py-4">Seller</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Moderation</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center">
                      <RefreshCw
                        size={25}
                        className="mx-auto animate-spin text-blue-600"
                      />
                      <p className="mt-3 text-sm text-slate-500">
                        Loading marketplace listings...
                      </p>
                    </td>
                  </tr>
                ) : listings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                        <Package size={30} className="text-slate-400" />
                      </div>

                      <p className="mt-4 font-semibold text-slate-800">
                        No listings found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try changing your search or filters.
                      </p>

                      {(appliedSearch || category || status) && (
                        <button
                          onClick={() => {
                            handleClearSearch();
                            setCategory("");
                            setStatus("");
                          }}
                          className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
                        >
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  listings.map((listing) => (
                    <tr
                      key={listing._id}
                      className="transition hover:bg-slate-50/80"
                    >
                      {/* Listing */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              listing.images?.[0] ||
                              "https://placehold.co/80x80?text=Item"
                            }
                            alt={listing.title || "Listing"}
                            className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 bg-slate-100 object-cover"
                            loading="lazy"
                          />

                          <div className="min-w-0 max-w-52">
                            <p className="truncate font-semibold text-slate-900">
                              {listing.title}
                            </p>
                            <p className="mt-1 text-xs capitalize text-slate-500">
                              {listing.type || "Listing"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Seller */}
                      <td className="px-5 py-4">
                        <p className="max-w-44 truncate font-medium text-slate-800">
                          {listing.seller?.name || "Unknown"}
                        </p>
                        <p className="mt-1 max-w-44 truncate text-xs text-slate-500">
                          {listing.seller?.email || "No email"}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="inline-block max-w-36 truncate rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                          {listing.category || "Other"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {formatPrice(listing)}
                      </td>

                      {/* Moderation */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <ShieldCheck
                            size={16}
                            className="shrink-0 text-slate-400"
                          />

                          <select
                            value={listing.status || "inactive"}
                            disabled={actionLoading === listing._id}
                            onChange={(event) =>
                              handleStatusChange(
                                listing._id,
                                event.target.value
                              )
                            }
                            className={`w-full min-w-28 rounded-lg border px-2 py-2 text-xs font-semibold capitalize outline-none transition focus:ring-2 focus:ring-blue-100 disabled:opacity-50 ${getStatusClass(
                              listing.status
                            )}`}
                          >
                            {statusOptions.map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>

                          {actionLoading === listing._id && (
                            <RefreshCw
                              size={14}
                              className="shrink-0 animate-spin text-blue-600"
                            />
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={`/listing/${listing._id}`}
                            title="View listing"
                            aria-label="View listing"
                            className="rounded-lg p-2.5 text-blue-600 transition hover:bg-blue-50"
                          >
                            <ExternalLink size={17} />
                          </Link>

                          <button
                            onClick={() => handleDelete(listing)}
                            disabled={actionLoading === listing._id}
                            title="Delete listing"
                            aria-label="Delete listing"
                            className="rounded-lg p-2.5 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {actionLoading === listing._id ? (
                              <RefreshCw
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-6">
              <p className="text-sm text-slate-500">
                Total results:{" "}
                <span className="font-semibold text-slate-800">
                  {pagination.totalListings}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((previous) => previous - 1)}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="px-2 text-sm font-semibold text-slate-700">
                  {pagination.currentPage} / {pagination.totalPages}
                </span>

                <button
                  onClick={() => setPage((previous) => previous + 1)}
                  disabled={page >= pagination.totalPages}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        <footer className="mt-8 text-center text-xs text-slate-400">
          LocalLoop Admin Panel
        </footer>
      </div>
    </div>
  );
};

export default Listings;
