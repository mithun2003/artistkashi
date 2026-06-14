"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, Menu, X, User, Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-store";
import { getSafeReturnTo } from "@/lib/auth-utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Shop", href: "/shop" },
    { label: "Courses", href: "/courses" },
    ...(user?.role === "admin"
      ? [{ label: "Instructor", href: "/admin" }]
      : []),
  ];

  const loginHref = `/login?returnTo=${encodeURIComponent(getSafeReturnTo(pathname) ?? "/")}`;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-dark/70 backdrop-blur-xl border-b border-border"
            : "bg-transparent"
        )}
      >
        <div className="max-w-360 mx-auto px-8 lg:px-16 flex items-center justify-between h-20">
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-text-main text-xl font-extrabold tracking-[0.12em] uppercase">
              Artist
            </span>
            <span className="text-gold text-tiny font-mono tracking-[0.25em] uppercase -mt-0.5">
              Kashi
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-xs tracking-widest uppercase font-medium transition-colors duration-200",
                  pathname === l.href
                    ? "text-gold"
                    : "text-text-muted hover:text-text-main"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/search"
              className="text-text-muted hover:text-text-main transition-colors"
            >
              <Search size={20} />
            </Link>

            <Link
              href="/wishlist"
              className={cn(
                "text-text-muted hover:text-text-main transition-colors",
                pathname === "/wishlist" && "text-gold"
              )}
            >
              <Heart size={20} />
            </Link>

            <Link
              href="/cart"
              className={cn(
                "text-text-muted hover:text-text-main transition-colors",
                pathname === "/cart" && "text-gold"
              )}
            >
              <ShoppingBag size={20} />
            </Link>

            {user ? (
              <Link
                href="/dashboard"
                className="text-gold hover:text-text-main transition-colors"
              >
                <User size={24} />
              </Link>
            ) : (
              <>
                <Link
                  href={loginHref}
                  className="text-text-muted hover:text-text-main transition-colors text-xs tracking-widest uppercase font-medium"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-gold hover:text-text-main transition-colors"
              >
                <User size={24} />
              </Link>
            ) : null}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-text-main"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-dark flex flex-col justify-center px-10 lg:hidden"
          >
            <div className="flex flex-col gap-8">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-4xl font-extrabold tracking-tight text-text-main text-left hover:text-gold transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/search"
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-extrabold tracking-tight text-text-main text-left hover:text-gold transition-colors"
              >
                Search
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-extrabold tracking-tight text-text-main text-left hover:text-gold transition-colors"
              >
                Wishlist
              </Link>
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-extrabold tracking-tight text-text-main text-left hover:text-gold transition-colors"
              >
                Cart
              </Link>
              {!user && (
                <Link
                  href={loginHref}
                  onClick={() => setMenuOpen(false)}
                  className="text-4xl font-extrabold tracking-tight text-gold text-left hover:text-text-main transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
