"use client";

import { PageLayout } from "@/components/page-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { removeAuthToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ReceiptsPage() {
  const router = useRouter();

  const handleLogout = () => {
    removeAuthToken();
    router.push("/");
  };

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-text-primary">Receipts</h1>
            <Button variant="secondary" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>

          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📄</span>
            </div>
            <h2 className="text-2xl font-semibold text-text-primary mb-2">
              No receipts yet
            </h2>
            <p className="text-text-secondary mb-6">
              Upload your first receipt to start tracking prices and patterns.
            </p>
            <Button>Upload Receipt</Button>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
