"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Receipt as ReceiptIcon, AlertCircle, Loader2 } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api, type Receipt } from "@/lib/api";

export default function ReceiptsPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.receipts.list();
      setReceipts(data);
    } catch (err: any) {
      console.error('Error loading receipts:', err);
      
      // If unauthorized, redirect to sign in
      if (err.status === 401 || err.message?.includes('authorization')) {
        router.push('/auth/signin');
        return;
      }
      
      setError(err.message || "Couldn't load receipts. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number | null) => {
    if (amount === null) return "Amount unknown";
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatStoreName = (name: string | null) => {
    if (!name) return "Store unknown";
    // Capitalize first letter of each word
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getStatusColor = (status: Receipt["parse_status"]) => {
    switch (status) {
      case "success":
        return "text-success";
      case "pending":
        return "text-amber";
      case "failed":
      case "needs_review":
        return "text-error";
      default:
        return "text-text-muted";
    }
  };

  const getStatusText = (status: Receipt["parse_status"]) => {
    switch (status) {
      case "success":
        return "Parsed";
      case "pending":
        return "Processing";
      case "failed":
        return "Failed";
      case "needs_review":
        return "Needs review";
      default:
        return status;
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
                    Couldn't load receipts
                  </h3>
                  <p className="text-text-secondary mb-8">{error}</p>
                  <Button onClick={loadReceipts}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (receipts.length === 0) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-4xl mx-auto px-6 py-12"
          >
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mx-auto mb-6">
                    <ReceiptIcon className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    No receipts yet
                  </h3>
                  <p className="text-text-secondary mb-8">
                    Upload your first receipt to help Savvy start learning.
                  </p>
                  <Button onClick={() => router.push("/receipts/upload")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Receipt
                  </Button>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Receipts</h1>
              <p className="text-text-secondary">
                {receipts.length} {receipts.length === 1 ? "receipt" : "receipts"} uploaded
              </p>
            </div>
            <Button onClick={() => router.push("/receipts/upload")}>
              <Plus className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>

          <div className="space-y-3">
            {receipts.map((receipt, index) => (
              <div key={receipt.receipt_id || index}>
                <Card
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/receipts/${receipt.receipt_id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-text-primary">
                            {formatStoreName(receipt.store_name)}
                          </h3>
                          <span
                            className={`text-xs font-medium ${getStatusColor(
                              receipt.parse_status
                            )}`}
                          >
                            {getStatusText(receipt.parse_status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <span>{formatDate(receipt.purchase_date)}</span>
                          <span>•</span>
                          <span>{formatAmount(receipt.total_amount)}</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center flex-shrink-0">
                        <ReceiptIcon className="w-5 h-5 text-sage" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </motion.div>
    </AppLayout>
    </ProtectedRoute>
  );
}
