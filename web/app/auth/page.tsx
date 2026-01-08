"use client";

import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageLayout } from "@/components/page-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api";
import { setAuthToken, isAuthenticated } from "@/lib/auth";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/receipts");
    }
  }, [router]);

  // Handle magic link verification
  useEffect(() => {
    const token = searchParams.get("token");
    if (token && !isVerifying) {
      verifyToken(token);
    }
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const response = await authApi.verifyMagicLink(token);
      setAuthToken(response.access_token);
      
      // Redirect to receipts
      setTimeout(() => {
        router.push("/receipts");
      }, 500);
    } catch (err: any) {
      setError(err.message || "Invalid or expired magic link");
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authApi.requestMagicLink(email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send magic link");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center px-4 sm:px-6 pt-16 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-sage/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-6xl">🐇</span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Verifying...
            </h1>
            <p className="text-base text-text-secondary">
              Please wait while we sign you in.
            </p>
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-center px-4 sm:px-6 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo and Title outside card */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 rounded-3xl bg-sage/10 flex items-center justify-center mx-auto mb-4">
              <motion.span
                className="text-6xl inline-block"
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                🐇
              </motion.span>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome to Nimbly
            </h1>
            <p className="text-base text-text-secondary">
              {isSuccess
                ? "Check your email for a magic link"
                : "Sign in with your email address"}
            </p>
          </div>

          <Card>
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 px-6"
              >
                <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-sage"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-text-primary font-medium mb-2">
                  Magic link sent to {email}
                </p>
                <p className="text-sm text-text-secondary">
                  Click the link in your email to sign in. The link expires in 15 minutes.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-text-primary"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !email}
                >
                  {isLoading ? "Sending..." : "Send Magic Link"}
                </Button>
                <p className="text-xs text-text-muted text-center">
                  No password needed. We'll email you a secure link to sign in.
                </p>
              </form>
            )}
          </Card>

          {!isSuccess && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-text-muted text-center mt-6"
            >
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-sage hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-sage hover:underline">
                Privacy Policy
              </a>
              .
            </motion.p>
          )}
        </motion.div>
      </div>
    </PageLayout>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading...</p>
          </div>
        </div>
      </PageLayout>
    }>
      <AuthContent />
    </Suspense>
  );
}
