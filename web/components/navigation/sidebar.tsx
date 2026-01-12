"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, Lightbulb, TrendingUp, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { removeAuthToken, getUserFromToken, getUserInitials } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSidebar } from "@/contexts/sidebar-context";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/receipts", label: "Receipts", icon: Receipt },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/deals", label: "Deals", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [userInfo, setUserInfo] = useState<{ email: string; initials: string } | null>(null);

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setUserInfo({
        email: user.email,
        initials: getUserInitials(user.email)
      });
    }
  }, []);

  const handleSignOut = () => {
    removeAuthToken();
    router.push("/auth");
  };

  if (!userInfo) return null;

  return (
    <aside
      className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-border lg:bg-surface/80 lg:backdrop-blur-md transition-all duration-200 ease-in-out ${
        isCollapsed ? "lg:w-20" : "lg:w-64"
      }`}
    >
      {/* Logo and Collapse */}
      <div className="px-6 py-6 flex items-center justify-between">
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sage/10 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Nimbly" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-xl font-semibold text-text-primary">Nimbly</span>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-sage/10 flex items-center justify-center mx-auto overflow-hidden">
            <img src="/logo.png" alt="Nimbly" className="w-7 h-7 object-contain" />
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="px-4 pb-6">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border hover:border-sage/30 transition-all">
            <Link href="/profile" className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-sage">{userInfo.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {userInfo.email.split('@')[0]}
                </p>
                <p className="text-xs text-text-muted truncate">{userInfo.email}</p>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Link href="/profile">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                <span className="text-sm font-semibold text-sage">{userInfo.initials}</span>
              </div>
            </Link>
            <ThemeToggle />
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border"></div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: isCollapsed ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-sage/10 text-sage"
                      : "text-text-secondary hover:bg-surface hover:text-text-primary"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="px-4 py-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-text-secondary hover:bg-surface hover:text-text-primary transition-colors duration-200 ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
