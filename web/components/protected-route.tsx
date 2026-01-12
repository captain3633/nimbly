"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, removeAuthToken, getAuthToken } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push("/auth");
        return;
      }

      // Validate token format and expiry
      const token = getAuthToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Check if expired
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < now) {
            console.log('Token expired');
            removeAuthToken();
            router.push("/auth");
            return;
          }
          
          // Check token type
          if (payload.type !== 'session') {
            console.log('Invalid token type:', payload.type);
            removeAuthToken();
            router.push("/auth");
            return;
          }
        } catch (error) {
          console.error('Token validation error:', error);
          removeAuthToken();
          router.push("/auth");
          return;
        }
      }
      
      setIsChecking(false);
    };
    
    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Verifying...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
