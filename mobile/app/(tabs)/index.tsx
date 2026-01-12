import { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { api, Receipt } from '@/lib/api';
import TopBar from '@/components/TopBar';
import { useCallback } from 'react';

export default function ReceiptsScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { colors } = useTheme();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadReceipts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Reset animation values
      slideAnim.setValue(-30);
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

  const loadReceipts = async () => {
    if (!token) return;

    try {
      setError('');
      const data = await api.receipts.list(token);
      setReceipts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load receipts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReceipts();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number | null) => {
    if (amount === null) return 'Amount unknown';
    return `$${amount.toFixed(2)}`;
  };

  const formatStoreName = (name: string | null) => {
    if (!name) return 'Store unknown';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return colors.success;
      case 'pending':
        return colors.amber;
      case 'failed':
      case 'needs_review':
        return colors.amber;
      default:
        return colors.text.muted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Parsed';
      case 'pending':
        return 'Processing';
      case 'failed':
        return 'Failed';
      case 'needs_review':
        return 'Needs review';
      default:
        return status;
    }
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
    list: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 120,
    },
    receiptCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    receiptHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    storeName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginLeft: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
    },
    receiptDetails: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailText: {
      fontSize: 14,
      color: colors.text.secondary,
      marginRight: 8,
    },
    separator: {
      color: colors.text.muted,
      marginRight: 8,
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
        <TopBar title="Receipts" />
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <TouchableOpacity style={styles.button} onPress={loadReceipts}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (receipts.length === 0) {
    return (
      <View style={styles.container}>
        <TopBar title="Receipts" />
        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 48 }}>🧾</Text>
            <Text style={styles.emptyText}>No receipts yet</Text>
            <Text style={styles.emptySubtext}>
              Upload your first receipt to start tracking your spending
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/(tabs)/upload')}
            >
              <Text style={styles.buttonText}>Upload Receipt</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar title="Receipts" />
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
        <FlatList
          data={receipts}
          keyExtractor={(item) => item.receipt_id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.sage}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.receiptCard}
              onPress={() => router.push(`/receipts/${item.receipt_id}`)}
              activeOpacity={0.7}
            >
              <View style={styles.receiptHeader}>
                <Text style={styles.storeName}>{formatStoreName(item.store_name)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.parse_status)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(item.parse_status) }]}>
                    {getStatusText(item.parse_status)}
                  </Text>
                </View>
              </View>
              <View style={styles.receiptDetails}>
                <Text style={styles.detailText}>{formatDate(item.purchase_date)}</Text>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.detailText}>{formatAmount(item.total_amount)}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      </Animated.View>
    </View>
  );
}
