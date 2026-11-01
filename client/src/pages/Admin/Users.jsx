
import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  ShieldBan,
  ShieldCheck,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  AlertCircle,
  ArrowLeft,
  UserRound,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getAllUsers,
  updateUserBlockStatus,
  deleteUser,
} from "../../services/adminService";

function Users() {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllUsers(appliedSearch, page);

        setUsers(data.users || []);
        setPagination(
          data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalUsers: 0,
          }
        );
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [appliedSearch, page, refreshKey]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setAppliedSearch("");
    setPage(1);
  };

  const handleBlockToggle = async (user) => {
    const action = user.isBlocked ? "unblock" : "block";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(user._id);

      await updateUserBlockStatus(user._id, !user.isBlocked);

      setRefreshKey((previous) => previous + 1);
    } catch (err) {
      window.alert(
        err.response?.data?.message ||
          "Unable to update user status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Permanently delete ${user.name}? Their listings and conversations will also be deleted. This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(user._id);

      await deleteUser(user._id);

      if (users.length === 1 && page > 1) {
        setPage((previous) => previous - 1);
      } else {
        setRefreshKey((previous) => previous + 1);
      }
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Unable to delete user."
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const blockedUsers = users.filter((user) => user.isBlocked).length;
  const activeUsers = users.length - blockedUsers;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-10">
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
                <UsersIcon size={15} />
                Administration
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                User Management
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Monitor registered accounts and manage user permissions.
              </p>
            </div>

            <button
              onClick={() => setRefreshKey((previous) => previous + 1)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </header>

        {/* Statistics */}
        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Registered Users
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {pagination.totalUsers.toLocaleString("en-IN")}
                </h2>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <UsersIcon size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active on This Page
                </p>
                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {activeUsers}
                </h2>
              </div>
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <UserCheck size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Blocked on This Page
                </p>
                <h2 className="mt-2 text-3xl font-bold text-red-600">
                  {blockedUsers}
                </h2>
              </div>
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <UserX size={23} />
              </div>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search users by name or email..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Search Users
            </button>
          </form>

          {appliedSearch && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>Showing results for:</span>
              <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                {appliedSearch}
              </span>
              <button
                onClick={handleClearSearch}
                className="font-semibold text-blue-600 hover:underline"
              >
                Clear search
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
              onClick={() => setRefreshKey((previous) => previous + 1)}
              className="text-sm font-semibold text-red-700 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Users Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">
                Registered Users
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Review accounts and manage access.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {users.length} shown
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center">
              <RefreshCw className="animate-spin text-blue-600" size={30} />
              <p className="mt-3 text-sm text-slate-500">
                Loading users...
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-4 text-center">
              <div className="rounded-2xl bg-slate-100 p-4">
                <UserRound size={34} className="text-slate-400" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                No users found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                {appliedSearch
                  ? "Try a different name or email address."
                  : "Registered users will appear here."}
              </p>

              {appliedSearch && (
                <button
                  onClick={handleClearSearch}
                  className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-4 sm:px-6">User</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {user.name}
                            </p>
                            <p className="mt-0.5 text-xs capitalize text-slate-400">
                              {user.role || "user"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        {user.isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleBlockToggle(user)}
                            disabled={actionLoading === user._id}
                            title={
                              user.isBlocked ? "Unblock user" : "Block user"
                            }
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              user.isBlocked
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            }`}
                          >
                            {actionLoading === user._id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : user.isBlocked ? (
                              <ShieldCheck size={14} />
                            ) : (
                              <ShieldBan size={14} />
                            )}

                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>

                          <button
                            onClick={() => handleDelete(user)}
                            disabled={actionLoading === user._id}
                            title="Delete user"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <p className="text-sm text-slate-500">
              Page <span className="font-semibold text-slate-800">{pagination.currentPage}</span> of{" "}
              <span className="font-semibold text-slate-800">{pagination.totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((previous) => previous - 1)}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <button
                onClick={() => setPage((previous) => previous + 1)}
                disabled={page >= pagination.totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}

        <footer className="mt-8 text-center text-xs text-slate-400">
          LocalLoop Admin Panel
        </footer>
      </div>
    </div>
  );
}

export default Users;
