"use client";

import { motion } from "framer-motion";
import { AppLayout } from "@/components/app-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Lightbulb, Upload, TrendingUp, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="min-h-screen p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome back!</h1>
              <p className="text-text-secondary">Here's what's happening with your spending.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-sage" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Total Receipts</p>
                    <p className="text-2xl font-bold text-text-primary">0</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-sage" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">This Month</p>
                    <p className="text-2xl font-bold text-text-primary">$0.00</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-sage" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Insights</p>
                    <p className="text-2xl font-bold text-text-primary">0</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Receipt Card */}
              <Card className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-sage" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">Upload Receipt</h3>
                    <p className="text-sm text-text-secondary">
                      Start tracking your spending by uploading your first receipt
                    </p>
                  </div>
                  <Link href="/receipts/upload" className="w-full">
                    <Button className="w-full">Upload Now</Button>
                  </Link>
                </div>
              </Card>

              {/* View Insights Card */}
              <Card className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-sage" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">View Insights</h3>
                    <p className="text-sm text-text-secondary">
                      Discover patterns and trends in your spending habits
                    </p>
                  </div>
                  <Link href="/insights" className="w-full">
                    <Button variant="secondary" className="w-full">Explore Insights</Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">Recent Activity</h2>
              <Card className="p-8">
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">No receipts yet</h3>
                  <p className="text-sm text-text-secondary mb-6">
                    Upload your first receipt to start tracking your spending
                  </p>
                  <Link href="/receipts/upload">
                    <Button>Upload Receipt</Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </AppLayout>
    </ProtectedRoute>
  );
}
