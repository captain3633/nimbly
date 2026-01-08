"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Terms of Service
          </h1>
          <p className="text-text-secondary mb-8">
            Last updated: January 8, 2026
          </p>

          <div className="prose prose-lg max-w-none space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Agreement to Terms
                </h2>
                <p className="text-text-secondary mb-4">
                  By accessing or using Nimbly, you agree to be bound by these Terms of Service. If you don't agree with any part of these terms, you may not use our service.
                </p>
                <p className="text-text-secondary">
                  These terms apply to all users of Nimbly, including both free and paid accounts (when available).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Description of Service
                </h2>
                <p className="text-text-secondary mb-4">
                  Nimbly is a receipt tracking and spending pattern analysis tool. We provide:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Receipt upload and OCR parsing</li>
                  <li>• Price history tracking</li>
                  <li>• Factual insights about spending patterns</li>
                  <li>• Data storage and organization</li>
                </ul>
                <p className="text-text-secondary mt-4">
                  Nimbly does not provide financial advice, predictions, or recommendations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  User Accounts
                </h2>
                <p className="text-text-secondary mb-4">
                  To use Nimbly, you must:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Be at least 18 years old</li>
                  <li>• Provide a valid email address</li>
                  <li>• Keep your account secure</li>
                  <li>• Not share your account with others</li>
                  <li>• Notify us of any unauthorized access</li>
                </ul>
                <p className="text-text-secondary mt-4">
                  You are responsible for all activity that occurs under your account.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Acceptable Use
                </h2>
                <p className="text-text-secondary mb-4">
                  You agree not to:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Upload illegal, harmful, or offensive content</li>
                  <li>• Attempt to access other users' data</li>
                  <li>• Reverse engineer or copy our software</li>
                  <li>• Use automated tools to scrape our service</li>
                  <li>• Interfere with the service's operation</li>
                  <li>• Violate any applicable laws or regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Your Content
                </h2>
                <p className="text-text-secondary mb-4">
                  You retain all rights to the receipts and data you upload to Nimbly. By uploading content, you grant us a license to:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Store and process your receipts</li>
                  <li>• Parse and analyze your data</li>
                  <li>• Display your data back to you</li>
                  <li>• Generate insights based on your data</li>
                </ul>
                <p className="text-text-secondary mt-4">
                  This license ends when you delete your account or remove specific content.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Accuracy of Information
                </h2>
                <p className="text-text-secondary mb-4">
                  Nimbly uses OCR technology to parse receipts. While we strive for accuracy, we cannot guarantee that all parsed data is 100% correct.
                </p>
                <p className="text-text-secondary mb-4">
                  You are responsible for reviewing parsed receipts and reporting any errors. We are not liable for decisions made based on inaccurate data.
                </p>
                <p className="text-text-secondary">
                  Insights provided by Savvy are observations based on your data, not financial advice.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Service Availability
                </h2>
                <p className="text-text-secondary mb-4">
                  We strive to keep Nimbly available 24/7, but we don't guarantee uninterrupted access. The service may be unavailable due to:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Scheduled maintenance</li>
                  <li>• Technical issues</li>
                  <li>• Force majeure events</li>
                  <li>• Third-party service disruptions</li>
                </ul>
                <p className="text-text-secondary mt-4">
                  We'll notify you of planned maintenance when possible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Termination
                </h2>
                <p className="text-text-secondary mb-4">
                  You may delete your account at any time. Upon deletion, we'll permanently remove your data within 30 days.
                </p>
                <p className="text-text-secondary">
                  We reserve the right to suspend or terminate accounts that violate these terms or engage in abusive behavior.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Limitation of Liability
                </h2>
                <p className="text-text-secondary mb-4">
                  Nimbly is provided "as is" without warranties of any kind. We are not liable for:
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Inaccurate receipt parsing</li>
                  <li>• Lost or corrupted data</li>
                  <li>• Financial decisions based on our insights</li>
                  <li>• Service interruptions or downtime</li>
                  <li>• Third-party actions or services</li>
                </ul>
                <p className="text-text-secondary mt-4">
                  Our total liability to you shall not exceed the amount you paid us in the past 12 months.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Changes to Terms
                </h2>
                <p className="text-text-secondary mb-4">
                  We may update these terms from time to time. We'll notify you of significant changes by email or through the app.
                </p>
                <p className="text-text-secondary">
                  Continued use of Nimbly after changes means you accept the updated terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Governing Law
                </h2>
                <p className="text-text-secondary">
                  These terms are governed by the laws of the United States. Any disputes will be resolved in the courts of [Your Jurisdiction].
                </p>
              </CardContent>
            </Card>

            <Card className="bg-sage/5 border-sage/20">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Contact Us
                </h2>
                <p className="text-text-secondary mb-4">
                  If you have questions about these terms, please contact us:
                </p>
                <p className="text-text-secondary">
                  Email: <a href="mailto:legal@nimbly.app" className="text-sage hover:underline">legal@nimbly.app</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
