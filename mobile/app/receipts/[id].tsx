import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { api, ReceiptDetail } from '@/lib/api';

export default function ReceiptDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const { colors } = useTheme();
  const [receipt, setReceipt] = useState<ReceiptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id && token) {
      loadReceipt();
    }
  }, [id, token]);

  const loadReceipt = async () => {
    if (!token || !id) return;

    try {
      setError('');
      const data = await api.receipts.get(id as string, token);
      setReceipt(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load receipt');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number | null) => {
    if (amount === null) return 'Total not available';
    return `$${amount.toFixed(2)}`;
  };

  const formatStoreName = (name: string | null) => {
    if (!name) return 'Store unknown';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'pending':
        return '⏳';
      case 'failed':
      case 'needs_review':
        return '⚠️';
      default:
        return '❓';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Successfully parsed';
      case 'pending':
        return 'Processing receipt';
      case 'failed':
        return 'Parsing incomplete';
      case 'needs_review':
        return 'Needs review';
      default:
        return status;
    }
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
    content: {
      padding: 16,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      padding: 8,
    },
    backText: {
      fontSize: 16,
      color: colors.sage,
      marginLeft: 4,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    headerLeft: {
      flex: 1,
    },
    storeName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text.primary,
      marginBottom: 4,
    },
    date: {
      fontSize: 14,
      color: colors.text.secondary,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: `${colors.sage}20`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      fontSize: 24,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    statusIcon: {
      fontSize: 16,
      marginRight: 8,
    },
    statusText: {
      fontSize: 14,
      fontWeight: '600',
    },
    errorBox: {
      backgroundColor: `${colors.amber}15`,
      borderWidth: 1,
      borderColor: `${colors.amber}30`,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    errorLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.amber,
    },
    errorText: {
      fontSize: 13,
      color: colors.text.secondary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.secondary,
    },
    totalAmount: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text.primary,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text.primary,
      marginBottom: 4,
    },
    itemCount: {
      fontSize: 14,
      color: colors.text.muted,
      marginBottom: 16,
    },
    lineItem: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lineItemLast: {
      borderBottomWidth: 0,
    },
    productName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 4,
    },
    itemDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    itemMeta: {
      fontSize: 13,
      color: colors.text.muted,
    },
    itemPrice: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
    },
    emptyCard: {
      alignItems: 'center',
      padding: 24,
    },
    emptyIcon: {
      fontSize: 32,
      marginBottom: 12,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 13,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    errorMessage: {
      fontSize: 16,
      color: colors.error,
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
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.sage} />
      </View>
    );
  }

  if (error || !receipt) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{error || 'Receipt not found'}</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={{ fontSize: 20, color: colors.sage }}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.storeName}>{formatStoreName(receipt.store_name)}</Text>
              <Text style={styles.date}>{formatDate(receipt.purchase_date)}</Text>
            </View>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🧾</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.statusIcon}>{getStatusIcon(receipt.parse_status)}</Text>
            <Text style={[styles.statusText, { color: getStatusColor(receipt.parse_status) }]}>
              {getStatusText(receipt.parse_status)}
            </Text>
          </View>

          {receipt.parse_error && receipt.parse_status === 'failed' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorLabel}>Note: </Text>
              <Text style={styles.errorText}>{receipt.parse_error}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{formatAmount(receipt.total_amount)}</Text>
          </View>
        </View>

        {receipt.line_items && receipt.line_items.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Items</Text>
            <Text style={styles.itemCount}>
              {receipt.line_items.length} {receipt.line_items.length === 1 ? 'item' : 'items'}
            </Text>
            {receipt.line_items.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.lineItem,
                  index === receipt.line_items.length - 1 && styles.lineItemLast,
                ]}
              >
                <Text style={styles.productName}>{item.product_name}</Text>
                <View style={styles.itemDetails}>
                  {item.quantity && item.unit_price ? (
                    <Text style={styles.itemMeta}>
                      {item.quantity} × ${item.unit_price.toFixed(2)}
                    </Text>
                  ) : (
                    <View />
                  )}
                  <Text style={styles.itemPrice}>${item.total_price.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>⚠️</Text>
              <Text style={styles.emptyTitle}>No items extracted</Text>
              <Text style={styles.emptyText}>
                The receipt was uploaded but we couldn't extract line items. The total amount may still be available above.
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
