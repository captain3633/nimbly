"use client";

import { motion } from "framer-motion";
import { Sidebar } from "./navigation/sidebar";
import { MobileHeader } from "./navigation/mobile-header";
import { BottomNav } from "./navigation/bottom-nav";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <>
      {/* Desktop Layout with Sidebar */}
      <div className="hidden lg:flex lg:h-screen">
        <Sidebar />
        <main
          className={`flex-1 overflow-y-auto bg-background flex flex-col transition-all duration-200 ease-in-out ${
            isCollapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
        >
          <div className="flex-1">
            {children}
          </div>
          {/* Desktop Footer */}
          <footer className="border-t border-border bg-background py-4 px-6">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <p className="text-xs text-text-muted">
                © 2026 Nimbly. Move lighter. Spend smarter.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="/about"
                  className="text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  About
                </a>
                <a
                  href="/contact"
                  className="text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  Contact
                </a>
                <a
                  href="/privacy"
                  className="text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  Privacy
                </a>
                <a
                  href="/terms"
                  className="text-xs text-text-muted hover:text-text-primary transition-colors"
                >
                  Terms
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Layout with Header and Bottom Nav */}
      <div className="lg:hidden min-h-screen bg-background flex flex-col">
        <MobileHeader />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 pt-14 pb-20"
        >
          {children}
        </motion.main>
        <BottomNav />
      </div>
    </>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
