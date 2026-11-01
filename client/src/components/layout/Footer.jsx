
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  ArrowUpRight,
  ShoppingBag,
} from "lucide-react";

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-extrabold text-white">
                LL
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Local<span className="text-blue-500">Loop</span>
              </h2>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Discover more. Buy local. Sell nearby.
              Connect with your community and discover
              amazing deals around you.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-400">
              <ShoppingBag size={15} className="text-blue-400" />
              Supporting local communities
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <div className="flex flex-col items-start gap-4 text-sm">
              <Link
                to="/"
                className="flex items-center gap-2 transition hover:text-blue-400"
              >
                Home
                <ArrowUpRight size={14} className="opacity-0 transition group-hover:opacity-100" />
              </Link>

              <Link
                to="/marketplace"
                className="transition hover:text-blue-400"
              >
                Marketplace
              </Link>

              <Link
                to="/login"
                className="transition hover:text-blue-400"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="transition hover:text-blue-400"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
              Contact Us
            </h3>

            <div className="flex items-center gap-3 text-sm text-slate-400">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
                <MapPin size={17} className="text-blue-400" />
              </div>
              <span>India</span>
            </div>

            <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
                <Mail size={17} className="text-blue-400" />
              </div>
              <span>LocalLoop Community</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} LocalLoop. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Discover more. Buy local. Sell nearby.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
