import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { api, Insight, InsightsResponse } from '@/lib/api';
import TopBar from '@/components/TopBar';
import { useCallback } from 'react';

export default function InsightsScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { colors } = useTheme();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadInsights();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Reset animation values
      slideAnim.setValue(50);
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

  const loadInsights = async () => {
    if (!token) return;

    try {
      setError('');
      const data = await api.insights.list(token) as InsightsResponse;
      setInsights(data.insights || []);
      setMessage(data.message || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load insights');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadInsights();
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'purchase_frequency':
        return '🛍️';
      case 'price_trend':
        return '📈';
      case 'common_purchase':
        return '📦';
      case 'store_pattern':
        return '🏪';
      default:
        return '✨';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'purchase_frequency':
        return '#3B82F6';
      case 'price_trend':
        return colors.sage;
      case 'common_purchase':
        return '#A855F7';
      case 'store_pattern':
        return colors.amber;
      default:
        return colors.sage;
    }
  };

  const getConfidenceBadgeColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return colors.success;
      case 'medium':
        return colors.amber;
      case 'low':
        return colors.text.muted;
      default:
        return colors.text.muted;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
      padding: 24,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
      marginTop: 16,
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.text.secondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    button: {
      backgroundColor: colors.sage,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    insightCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    insightHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    icon: {
      fontSize: 24,
    },
    insightContent: {
      flex: 1,
    },
    insightTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    insightTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      flex: 1,
      marginRight: 8,
    },
    confidenceBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    confidenceText: {
      fontSize: 11,
      fontWeight: '600',
    },
    insightDescription: {
      fontSize: 14,
      color: colors.text.secondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    insightMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaText: {
      fontSize: 12,
      color: colors.text.muted,
      marginRight: 8,
    },
    separator: {
      color: colors.text.muted,
      marginRight: 8,
    },
    infoCard: {
      backgroundColor: `${colors.sage}15`,
      borderWidth: 1,
      borderColor: `${colors.sage}30`,
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
    },
    infoTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 13,
      color: colors.text.secondary,
      lineHeight: 18,
    },
    error: {
      backgroundColor: `${colors.error}15`,
      borderWidth: 1,
      borderColor: `${colors.error}30`,
      borderRadius: 12,
      padding: 16,
      margin: 16,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      textAlign: 'center',
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.sage} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <TopBar title="Insights" />
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <TouchableOpacity style={styles.button} onPress={loadInsights}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (insights.length === 0) {
    return (
      <View style={styles.container}>
        <TopBar title="Insights" />
        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.emptyContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.sage}
              />
            }
          >
            <Text style={{ fontSize: 48 }}>✨</Text>
            <Text style={styles.emptyText}>No insights yet</Text>
            <Text style={styles.emptySubtext}>
              {message || 'Upload more receipts to start seeing patterns. We need at least 3 receipts to generate insights.'}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/(tabs)/upload')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Upload Receipt</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title="Insights" />
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.sage}
            />
          }
        >
          {insights.map((insight, index) => {
          const insightColor = getInsightColor(insight.type);
          const confidenceColor = getConfidenceBadgeColor(insight.confidence);

        return (
          <View key={index} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${insightColor}20` }]}>
                <Text style={styles.icon}>{getInsightIcon(insight.type)}</Text>
              </View>
              <View style={styles.insightContent}>
                <View style={styles.insightTitleRow}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <View style={[styles.confidenceBadge, { backgroundColor: `${confidenceColor}20` }]}>
                    <Text style={[styles.confidenceText, { color: confidenceColor }]}>
                      {insight.confidence}
                    </Text>
                  </View>
                </View>
                <Text style={styles.insightDescription}>{insight.description}</Text>
                <View style={styles.insightMeta}>
                  <Text style={styles.metaText}>
                    {insight.data_points} data {insight.data_points === 1 ? 'point' : 'points'}
                  </Text>
                  <Text style={styles.separator}>•</Text>
                  <Text style={styles.metaText}>{formatDate(insight.generated_at)}</Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How insights work</Text>
        <Text style={styles.infoText}>
          Insights are generated from your receipt data. We look for patterns in your shopping habits, 
          price changes, and purchase frequency. All insights are factual observations based on your 
          uploaded receipts—we never make predictions or recommendations.
        </Text>
      </View>
      </ScrollView>
      </Animated.View>
    </View>
  );
}
