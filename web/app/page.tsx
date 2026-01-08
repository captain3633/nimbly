"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PageLayout } from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, TrendingDown, Eye, Shield } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl lg:text-6xl font-bold text-text-primary mb-6"
            >
              Move lighter.
              <br />
              <span className="text-sage">Spend smarter.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto"
            >
              Nimbly helps you make smarter grocery spending choices through deals, clearances, and better timing, without pressure or judgment.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-sage/5 blur-3xl rounded-full -z-10" />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Simple, transparent, trustworthy
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Nimbly isn't about extreme budgeting. It's about moving smart consistently, with the right info at the right time.
            </p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-sage/10 flex items-center justify-center mb-4">
                    <Receipt className="w-6 h-6 text-sage" />
                  </div>
                  <CardTitle className="text-xl">Surface Deals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary">
                    Nimbly highlights grocery deals and clearances so you don't miss opportunities to save.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-sage/10 flex items-center justify-center mb-4">
                    <TrendingDown className="w-6 h-6 text-sage" />
                  </div>
                  <CardTitle className="text-xl">Better Timing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary">
                    Get a heads-up when there's a better move to make.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-sage/10 flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-sage" />
                  </div>
                  <CardTitle className="text-xl">Smarter Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary">
                    Spot better buying opportunities and make smarter choices on everyday purchases.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-sage/10 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-sage" />
                  </div>
                  <CardTitle className="text-xl">Your Data, Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary">
                    Your receipts stay yours. No selling, no sharing, no surprises.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Savvy Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-sage/10 flex items-center justify-center mb-6">
                <motion.span
                  className="text-3xl inline-block"
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
              <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
                Meet Savvy
              </h2>
              <p className="text-lg text-text-secondary mb-6">
                Your in-app guide. Savvy keeps an eye on prices, notices patterns, and gives you a heads-up when there's a better move to make.
              </p>
              <p className="text-text-secondary mb-8">
                No lectures. No judgment. Just the right info at the right time.
              </p>
              <Link href="/savvy">
                <Button variant="link" className="px-0">
                  Learn more about Savvy →
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-sage/5 border-sage/20">
                <CardHeader>
                  <CardTitle className="text-sage">Savvy noticed</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-text-primary font-medium mb-1">
                      You've shopped at Whole Foods 8 times in the past 30 days.
                    </p>
                    <p className="text-sm text-text-muted">
                      Based on 8 receipts • High confidence
                    </p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-text-primary font-medium mb-1">
                      Almond Milk at Whole Foods: $4.49 on Dec 20, $4.99 on Jan 5.
                    </p>
                    <p className="text-sm text-text-muted">
                      Price increased $0.50 over 2 weeks
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-surface/30">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Ready to understand your spending?
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Start tracking receipts today. No credit card required.
            </p>
            <Link href="/auth">
              <Button size="lg">Get Started Free</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
