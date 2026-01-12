"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, Plus, Lightbulb, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home, emoji: "🏠" },
  { href: "/receipts", label: "Receipts", icon: Receipt, emoji: "🧾" },
  { href: "/receipts/upload", label: "Upload", icon: Plus, emoji: "📸", highlight: true },
  { href: "/insights", label: "Insights", icon: Lightbulb, emoji: "💡" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-5 mb-7">
        <div className="bg-surface/98 backdrop-blur-md rounded-2xl shadow-lg border border-border/50">
          <div className="flex items-center justify-around h-[70px] px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link key={item.href} href={item.href} className="flex-1">
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <div
                      className={`flex flex-col items-center justify-center w-[70px] h-[52px] rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-sage/10 dark:bg-sage/20"
                          : "hover:bg-surface/50"
                      }`}
                    >
                      <span className="text-[22px] mb-0.5">{item.emoji}</span>
                      <span
                        className={`text-[10px] font-semibold mt-0.5 ${
                          isActive ? "text-sage" : "text-text-muted"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
