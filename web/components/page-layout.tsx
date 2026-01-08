"use client";

import { motion } from "framer-motion";
import { Navigation } from "./navigation";
import { Footer } from "./footer";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex-1 pt-16"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
