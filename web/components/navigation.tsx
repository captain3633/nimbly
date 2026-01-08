"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { isAuthenticated, removeAuthToken } from "@/lib/auth";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/savvy", label: "Meet Savvy" },
  { href: "/contact", label: "Contact"},
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    removeAuthToken();
    setIsAuth(false);
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-sage/10 flex items-center justify-center">
              <span className="text-2xl">🐇</span>
            </div>
            <span className="text-xl font-semibold text-text-primary">
              Nimbly
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-sage",
                  pathname === item.href
                    ? "text-sage"
                    : "text-text-secondary"
                )}
              >
                {item.label}
              </Link>
            ))}
            {isAuth ? (
              <>
                <Link
                  href="/receipts"
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-sage",
                    pathname === "/receipts"
                      ? "text-sage"
                      : "text-text-secondary"
                  )}
                >
                  Receipts
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-surface text-text-primary text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 rounded-xl bg-sage text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                exit={{ y: -10 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="py-4 flex flex-col space-y-4"
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-sage px-2 py-1 block",
                        pathname === item.href
                          ? "text-sage"
                          : "text-text-secondary"
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                {isAuth ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href="/receipts"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-sage px-2 py-1 block",
                          pathname === "/receipts"
                            ? "text-sage"
                            : "text-text-secondary"
                        )}
                      >
                        Receipts
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + 1) * 0.05, duration: 0.3 }}
                    >
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-xl bg-surface text-text-primary text-sm font-medium hover:opacity-90 transition-opacity text-center w-full"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href="/auth"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-2 rounded-xl bg-sage text-white text-sm font-medium hover:opacity-90 transition-opacity text-center block"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
