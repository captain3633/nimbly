"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageLayout } from "@/components/page-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api";
import { setAuthToken, isAuthenticated } from "@/lib/auth";

type AuthMode = "signin" | "signup" | "magic";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [prevMode, setPrevMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleModeChange = (newMode: AuthMode) => {
    setPrevMode(mode);
    setMode(newMode);
    setError(null);
  };

  const getDirection = () => {
    const modes: AuthMode[] = ["signin", "signup", "magic"];
    const prevIndex = modes.indexOf(prevMode);
    const currentIndex = modes.indexOf(mode);
    return currentIndex > prevIndex ? 1 : -1;
  };

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token && !isVerifying) {
      verifyToken(token);
    }
  }, [searchParams, isVerifying]);

  const verifyToken = async (token: string) => {
    setIsVerifying(true);
    setError(null);

    try {
      const response = await authApi.verifyMagicLink(token);
      setAuthToken(response.session_token);
      setTimeout(() => router.push("/dashboard"), 500);
    } catch (err: any) {
      setError(err.message || "Invalid or expired magic link");
      setIsVerifying(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.signUp(email, password);
      setAuthToken(response.session_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.signIn(email, password);
      setAuthToken(response.session_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
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

  const handleSocialAuth = (provider: string) => {
    setError(`${provider} authentication coming soon!`);
    // TODO: Implement OAuth flows
  };

  if (isVerifying) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center px-4 sm:px-6 pt-16 pb-8 min-h-[600px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-sage/10 flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img 
                src="/logo.gif" 
                alt="Nimbly Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Verifying...</h1>
            <p className="text-base text-text-secondary">Please wait while we sign you in.</p>
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl max-w-md">
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
          {/* Logo and Title */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 rounded-3xl bg-sage/10 flex items-center justify-center mx-auto mb-4 overflow-hidden">
              <img 
                src="/logo.gif" 
                alt="Nimbly Logo" 
                className="w-20 h-20 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome to Nimbly</h1>
            <p className="text-base text-text-secondary">
              {mode === "signin" && "Sign in to your account"}
              {mode === "signup" && "Create your account"}
              {mode === "magic" && (isSuccess ? "Check your email" : "Sign in with magic link")}
            </p>
          </div>

          <Card>
            {/* Tabs */}
            {!isSuccess && (
              <div className="flex border-b border-border">
                <button
                  onClick={() => handleModeChange("signin")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    mode === "signin"
                      ? "text-sage border-b-2 border-sage"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleModeChange("signup")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    mode === "signup"
                      ? "text-sage border-b-2 border-sage"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => handleModeChange("magic")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    mode === "magic"
                      ? "text-sage border-b-2 border-sage"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Magic Link
                </button>
              </div>
            )}

            {/* Fixed height container */}
            <div className="h-[400px] overflow-hidden">
              {/* Magic Link Success */}
              {isSuccess && mode === "magic" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 px-6"
                >
                  <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-text-primary font-medium mb-2">Magic link sent to {email}</p>
                  <p className="text-sm text-text-secondary mb-4">
                    Click the link in your email to sign in. The link expires in 15 minutes.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                    className="mt-4"
                  >
                    Send Another Link
                  </Button>
                </motion.div>
              ) : (
                <div className="p-5">
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                      >
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {/* Sign In Form */}
                    {mode === "signin" && (
                      <motion.div
                        key="signin"
                        initial={{ opacity: 0, x: getDirection() * 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: getDirection() * -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <form onSubmit={handleSignIn} className="space-y-2.5">
                          <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-text-primary">
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
                          <div className="space-y-1.5">
                            <label htmlFor="password" className="text-sm font-medium text-text-primary">
                              Password
                            </label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              disabled={isLoading}
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={isLoading || !email || !password}>
                            {isLoading ? "Signing in..." : "Sign In"}
                          </Button>

                          {/* Divider */}
                          <div className="relative my-2.5">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                              <span className="px-2 bg-card text-text-muted">Or continue with</span>
                            </div>
                          </div>

                          {/* Social Auth Buttons */}
                          <div className="grid grid-cols-3 gap-2.5">
                            <button
                              type="button"
                              onClick={() => handleSocialAuth("Google")}
                              className="flex items-center justify-center p-2.5 border border-border rounded-lg hover:bg-surface transition-colors"
                              title="Continue with Google"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                  fill="#4285F4"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="#34A853"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="#FBBC05"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                  fill="#EA4335"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSocialAuth("Apple")}
                              className="flex items-center justify-center p-2.5 border border-border rounded-lg hover:bg-surface transition-colors"
                              title="Continue with Apple"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSocialAuth("Facebook")}
                              className="flex items-center justify-center p-2.5 border border-border rounded-lg hover:bg-surface transition-colors"
                              title="Continue with Facebook"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    {/* Sign Up Form */}
                    {mode === "signup" && (
                      <motion.div
                        key="signup"
                        initial={{ opacity: 0, x: getDirection() * 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: getDirection() * -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <form onSubmit={handleSignUp} className="space-y-2.5">
                          <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-text-primary">
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
                          <div className="space-y-1.5">
                            <label htmlFor="password" className="text-sm font-medium text-text-primary">
                              Password
                            </label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              disabled={isLoading}
                            />
                            <p className="text-xs text-text-muted">
                              At least 8 characters with uppercase, lowercase, and number
                            </p>
                          </div>
                          <div className="space-y-1.5">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-text-primary">
                              Confirm Password
                            </label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="••••••••"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              disabled={isLoading}
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || !email || !password || !confirmPassword}
                          >
                            {isLoading ? "Creating account..." : "Sign Up"}
                          </Button>
                        </form>
                      </motion.div>
                    )}

                    {/* Magic Link Form */}
                    {mode === "magic" && (
                      <motion.div
                        key="magic"
                        initial={{ opacity: 0, x: getDirection() * 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: getDirection() * -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <form onSubmit={handleMagicLink} className="space-y-2.5">
                          <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-text-primary">
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
                          <Button type="submit" className="w-full" disabled={isLoading || !email}>
                            {isLoading ? "Sending..." : "Send Magic Link"}
                          </Button>
                          <p className="text-xs text-text-muted text-center">
                            No password needed. We'll email you a secure link to sign in.
                          </p>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
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
    <Suspense
      fallback={
        <PageLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading...</p>
            </div>
          </div>
        </PageLayout>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
