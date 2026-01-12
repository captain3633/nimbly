"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  const homeLink = isAuth ? "/dashboard" : "/";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card>
          <CardContent className="py-16 px-6">
            <div className="text-center">
              {/* 404 Illustration */}
              <div className="w-24 h-24 rounded-3xl bg-sage/10 flex items-center justify-center mx-auto mb-6">
                <motion.span
                  className="text-6xl inline-block"
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  🐇
                </motion.span>
              </div>

              {/* Error Message */}
              <h1 className="text-6xl font-bold text-sage mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-text-primary mb-3">
                Page Not Found
              </h2>
              <p className="text-text-secondary mb-8">
                Looks like this bunny hopped away. The page you're looking for doesn't exist.
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => window.history.back()}
                  variant="secondary"
                  className="flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                <Link href={homeLink}>
                  <Button className="w-full sm:w-auto flex items-center justify-center">
                    <Home className="w-4 h-4 mr-2" />
                    {isAuth ? "Go to Dashboard" : "Go Home"}
                  </Button>
                </Link>
              </div>

              {/* Quick Links */}
              {isAuth && (
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-text-muted mb-3">Quick links:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Link href="/dashboard" className="text-sm text-sage hover:underline">
                      Dashboard
                    </Link>
                    <span className="text-text-muted">•</span>
                    <Link href="/receipts" className="text-sm text-sage hover:underline">
                      Receipts
                    </Link>
                    <span className="text-text-muted">•</span>
                    <Link href="/insights" className="text-sm text-sage hover:underline">
                      Insights
                    </Link>
                    <span className="text-text-muted">•</span>
                    <Link href="/deals" className="text-sm text-sage hover:underline">
                      Deals
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
