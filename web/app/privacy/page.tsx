"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-text-secondary mb-8">
            Last updated: January 8, 2026
          </p>

          <div className="prose prose-lg max-w-none space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Our Commitment
                </h2>
                <p className="text-text-secondary mb-4">
                  Your receipts and spending data are yours. We don't sell your data, we don't share it with advertisers, and we don't use it for anything other than providing you with Nimbly's services.
                </p>
                <p className="text-text-secondary">
                  This privacy policy explains what data we collect, how we use it, and your rights regarding your information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Information We Collect
                </h2>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Information You Provide
                </h3>
                <ul className="space-y-2 text-text-secondary mb-4">
                  <li>• Email address (for authentication)</li>
                  <li>• Receipt images you upload</li>
                  <li>• Parsed receipt data (store names, products, prices, dates)</li>
                </ul>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Information We Collect Automatically
                </h3>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Device information (browser type, operating system)</li>
                  <li>• Usage data (pages visited, features used)</li>
                  <li>• Log data (IP address, timestamps, errors)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-text-secondary mb-4">
                  We use your information to:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Provide and maintain Nimbly's services</li>
                  <li>• Parse your receipts and track price history</li>
                  <li>• Generate insights about your spending patterns</li>
                  <li>• Send you magic links for authentication</li>
                  <li>• Improve our services and fix bugs</li>
                  <li>• Respond to your support requests</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  What We Don't Do
                </h2>
                <ul className="space-y-2 text-text-secondary">
                  <li>• We don't sell your data to third parties</li>
                  <li>• We don't share your data with advertisers</li>
                  <li>• We don't use your data to train AI models for other companies</li>
                  <li>• We don't track you across other websites</li>
                  <li>• We don't send you marketing emails (unless you opt in)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Data Storage and Security
                </h2>
                <p className="text-text-secondary mb-4">
                  Your data is stored securely on servers in the United States. We use industry-standard encryption to protect your information both in transit and at rest.
                </p>
                <p className="text-text-secondary">
                  Receipt images are stored separately from parsed data and are only accessible to you and our parsing system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Your Rights
                </h2>
                <p className="text-text-secondary mb-4">
                  You have the right to:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Access all your data at any time</li>
                  <li>• Export your data in a portable format</li>
                  <li>• Delete your account and all associated data</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Opt out of optional data collection</li>
                </ul>
                <p className="text-text-secondary mt-4">
                  To exercise these rights, contact us at privacy@nimbly.app
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Data Retention
                </h2>
                <p className="text-text-secondary mb-4">
                  We retain your data for as long as your account is active. When you delete your account, we permanently delete all your receipts, parsed data, and personal information within 30 days.
                </p>
                <p className="text-text-secondary">
                  We may retain anonymized, aggregated data for analytics purposes, but this data cannot be linked back to you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Cookies and Tracking
                </h2>
                <p className="text-text-secondary mb-4">
                  We use essential cookies to keep you signed in and remember your preferences (like dark mode). We don't use advertising or tracking cookies.
                </p>
                <p className="text-text-secondary">
                  You can disable cookies in your browser, but some features may not work properly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Changes to This Policy
                </h2>
                <p className="text-text-secondary mb-4">
                  We may update this privacy policy from time to time. We'll notify you of significant changes by email or through the app.
                </p>
                <p className="text-text-secondary">
                  Continued use of Nimbly after changes means you accept the updated policy.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-sage/5 border-sage/20">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Questions?
                </h2>
                <p className="text-text-secondary mb-4">
                  If you have questions about this privacy policy or how we handle your data, please contact us:
                </p>
                <p className="text-text-secondary">
                  Email: <a href="mailto:privacy@nimbly.app" className="text-sage hover:underline">privacy@nimbly.app</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
