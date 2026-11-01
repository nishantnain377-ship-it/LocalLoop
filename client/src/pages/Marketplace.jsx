
import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  Package,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import api from "../services/api";
import { Link } from "react-router-dom";

function MarketplaceSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
        >
          <div className="h-40 rounded-xl bg-slate-200" />
          <div className="mt-5 h-5 w-3/4 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
          <div className="mt-5 h-4 w-1/3 rounded bg-slate-200" />
          <div className="mt-5 border-t border-slate-100 pt-4">
            <div className="h-6 w-1/2 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Marketplace() {
  const [search, setSearch] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("latest");

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalListings, setTotalListings] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const categories = [
    "Electronics",
    "Furniture",
    "Vehicles",
    "Fashion",
    "Books",
    "Home Appliances",
    "Other",
  ];

  const listingTypes = ["Sale", "Rent", "Free"];

  useEffect(() => {
    let isMounted = true;

    const fetchListings = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {
          search: search.trim(),
          sort: sortBy,
          page,
          limit: 12,
        };

        if (selectedCategories.length > 0) {
          params.categories = selectedCategories.join(",");
        }

        if (selectedTypes.length > 0) {
          params.types = selectedTypes.join(",");
        }

        const response = await api.get("/listings", { params });

        if (!isMounted) return;

        setListings(response.data.listings || []);
        setTotalListings(response.data.totalListings || 0);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        if (!isMounted) return;

        setError(
          err.response?.data?.message ||
            "Unable to load marketplace listings."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchListings();

    return () => {
      isMounted = false;
    };
  }, [
    search,
    sortBy,
    page,
    selectedTypes,
    selectedCategories,
    retryCount,
  ]);

  const toggleType = (type) => {
    setPage(1);

    setSelectedTypes((previous) =>
      previous.includes(type)
        ? previous.filter((item) => item !== type)
        : [...previous, type]
    );
  };

  const toggleCategory = (category) => {
    setPage(1);

    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedTypes([]);
    setSelectedCategories([]);
    setSortBy("latest");
    setPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedTypes.length > 0 ||
    selectedCategories.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">

          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            LocalLoop Marketplace
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Explore Marketplace
          </h1>

          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Discover products and great deals from your local community.
          </p>

          {/* Search */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
              <Search size={20} className="shrink-0 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search products, categories or locations..."
                className="w-full bg-transparent py-3.5 text-sm outline-none"
              />

              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  aria-label="Clear search"
                  className="text-slate-400 transition hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              onClick={() => setPage(1)}
              className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
            >
              Search
            </button>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={17} className="text-blue-600" />
            Discover listings in your local community
          </div>
        </div>
      </section>

      {/* Marketplace Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

        {/* Heading and Sorting */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              All Listings
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {loading ? "Finding products..." : `${totalListings} products found`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ArrowUpDown size={18} className="text-slate-500" />

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            >
              <option value="latest">Latest First</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">

          {/* Sidebar */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="mb-6 flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Filters
              </h3>
            </div>

            {/* Listing Types */}
            <div className="mb-7">
              <h4 className="mb-4 text-sm font-semibold text-slate-800">
                Listing Type
              </h4>

              {listingTypes.map((type) => (
                <label
                  key={type}
                  className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600 transition hover:text-blue-600"
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleType(type)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  {type}
                </label>
              ))}
            </div>

            {/* Categories */}
            <div className="border-t border-slate-100 pt-6">
              <h4 className="mb-4 text-sm font-semibold text-slate-800">
                Categories
              </h4>

              {categories.map((category) => (
                <label
                  key={category}
                  className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-600 transition hover:text-blue-600"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  {category}
                </label>
              ))}
            </div>

            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters && sortBy === "latest"}
              className="mt-7 w-full rounded-xl border border-blue-200 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear All Filters
            </button>
          </aside>

          {/* Listings */}
          <div className="lg:col-span-3">

            {loading ? (
              <MarketplaceSkeleton />
            ) : error ? (
              <div className="rounded-2xl border border-red-100 bg-white p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                  <X size={26} className="text-red-500" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Unable to load listings
                </h3>

                <p className="mt-2 text-sm text-red-600">{error}</p>

                <button
                  onClick={() => setRetryCount((previous) => previous + 1)}
                  className="mt-5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : listings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {listings.map((listing) => (
                    <Link
                      to={`/listing/${listing._id}`}
                      key={listing._id}
                      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
                    >
                      {/* Product Image */}
                      <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                        {listing.images?.[0] ? (
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

                      {/* Product Details */}
                      <div className="mt-4">
                        <h3 className="truncate text-base font-bold text-slate-900 transition group-hover:text-blue-600">
                          {listing.title}
                        </h3>

                        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                          {listing.description}
                        </p>

                        <p className="mt-3 text-xs font-semibold text-slate-500">
                          {listing.category}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin size={14} className="shrink-0 text-blue-500" />
                          <span className="truncate">
                            {listing.locality
                              ? `${listing.locality}, ${listing.city}`
                              : listing.city}
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="text-xl font-extrabold text-blue-600">
                          {listing.price === 0
                            ? "Free"
                            : `₹${Number(listing.price).toLocaleString("en-IN")}`}
                        </p>

                        <p className="mt-2 truncate text-xs text-slate-400">
                          Seller: {listing.seller?.name || "Local seller"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((previous) => previous - 1)}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>

                    <span className="text-sm font-medium text-slate-600">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((previous) => previous + 1)}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Package size={32} className="text-slate-400" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  No listings found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters to find more products.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Marketplace;
