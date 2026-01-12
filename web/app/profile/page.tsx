"use client";

import { motion } from "framer-motion";
import { User, Mail, Calendar, LogOut } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { removeAuthToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function ProfilePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // Try to get user email from token or storage
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserEmail(payload.email || "user@example.com");
      } catch {
        setUserEmail("user@example.com");
      }
    }
  }, []);

  const handleSignOut = () => {
    removeAuthToken();
    router.push("/auth");
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Profile</h1>
              <p className="text-text-secondary">
                Manage your account settings
              </p>
            </div>

            <div className="space-y-4">
              {/* User Info Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-sage" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-text-primary">
                        {userEmail.split('@')[0]}
                      </h2>
                      <p className="text-text-secondary">{userEmail}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-text-secondary">
                      <Mail className="w-5 h-5" />
                      <span>{userEmail}</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-secondary">
                      <Calendar className="w-5 h-5" />
                      <span>Member since {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Settings Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-text-primary mb-4">
                    Account Settings
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface transition-colors text-text-secondary">
                      Change Password
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface transition-colors text-text-secondary">
                      Email Preferences
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface transition-colors text-text-secondary">
                      Privacy Settings
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-error/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-text-primary mb-4">
                    Danger Zone
                  </h3>
                  <Button
                    onClick={handleSignOut}
                    variant="secondary"
                    className="w-full justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
      </AppLayout>
    </ProtectedRoute>
  );
}
