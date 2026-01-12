"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Receipt as ReceiptIcon, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type ReceiptDetail } from "@/lib/api";

export default function ReceiptDetailPage() {
  const router = useRouter();
  const params = useParams();
  const receiptId = params.id as string;

  const [receipt, setReceipt] = useState<ReceiptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (receiptId) {
      loadReceipt();
    }
  }, [receiptId]);

  const loadReceipt = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.receipts.get(receiptId);
      setReceipt(data);
    } catch (err: any) {
      // If unauthorized, redirect to sign in
      if (err.status === 401 || err.message?.includes('authorization')) {
        router.push('/auth/signin');
        return;
      }
      
      setError(err.message || "Couldn't load receipt. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Date unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: ReceiptDetail["parse_status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "pending":
        return <Loader2 className="w-5 h-5 text-amber animate-spin" />;
      case "failed":
      case "needs_review":
        return <AlertCircle className="w-5 h-5 text-amber" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: ReceiptDetail["parse_status"]) => {
    switch (status) {
      case "success":
        return "Successfully parsed";
      case "pending":
        return "Processing receipt";
      case "failed":
        return "Parsing incomplete";
      case "needs_review":
        return "Needs review";
      default:
        return status;
    }
  };

  const getStatusColor = (status: ReceiptDetail["parse_status"]) => {
    switch (status) {
      case "success":
        return "text-success";
      case "pending":
        return "text-amber";
      case "failed":
      case "needs_review":
        return "text-amber";
      default:
        return "text-text-muted";
    }
  };

  const formatStoreName = (name: string | null) => {
    if (!name) return "Store unknown";
    // Capitalize first letter of each word
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatAmount = (amount: number | null) => {
    if (amount === null) return "Total not available";
    return `$${amount.toFixed(2)}`;
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

  if (error || !receipt) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-4xl mx-auto px-6 py-12"
          >
          <Button
            variant="ghost"
            onClick={() => router.push("/receipts")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Receipts
          </Button>
          <Card className="border-error/20 bg-error/5">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-error" />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Couldn't load receipt
                </h3>
                <p className="text-text-secondary mb-8">
                  {error || "Receipt not found."}
                </p>
                <Button onClick={loadReceipt}>Try Again</Button>
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
          <Button
            variant="ghost"
            onClick={() => router.push("/receipts")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Receipts
          </Button>

          {/* Receipt Header */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-text-primary mb-2">
                    {formatStoreName(receipt.store_name)}
                  </h1>
                  <p className="text-text-secondary">
                    {formatDate(receipt.purchase_date)}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                  <ReceiptIcon className="w-8 h-8 text-sage" />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                {getStatusIcon(receipt.parse_status)}
                <span className={`text-sm font-medium ${getStatusColor(receipt.parse_status)}`}>
                  {getStatusText(receipt.parse_status)}
                </span>
              </div>

              {receipt.parse_error && receipt.parse_status === "failed" && (
                <div className="p-4 rounded-xl bg-amber/5 border border-amber/20 mb-6">
                  <p className="text-sm text-text-secondary">
                    <span className="font-medium text-amber">Note:</span> {receipt.parse_error}
                  </p>
                </div>
              )}

              <div className="pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-text-secondary">Total</span>
                  <span className="text-2xl font-bold text-text-primary">
                    {formatAmount(receipt.total_amount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          {receipt.line_items && receipt.line_items.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Items ({receipt.line_items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {receipt.line_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between py-3 border-b border-border last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-text-primary mb-1">
                          {item.product_name}
                        </p>
                        {item.quantity && item.unit_price && (
                          <p className="text-sm text-text-muted">
                            {item.quantity} × ${item.unit_price.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <span className="font-medium text-text-primary">
                        ${item.total_price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-amber" />
                  </div>
                  <h3 className="text-base font-medium text-text-primary mb-2">
                    No items extracted
                  </h3>
                  <p className="text-sm text-text-secondary">
                    The receipt was uploaded but we couldn't extract line items. The total amount may still be available above.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AppLayout>
    </ProtectedRoute>
  );
}
