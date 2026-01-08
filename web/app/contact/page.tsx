"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PageLayout } from "@/components/page-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-text-secondary">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    We typically respond within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
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
                      <h3 className="text-xl font-semibold text-text-primary mb-2">
                        Message sent!
                      </h3>
                      <p className="text-text-secondary">
                        We'll get back to you as soon as possible.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-text-primary"
                        >
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-text-primary"
                        >
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="text-sm font-medium text-text-primary"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          placeholder="How can we help?"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                          className="flex w-full rounded-xl border border-border bg-card px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-sage" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">
                        Email
                      </h3>
                      <p className="text-sm text-text-secondary mb-2">
                        For general inquiries
                      </p>
                      <a
                        href="mailto:hello@nimbly.app"
                        className="text-sm text-sage hover:underline"
                      >
                        hello@nimbly.app
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-sage" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">
                        Support
                      </h3>
                      <p className="text-sm text-text-secondary mb-2">
                        Need help with your account?
                      </p>
                      <a
                        href="mailto:support@nimbly.app"
                        className="text-sm text-sage hover:underline"
                      >
                        support@nimbly.app
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sage/5 border-sage/20">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-text-primary mb-2">
                    Response Time
                  </h3>
                  <p className="text-sm text-text-secondary">
                    We aim to respond to all inquiries within 24 hours during business days.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
}
