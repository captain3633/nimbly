import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import TopBar from '@/components/TopBar';
import { useCallback } from 'react';

export default function DealsScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      slideAnim.setValue(30);
      fadeAnim.setValue(0);

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

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 500);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDeals();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 120,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: `${colors.amber}15`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    emptyIconText: {
      fontSize: 40,
    },
    emptyTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text.primary,
      marginBottom: 12,
      textAlign: 'center',
    },
    emptyDescription: {
      fontSize: 15,
      color: colors.text.secondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 32,
      paddingHorizontal: 20,
    },
    featuresGrid: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    featureCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    featureIcon: {
      fontSize: 24,
      marginBottom: 12,
    },
    featureTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 6,
      textAlign: 'center',
    },
    featureDescription: {
      fontSize: 12,
      color: colors.text.muted,
      textAlign: 'center',
      lineHeight: 16,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <TopBar title="Deals" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.sage} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title="Deals" />
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.sage}
              />
            }
          >
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>📈</Text>
            </View>
            
            <Text style={styles.emptyTitle}>No deals yet</Text>
            
            <Text style={styles.emptyDescription}>
              Savvy needs more data to spot price drops and savings opportunities. Upload more receipts to start seeing deals.
            </Text>

            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <Text style={styles.featureIcon}>🏷️</Text>
                <Text style={styles.featureTitle}>Price Drops</Text>
                <Text style={styles.featureDescription}>
                  Track when your regular items go on sale
                </Text>
              </View>

              <View style={styles.featureCard}>
                <Text style={styles.featureIcon}>💰</Text>
                <Text style={styles.featureTitle}>Best Prices</Text>
                <Text style={styles.featureDescription}>
                  Find the lowest prices across stores
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
      </View>
    </View>
  );
}
