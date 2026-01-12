import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import TopBar from '@/components/TopBar';
import { useCallback } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      // Reset animation values
      slideAnim.setValue(-50);
      fadeAnim.setValue(0);

      // Start animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 120,
    },
    greeting: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text.primary,
      marginBottom: 24,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text.primary,
      marginBottom: 16,
    },
    quickActions: {
      gap: 12,
    },
    actionCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionIcon: {
      fontSize: 32,
      marginRight: 16,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 4,
    },
    actionSubtitle: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    chevron: {
      fontSize: 20,
      color: colors.text.muted,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.sage,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 13,
      color: colors.text.secondary,
      fontWeight: '500',
    },
  });

  return (
    <View style={styles.container}>
      <TopBar title="Home" />
      <Animated.ScrollView
        style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>{getGreeting()}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Receipts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>$0</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)')}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>🧾</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>View Receipts</Text>
                <Text style={styles.actionSubtitle}>Browse all receipts</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/deals')}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>🏷️</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>View Deals</Text>
                <Text style={styles.actionSubtitle}>Exclusive offers & discounts</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/insights')}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>💡</Text>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>View Insights</Text>
                <Text style={styles.actionSubtitle}>Discover spending patterns</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
