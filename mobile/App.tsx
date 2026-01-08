import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ScrollView } from "react-native";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { Button, Card, Text } from "./src/components/ui";
import { ThemeToggle } from "./src/components/ThemeToggle";
import { spacing } from "./src/theme";

function AppContent() {
  const { colors, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === "light" ? "dark" : "light"} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: 'rgba(95, 125, 115, 0.1)' }]}>
              <Text style={styles.logo}>🐇</Text>
            </View>
            <Text variant="h2" style={styles.logoText}>
              Nimbly
            </Text>
          </View>
          <ThemeToggle />
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text variant="h1" style={styles.heroTitle}>
            Move lighter.{"\n"}
            <Text style={{ color: colors.sage }}>Spend smarter.</Text>
          </Text>
          <Text variant="body" style={styles.heroSubtitle}>
            A people-first app for smarter everyday spending, starting with
            groceries.
          </Text>
          <Button variant="primary" style={styles.ctaButton}>
            Get Started
          </Button>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text variant="h2" style={styles.sectionTitle}>
            What Nimbly does
          </Text>

          <Card style={styles.featureCard}>
            <Text style={styles.featureIcon}>🏷️</Text>
            <Text variant="h3" style={styles.featureTitle}>
              Surface Deals
            </Text>
            <Text variant="caption" style={styles.featureDescription}>
              Highlights grocery deals and clearances so you don't miss
              opportunities to save.
            </Text>
          </Card>

          <Card style={styles.featureCard}>
            <Text style={styles.featureIcon}>⏰</Text>
            <Text variant="h3" style={styles.featureTitle}>
              Better Timing
            </Text>
            <Text variant="caption" style={styles.featureDescription}>
              Get a heads-up when there's a better move to make—no lectures, no
              judgment.
            </Text>
          </Card>

          <Card style={styles.featureCard}>
            <Text style={styles.featureIcon}>💡</Text>
            <Text variant="h3" style={styles.featureTitle}>
              Smarter Decisions
            </Text>
            <Text variant="caption" style={styles.featureDescription}>
              Spot better buying opportunities and make smarter choices on
              everyday purchases.
            </Text>
          </Card>

          <Card style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text variant="h3" style={styles.featureTitle}>
              Your Data, Private
            </Text>
            <Text variant="caption" style={styles.featureDescription}>
              Your receipts stay yours. No selling, no sharing, no surprises.
            </Text>
          </Card>
        </View>

        {/* Savvy Section */}
        <View style={styles.section}>
          <View style={styles.savvyHeader}>
            <Text style={styles.savvyIcon}>🌾</Text>
            <Text variant="h2" style={styles.sectionTitle}>
              Meet Savvy
            </Text>
          </View>
          <Text variant="body" style={styles.savvyDescription}>
            Your in-app guide. Savvy keeps an eye on prices, notices patterns,
            and gives you a heads-up when there's a better move to make.
          </Text>
          <Text variant="body" style={styles.savvyTagline}>
            No lectures. No judgment. Just the right info at the right time.
          </Text>

          <Card
            style={[
              styles.insightCard,
              { backgroundColor: colors.sage + "10", borderColor: colors.sage + "30" },
            ]}
          >
            <Text variant="h3" style={{ color: colors.sage, marginBottom: spacing.sm }}>
              Savvy noticed
            </Text>
            <Text variant="body" style={styles.insightText}>
              You've shopped at Whole Foods 8 times in the past 30 days.
            </Text>
            <Text variant="muted" style={styles.insightMeta}>
              Based on 8 receipts • High confidence
            </Text>
          </Card>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text variant="h2" style={styles.ctaSectionTitle}>
            Ready to move smarter?
          </Text>
          <Text variant="body" style={styles.ctaSectionSubtitle}>
            Start tracking receipts today. No credit card required.
          </Text>
          <Button variant="primary" style={styles.ctaButton}>
            Get Started Free
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLogoContainer}>
            <View style={[styles.footerLogoCircle, { backgroundColor: 'rgba(95, 125, 115, 0.1)' }]}>
              <Text style={styles.footerLogo}>🐇</Text>
            </View>
            <Text variant="body" style={styles.footerLogoText}>
              Nimbly
            </Text>
          </View>
          <Text variant="caption" style={styles.footerTagline}>
            Move lighter. Spend smarter.
          </Text>
          <Text variant="muted" style={styles.copyright}>
            © 2026 Nimbly. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.lg,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 24,
  },
  logoText: {
    marginTop: 0,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    alignItems: "center",
  },
  heroTitle: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  heroSubtitle: {
    textAlign: "center",
    marginBottom: spacing.xl,
    opacity: 0.8,
  },
  ctaButton: {
    width: "100%",
    maxWidth: 300,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
  },
  featureCard: {
    marginBottom: spacing.md,
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  featureTitle: {
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  featureDescription: {
    textAlign: "center",
  },
  savvyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  savvyIcon: {
    fontSize: 32,
  },
  savvyDescription: {
    marginBottom: spacing.md,
    opacity: 0.8,
  },
  savvyTagline: {
    marginBottom: spacing.lg,
    fontWeight: "500",
  },
  insightCard: {
    borderWidth: 1,
  },
  insightText: {
    marginBottom: spacing.sm,
    fontWeight: "500",
  },
  insightMeta: {
    fontSize: 12,
  },
  ctaSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    alignItems: "center",
  },
  ctaSectionTitle: {
    textAlign: "center",
    marginBottom: spacing.md,
  },
  ctaSectionSubtitle: {
    textAlign: "center",
    marginBottom: spacing.xl,
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  footerLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  footerLogoCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  footerLogo: {
    fontSize: 20,
  },
  footerLogoText: {
    fontWeight: "600",
  },
  footerTagline: {
    marginBottom: spacing.sm,
    opacity: 0.8,
  },
  copyright: {
    fontSize: 12,
  },
});
