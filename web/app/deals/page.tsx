"use client";

import { motion } from "framer-motion";
import { AppLayout } from "@/components/app-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Card } from "@/components/ui/card";
import { TrendingUp, Tag, Percent } from "lucide-react";

export default function DealsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="p-6 lg:p-8"
        >
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Deals & Savings</h1>
              <p className="text-text-secondary">
                Discover price drops and savings opportunities based on your shopping patterns
              </p>
            </div>

            {/* Empty State */}
            <Card className="p-12">
              <div className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 rounded-2xl bg-amber/10 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10 text-amber" />
                </div>
                <h2 className="text-2xl font-semibold text-text-primary mb-3">
                  No deals yet
                </h2>
                <p className="text-text-secondary mb-6">
                  Savvy needs more data to spot price drops and savings opportunities. 
                  Upload more receipts to start seeing deals.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <Tag className="w-6 h-6 text-sage mb-2 mx-auto" />
                    <p className="text-sm font-medium text-text-primary">Price Drops</p>
                    <p className="text-xs text-text-muted mt-1">
                      Track when your regular items go on sale
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <Percent className="w-6 h-6 text-sage mb-2 mx-auto" />
                    <p className="text-sm font-medium text-text-primary">Best Prices</p>
                    <p className="text-xs text-text-muted mt-1">
                      Find the lowest prices across stores
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </AppLayout>
    </ProtectedRoute>
  );
}
