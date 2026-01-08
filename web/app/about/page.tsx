"use client";

import { motion } from "framer-motion";
import { PageLayout } from "@/components/page-layout";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function AboutPage() {
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
          <motion.h1
            variants={fadeInUp}
            className="text-4xl lg:text-5xl font-bold text-text-primary mb-6"
          >
            About Nimbly
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-text-secondary mb-12"
          >
            Groceries are getting expensive. Everyday spending decisions are getting harder. Most tools either shame you or overwhelm you.
          </motion.p>

          <motion.div variants={fadeInUp} className="prose prose-lg max-w-none">
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Our Philosophy
                </h2>
                <p className="text-text-secondary mb-4">
                  Nimbly exists to help everyday people spend smarter on essentials, make better decisions without stress, and build healthier money habits over time.
                </p>
                <p className="text-text-secondary mb-4">
                  We're not about extreme budgeting or complex financial tools. We're about small wins and real relief—helping you move smart, consistently.
                </p>
                <p className="text-text-secondary">
                  Small, repeatable wins. Long game.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  What We Do
                </h2>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start">
                    <span className="text-sage mr-2">✓</span>
                    <span>Surface grocery deals and clearances</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sage mr-2">✓</span>
                    <span>Help you spot better buying opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sage mr-2">✓</span>
                    <span>Encourage smarter timing on everyday purchases</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sage mr-2">✓</span>
                    <span>Keep the experience fast, light, and human</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  What We Don't Do
                </h2>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start">
                    <span className="text-text-muted mr-2">✗</span>
                    <span>Shame you with budget alerts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-text-muted mr-2">✗</span>
                    <span>Overwhelm you with complex features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-text-muted mr-2">✗</span>
                    <span>Use finance jargon or technical terms</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-text-muted mr-2">✗</span>
                    <span>Sell your data to advertisers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-text-muted mr-2">✗</span>
                    <span>Create guilt or pressure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  Why "Nimbly"?
                </h2>
                <p className="text-text-secondary mb-4">
                  The word "nimbly" means moving quickly and lightly. We chose it because understanding your spending shouldn't feel heavy or complicated.
                </p>
                <p className="text-text-secondary">
                  Move fast. Stay aware. Don't get played. That's Nimbly.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
