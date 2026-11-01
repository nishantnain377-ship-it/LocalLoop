
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  ArrowRight,
  Package,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

const categories = [
  { name: "Electronics", icon: "📱" },
  { name: "Furniture", icon: "🛋️" },
  { name: "Vehicles", icon: "🏍️" },
  { name: "Fashion", icon: "👕" },
  { name: "Books", icon: "📚" },
  { name: "Home Appliances", icon: "🏠" },
];

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="h-44 rounded-xl bg-slate-200" />
          <div className="mt-5 h-3 w-1/3 rounded bg-slate-200" />
          <div className="mt-3 h-5 w-3/4 rounded bg-slate-200" />
          <div className="mt-5 h-6 w-1/2 rounded bg-slate-200" />
          <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFeaturedListings = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/listings", {
        params: {
          sort: "latest",
          page: 1,
          limit: 4,
        },
      });

      setListings(response.data.listings || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load featured listings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-20 sm:px-6 lg:py-28">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">

          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <ShoppingBag size={16} />
            Your Community. Your Marketplace.
          </span>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Discover More.
            <span className="mt-2 block text-blue-600">
              Buy Local. Sell Nearby.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Discover amazing products, connect with nearby sellers,
            and find everything your local community has to offer.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/marketplace"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl sm:w-auto"
            >
              Explore Marketplace
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/create-listing"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-4 text-sm font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:w-auto"
            >
              <ShoppingBag size={18} />
              Start Selling
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
            <MapPin size={17} className="text-blue-600" />
            Discover products available near you
          </div>

        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 text-center">
            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Browse by category
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
              Explore Categories
            </h2>

            <p className="mt-3 text-sm text-slate-500 sm:text-base">
              Find exactly what you need from your local community.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to="/marketplace"
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-lg sm:p-6"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-4xl transition group-hover:scale-110">
                  {category.icon}
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-800 transition group-hover:text-blue-600">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Fresh from the community
              </span>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                Latest Listings
              </h2>

              <p className="mt-3 text-sm text-slate-500 sm:text-base">
                Discover great deals from local sellers.
              </p>
            </div>

            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:gap-3"
            >
              View All Listings
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <FeaturedSkeleton />
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center">
              <p className="text-sm text-red-600">{error}</p>

              <button
                onClick={fetchFeaturedListings}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {listings.map((listing) => (
                <Link
                  to={`/listing/${listing._id}`}
                  key={listing._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
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

                  <div className="mt-4">
                    <p className="text-xs font-semibold text-blue-600">
                      {listing.category}
                    </p>

                    <h3 className="mt-2 truncate text-base font-bold text-slate-900 transition group-hover:text-blue-600">
                      {listing.title}
                    </h3>

                    <p className="mt-3 text-xl font-extrabold text-slate-900">
                      {listing.price === 0
                        ? "Free"
                        : `₹${Number(listing.price).toLocaleString("en-IN")}`}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={14} className="shrink-0 text-blue-500" />
                      <span className="truncate">
                        {listing.locality
                          ? `${listing.locality}, ${listing.city}`
                          : listing.city}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <Package size={32} className="text-blue-400" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No listings available yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Be the first to add a product to your local marketplace.
              </p>

              <Link
                to="/marketplace"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Marketplace
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Have something to sell?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
            Connect with buyers in your community and give your products
            a new home.
          </p>

          <Link
            to="/create-listing"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Create a Listing
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;
