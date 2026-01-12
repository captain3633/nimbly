"use client";

import Link from "next/link";
import { Menu, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { removeAuthToken, isAuthenticated } from "@/lib/auth";

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const authenticated = isAuthenticated();

  const handleSignOut = () => {
    removeAuthToken();
    setIsMenuOpen(false);
    router.push("/auth");
  };

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <Link href={authenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sage/10 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Nimbly" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-lg font-semibold text-text-primary">Nimbly</span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {authenticated && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 top-14"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed right-0 top-14 bottom-0 w-64 bg-surface border-l border-border z-50 p-4"
            >
              <nav className="space-y-2">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-surface/50 hover:text-text-primary transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-text-secondary hover:bg-surface/50 hover:text-text-primary transition-colors"
                >
                  <span className="font-medium">Sign Out</span>
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
