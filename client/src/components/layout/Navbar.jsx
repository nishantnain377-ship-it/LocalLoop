
import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  MapPin,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  UserCircle,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminActive = location.pathname.startsWith("/admin");

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    const success = await logout();

    if (success) {
      closeMobileMenu();
      navigate("/login");
    } else {
      alert("Logout failed. Please try again.");
    }
  };

  const navLinkClass = ({ isActive }) =>
    `relative whitespace-nowrap py-2 text-sm font-semibold transition-colors ${
      isActive
        ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-blue-600"
        : "text-slate-600 hover:text-blue-600"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-slate-700 hover:bg-slate-50"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex min-h-[72px] max-w-[1800px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={closeMobileMenu}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-extrabold text-white shadow-sm shadow-blue-200">
            LL
          </div>

          <span className="whitespace-nowrap text-2xl font-extrabold tracking-tight text-slate-900">
            Local<span className="text-blue-600">Loop</span>
          </span>
        </Link>

        {/* Location */}
        <div className="hidden shrink-0 items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-slate-500 xl:flex">
          <MapPin size={17} className="text-blue-600" />
          <span className="text-xs font-medium">Your Local Area</span>
        </div>

        {/* Main Navigation */}
        <div className="hidden shrink-0 items-center gap-7 lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/marketplace" className={navLinkClass}>
            Marketplace
          </NavLink>
        </div>

        {/* Desktop User Navigation */}
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-4 lg:flex">
          {user ? (
            <>
              <Link
                to="/create-listing"
                className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              >
                <PlusCircle size={18} />
                Sell Item
              </Link>

              <Link
                to="/my-listings"
                className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              >
                <LayoutDashboard size={18} />
                My Listings
              </Link>

              <NavLink to="/messages" className={navLinkClass}>
                <span className="flex items-center gap-2">
                  <MessageCircle size={18} />
                  Messages
                </span>
              </NavLink>

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isAdminActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <ShieldCheck size={18} />
                  Admin Panel
                </Link>
              )}

              <div className="flex min-w-0 shrink-0 items-center gap-2 border-l border-slate-200 pl-4">
                <UserCircle size={22} className="shrink-0 text-slate-500" />

                <span className="max-w-28 truncate text-sm font-semibold text-slate-700">
                  {user.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-5 shadow-lg lg:hidden">
          <div className="mx-auto max-w-2xl space-y-2">

            <NavLink
              to="/"
              end
              onClick={closeMobileMenu}
              className={mobileLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/marketplace"
              onClick={closeMobileMenu}
              className={mobileLinkClass}
            >
              Marketplace
            </NavLink>

            {user ? (
              <>
                <div className="my-3 border-t border-slate-100" />

                <Link
                  to="/create-listing"
                  onClick={closeMobileMenu}
                  className={mobileLinkClass}
                >
                  <PlusCircle size={19} />
                  Sell Item
                </Link>

                <Link
                  to="/my-listings"
                  onClick={closeMobileMenu}
                  className={mobileLinkClass}
                >
                  <LayoutDashboard size={19} />
                  My Listings
                </Link>

                <NavLink
                  to="/messages"
                  onClick={closeMobileMenu}
                  className={mobileLinkClass}
                >
                  <MessageCircle size={19} />
                  Messages
                </NavLink>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className={mobileLinkClass}
                  >
                    <ShieldCheck size={19} />
                    Admin Panel
                  </Link>
                )}

                <div className="my-3 border-t border-slate-100" />

                <div className="flex items-center gap-3 px-4 py-2">
                  <UserCircle size={23} className="text-slate-500" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {user.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={19} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="my-3 border-t border-slate-100" />

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className={mobileLinkClass}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
