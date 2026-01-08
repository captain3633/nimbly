"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function SavvyPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="w-24 h-24 rounded-3xl bg-sage/10 flex items-center justify-center mx-auto mb-6">
              <motion.span
                className="text-6xl inline-block"
                animate={{
                  rotate: [-3, 3, -3],
                  x: [-2, 2, -2],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🌾
              </motion.span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              Meet Savvy
            </h1>
            <p className="text-xl text-text-secondary">
              Your in-app guide
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  What Savvy Does
                </h2>
                <p className="text-text-secondary mb-4">
                  Savvy is your in-app guide for Nimbly. It keeps an eye on prices, notices patterns, and gives you a heads-up when there's a better move to make.
                </p>
                <p className="text-text-secondary mb-4">
                  When you upload receipts, Savvy helps you:
                </p>
                <ul className="space-y-2 text-text-secondary ml-6">
                  <li>• Surface grocery deals and clearances</li>
                  <li>• Spot better buying opportunities</li>
                  <li>• Make smarter timing decisions</li>
                  <li>• Build awareness of price patterns</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-sage/5 border-sage/20">
              <CardHeader>
                <CardTitle className="text-sage">Example Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-text-primary font-medium mb-2">
                    "You've shopped at Whole Foods 8 times in the past 30 days."
                  </p>
                  <p className="text-sm text-text-muted">
                    Based on 8 receipts • High confidence
                  </p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-text-primary font-medium mb-2">
                    "Almond Milk at Whole Foods: $4.49 on Dec 20, $4.79 on Dec 28, $4.99 on Jan 5."
                  </p>
                  <p className="text-sm text-text-muted">
                    Price increased $0.50 over 3 weeks
                  </p>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-text-primary font-medium mb-2">
                    "You buy bananas regularly. Purchased 6 times in the past month."
                  </p>
                  <p className="text-sm text-text-muted">
                    Based on 6 purchases • High confidence
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  What Savvy Doesn't Do
                </h2>
                <p className="text-text-secondary mb-4">
                  Savvy is designed with clear boundaries. It will never:
                </p>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start">
                    <span className="text-text-muted mr-2">✗</span>
                    <span>Predict what you'll spend next month</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-text-muted mr-2">✗</span>
                    <span>Recommend products or stores</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-text-muted mr-2">✗</span>
                    <span>Judge your spending as "good" or "bad"</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-text-muted mr-2">✗</span>
                    <span>Create urgency or pressure to act</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-text-muted mr-2">✗</span>
                    <span>Use financial jargon or complex terms</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Savvy's Voice
                </h2>
                <p className="text-text-secondary mb-4">
                  Savvy speaks in a calm, observant tone. It's factual without being cold, helpful without being pushy.
                </p>
                <div className="bg-surface/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-text-muted mb-2">Savvy says:</p>
                  <p className="text-text-primary">
                    "Not enough data yet to spot price trends for this product."
                  </p>
                </div>
                <div className="bg-surface/50 rounded-lg p-4">
                  <p className="text-sm text-text-muted mb-2">Savvy never says:</p>
                  <p className="text-text-primary line-through opacity-50">
                    "You're spending too much on groceries!"
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Transparency First
                </h2>
                <p className="text-text-secondary mb-4">
                  Every insight Savvy shares includes the underlying data. You'll always see:
                </p>
                <ul className="space-y-2 text-text-secondary ml-6">
                  <li>• How many receipts the insight is based on</li>
                  <li>• The confidence level (high, medium, or low)</li>
                  <li>• The specific data points behind the observation</li>
                </ul>
                <p className="text-text-secondary mt-4">
                  If Savvy doesn't have enough data to make an observation, it says so clearly: "Savvy is learning. Upload more receipts to see patterns."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-sage/5 border-sage/20">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-sage mb-4">
                  Why "Savvy"?
                </h2>
                <p className="text-text-secondary mb-4">
                  The word "savvy" means having practical knowledge and understanding. That's exactly what this feature provides, practical insights based on your actual spending, not predictions or assumptions.
                </p>
                <p className="text-text-secondary">
                  Savvy helps you become more aware of your patterns without telling you what to do about them. The decisions are always yours.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
