"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ShoppingBag, 
  Store as StoreIcon,
  Package,
  Sparkles,
  AlertCircle,
  Loader2,
  ChevronRight
} from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

interface InsightDataPoint {
  date: string | null;
  price: number | null;
  receipt_id: string | null;
}

interface Insight {
  type: string;
  title: string;
  description: string;
  data_points: number;
  confidence: "high" | "medium" | "low";
  underlying_data: InsightDataPoint[];
  generated_at: string;
}

interface InsightsResponse {
  insights: Insight[];
  message: string | null;
}

export default function InsightsPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.insights.list() as InsightsResponse;
      setInsights(data.insights || []);
      setMessage(data.message || null);
    } catch (err: any) {
      console.error('Error loading insights:', err);
      
      // If unauthorized, redirect to sign in
      if (err.status === 401 || err.message?.includes('authorization')) {
        router.push('/auth/signin');
        return;
      }
      
      setError(err.message || "Couldn't load insights. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "purchase_frequency":
        return <ShoppingBag className="w-5 h-5" />;
      case "price_trend":
        return <TrendingUp className="w-5 h-5" />;
      case "common_purchase":
        return <Package className="w-5 h-5" />;
      case "store_pattern":
        return <StoreIcon className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "purchase_frequency":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "price_trend":
        return "bg-sage/10 text-sage";
      case "common_purchase":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
      case "store_pattern":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      default:
        return "bg-sage/10 text-sage";
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: "bg-success/10 text-success",
      medium: "bg-amber/10 text-amber",
      low: "bg-text-muted/10 text-text-muted"
    };
    
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors[confidence as keyof typeof colors]}`}>
        {confidence} confidence
      </span>
    );
  };

  const getPriceTrendIcon = (description: string) => {
    if (description.includes("increased")) {
      return <TrendingUp className="w-4 h-4 text-error" />;
    } else if (description.includes("decreased")) {
      return <TrendingDown className="w-4 h-4 text-success" />;
    } else {
      return <Minus className="w-4 h-4 text-text-muted" />;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-4xl mx-auto px-6 py-12"
          >
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-sage animate-spin" />
            </div>
          </motion.div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-4xl mx-auto px-6 py-12"
          >
            <Card className="border-error/20 bg-error/5">
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-error" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    Couldn't load insights
                  </h3>
                  <p className="text-text-secondary mb-8">{error}</p>
                  <button
                    onClick={loadInsights}
                    className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (insights.length === 0) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-4xl mx-auto px-6 py-12"
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Insights</h1>
              <p className="text-text-secondary">
                Discover patterns in your shopping habits
              </p>
            </div>

            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    No insights yet
                  </h3>
                  <p className="text-text-secondary mb-8 max-w-md mx-auto">
                    {message || "Upload more receipts to start seeing patterns. We need at least 3 receipts to generate insights."}
                  </p>
                  <button
                    onClick={() => router.push("/receipts/upload")}
                    className="px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage/90 transition-colors"
                  >
                    Upload Receipt
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-6 py-12"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Insights</h1>
            <p className="text-text-secondary">
              {insights.length} {insights.length === 1 ? "insight" : "insights"} based on your receipts
            </p>
          </div>

          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-text-primary">
                          {insight.title}
                        </h3>
                        {getConfidenceBadge(insight.confidence)}
                      </div>

                      <div className="flex items-start gap-2 mb-3">
                        {insight.type === "price_trend" && getPriceTrendIcon(insight.description)}
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {insight.description}
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span>Based on {insight.data_points} data {insight.data_points === 1 ? "point" : "points"}</span>
                        <span>•</span>
                        <span>
                          {new Date(insight.generated_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>

                      {/* View receipts link */}
                      {insight.underlying_data.length > 0 && (
                        <button
                          onClick={() => {
                            const firstReceipt = insight.underlying_data.find(d => d.receipt_id);
                            if (firstReceipt?.receipt_id) {
                              router.push(`/receipts/${firstReceipt.receipt_id}`);
                            }
                          }}
                          className="mt-3 text-sm text-sage hover:text-sage/80 transition-colors flex items-center gap-1 group"
                        >
                          View related receipts
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info card */}
          <Card className="mt-8 border-sage/20 bg-sage/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-text-primary mb-1">
                    How insights work
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Insights are generated from your receipt data. We look for patterns in your shopping habits, 
                    price changes, and purchase frequency. All insights are factual observations based on your 
                    uploaded receipts—we never make predictions or recommendations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AppLayout>
    </ProtectedRoute>
  );
}
