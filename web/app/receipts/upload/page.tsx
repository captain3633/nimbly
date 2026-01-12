"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, FileText, Image, AlertCircle, CheckCircle2 } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

type UploadStatus = "idle" | "uploading" | "parsing" | "success" | "error";

export default function UploadReceiptPage() {
  const router = useRouter();
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/png", "application/pdf", "text/plain"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      return "Receipt must be JPEG, PNG, PDF, or text file.";
    }

    if (file.size > maxSize) {
      return "File size must be less than 10MB.";
    }

    return null;
  };

  const handleUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setStatus("error");
      return;
    }

    try {
      setStatus("uploading");
      setError(null);
      setProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await api.receipts.upload(file);

      clearInterval(progressInterval);
      setProgress(100);
      setStatus("parsing");
      setReceiptId(response.receipt_id);

      // Wait a moment to show parsing status
      setTimeout(() => {
        setStatus("success");
      }, 1500);
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Couldn't upload receipt. Try again.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleViewReceipt = () => {
    if (receiptId) {
      router.push(`/receipts/${receiptId}`);
    }
  };

  const handleUploadAnother = () => {
    setStatus("idle");
    setProgress(0);
    setError(null);
    setReceiptId(null);
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="max-w-2xl mx-auto px-6 py-12"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Upload Receipt
          </h1>
          <p className="text-text-secondary mb-8">
            Upload a photo or file of your grocery receipt. Savvy will extract the details.
          </p>

          {status === "idle" && (
            <Card
              className={`border-2 border-dashed transition-colors ${
                isDragging
                  ? "border-sage bg-sage/5"
                  : "border-border hover:border-sage/50"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    Drop your receipt here
                  </h3>
                  <p className="text-text-secondary mb-6">
                    or click to browse
                  </p>
                  <input
                    type="file"
                    id="receipt-upload"
                    className="hidden"
                    accept="image/jpeg,image/png,application/pdf,text/plain"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="receipt-upload">
                    <Button asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                  <div className="mt-6 flex items-center justify-center gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      <span>JPEG, PNG</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>PDF, TXT</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(status === "uploading" || status === "parsing") && (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mx-auto mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Upload className="w-8 h-8 text-sage" />
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    {status === "uploading" ? "Uploading receipt..." : "Reading receipt..."}
                  </h3>
                  <p className="text-text-secondary mb-6">
                    {status === "uploading"
                      ? "This will just take a moment."
                      : "Extracting store, date, and items."}
                  </p>
                  <div className="max-w-xs mx-auto">
                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-sage"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-sage/20 bg-sage/5">
                <CardContent className="py-16">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-sage" />
                    </div>
                    <h3 className="text-lg font-medium text-text-primary mb-2">
                      Receipt added
                    </h3>
                    <p className="text-text-secondary mb-8">
                      Details extracted and saved. View the full receipt or upload another.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={handleViewReceipt}>
                        View Receipt
                      </Button>
                      <Button variant="secondary" onClick={handleUploadAnother}>
                        Upload Another
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-error/20 bg-error/5">
                <CardContent className="py-16">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="w-8 h-8 text-error" />
                    </div>
                    <h3 className="text-lg font-medium text-text-primary mb-2">
                      Upload failed
                    </h3>
                    <p className="text-text-secondary mb-8">
                      {error || "Something went wrong. Try again."}
                    </p>
                    <Button onClick={handleUploadAnother}>
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </AppLayout>
    </ProtectedRoute>
  );
}
