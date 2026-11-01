
import { useEffect, useState } from "react";
import {
  Users,
  Package,
  MessageCircle,
  CheckCircle,
  LayoutDashboard,
  RefreshCw,
  LogOut,
  ShieldCheck,
  UserCog,
  List,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";

import { Link, NavLink, useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    activeListings: 0,
    soldListings: 0,
    totalConversations: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/admin/dashboard");

      setStats(response.data.stats);
      setRecentUsers(response.data.recentUsers || []);
      setRecentListings(response.data.recentListings || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    const success = await logout();

    if (success) {
      navigate("/login");
    }
  };

  const sidebarLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      description: "Registered accounts",
    },
    {
      title: "Total Listings",
      value: stats.totalListings,
      icon: Package,
      color: "bg-purple-50 text-purple-600",
      description: "All marketplace posts",
    },
    {
      title: "Active Listings",
      value: stats.activeListings,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
      description: "Currently available",
    },
    {
      title: "Conversations",
      value: stats.totalConversations,
      icon: MessageCircle,
      color: "bg-orange-50 text-orange-600",
      description: "Buyer and seller chats",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw className="mx-auto animate-spin text-blue-600" size={32} />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full bg-slate-950 px-5 py-6 text-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0">
          {/* Brand */}
          <Link to="/admin" className="mb-9 flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2.5 shadow-lg shadow-blue-950/40">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                LocalLoop
              </h1>
              <p className="text-xs text-slate-400">
                Administration Panel
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Workspace
          </div>

          <nav className="space-y-2">
            <NavLink to="/admin" end className={sidebarLinkClass}>
              <LayoutDashboard size={19} />
              Dashboard
            </NavLink>

            <NavLink to="/admin/users" className={sidebarLinkClass}>
              <UserCog size={19} />
              Manage Users
            </NavLink>

            <NavLink to="/admin/listings" className={sidebarLinkClass}>
              <List size={19} />
              Manage Listings
            </NavLink>
          </nav>

          {/* Admin Profile */}
          <div className="mt-8 border-t border-slate-800 pt-6 md:absolute md:bottom-6 md:left-5 md:right-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.name || "Administrator"}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {user?.email || "Admin account"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
          {/* Header */}
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
                <ShieldCheck size={15} />
                Administration
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Dashboard Overview
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Welcome back, {user?.name || "Administrator"}. Here is your platform overview.
              </p>
            </div>

            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </header>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="shrink-0 text-red-600" size={20} />
                <p className="text-sm text-red-700">{error}</p>
              </div>

              <button
                onClick={() => fetchDashboard(true)}
                className="text-sm font-semibold text-red-700 underline underline-offset-4"
              >
                Retry
              </button>
            </div>
          )}

          {/* Statistics */}
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Platform Statistics
              </h3>
              <span className="text-xs text-slate-400">
                Live dashboard data
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {card.title}
                        </p>

                        <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                          {Number(card.value || 0).toLocaleString("en-IN")}
                        </h3>
                      </div>

                      <div className={`rounded-xl p-3 ${card.color}`}>
                        <Icon size={23} />
                      </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Listing Overview */}
          <section className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">
                  Listing Overview
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Current marketplace listing status
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-xl bg-green-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <CheckCircle size={17} />
                  Active Listings
                </div>
                <p className="mt-2 text-3xl font-bold text-green-700">
                  {Number(stats.activeListings || 0).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                  <Package size={17} />
                  Sold Listings
                </div>
                <p className="mt-2 text-3xl font-bold text-blue-700">
                  {Number(stats.soldListings || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </section>

          {/* Recent Users */}
          <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h3 className="font-bold text-slate-900">
                  Recent Users
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Latest registered accounts
                </p>
              </div>

              <Link
                to="/admin/users"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
              >
                Manage Users
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {recentUsers.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Users className="mx-auto text-slate-300" size={30} />
                <p className="mt-3 text-sm text-slate-500">
                  No users found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Joined</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {recentUsers.map((person) => (
                      <tr
                        key={person._id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                              {person.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <span className="font-semibold text-slate-800">
                              {person.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {person.email}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                            {person.role}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays size={14} />
                            {person.createdAt
                              ? new Date(person.createdAt).toLocaleDateString("en-IN")
                              : "—"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Recent Listings */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <h3 className="font-bold text-slate-900">
                  Recent Listings
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Latest marketplace posts
                </p>
              </div>

              <Link
                to="/admin/listings"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
              >
                Manage Listings
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {recentListings.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Package className="mx-auto text-slate-300" size={30} />
                <p className="mt-3 text-sm text-slate-500">
                  No listings found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Seller</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {recentListings.map((listing) => (
                      <tr
                        key={listing._id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {listing.title}
                        </td>

                        <td className="px-6 py-4 text-sm capitalize text-slate-600">
                          {listing.category}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                          {listing.type === "free" || Number(listing.price) === 0
                            ? "Free"
                            : `₹${Number(listing.price).toLocaleString("en-IN")}`}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {listing.seller?.name || "Unknown"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                              listing.status === "active"
                                ? "bg-green-50 text-green-700"
                                : listing.status === "sold"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {listing.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <footer className="mt-8 text-center text-xs text-slate-400">
            LocalLoop Admin Panel
          </footer>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
