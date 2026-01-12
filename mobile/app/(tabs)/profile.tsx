import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useRef, useCallback } from 'react';
import TopBar from '@/components/TopBar';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme, colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/sign-in');
          },
        },
      ]
    );
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 20,
      paddingBottom: 120,
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 32,
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.sage,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    profileInfo: {
      flex: 1,
    },
    email: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: 4,
    },
    profileLink: {
      fontSize: 14,
      color: colors.sage,
      fontWeight: '500',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text.muted,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 1,
      paddingLeft: 4,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuIcon: {
      fontSize: 20,
      marginRight: 12,
      width: 24,
      textAlign: 'center',
    },
    menuText: {
      fontSize: 16,
      color: colors.text.primary,
      fontWeight: '500',
    },
    menuValue: {
      fontSize: 14,
      color: colors.text.secondary,
      marginRight: 8,
    },
    chevron: {
      fontSize: 18,
      color: colors.text.muted,
    },
    signOutButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.error,
      borderRadius: 16,
      padding: 18,
      alignItems: 'center',
    },
    signOutText: {
      color: colors.error,
      fontSize: 16,
      fontWeight: '600',
    },
    version: {
      textAlign: 'center',
      color: colors.text.muted,
      fontSize: 12,
      marginTop: 24,
      marginBottom: 100,
    },
  });

  return (
    <View style={styles.container}>
      <TopBar title="Profile" />
      <Animated.ScrollView 
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.profileSection}
            activeOpacity={0.7}
            onPress={() => {/* Navigate to profile settings */}}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user ? getInitials(user.email) : '?'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.email}>{user?.email}</Text>
              <Text style={styles.profileLink}>View profile settings →</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.card}>
              <TouchableOpacity 
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => router.push('/(tabs)/home')}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>📊</Text>
                  <Text style={styles.menuText}>Dashboard</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.menuItem, styles.menuItemLast]}
                activeOpacity={0.7}
                onPress={() => router.push('/(tabs)/upload')}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>📸</Text>
                  <Text style={styles.menuText}>Upload Receipt</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.card}>
              <View style={[styles.menuItem, styles.menuItemLast]}>
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
                  <Text style={styles.menuText}>Dark Mode</Text>
                </View>
                <Switch
                  value={theme === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.sage }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor={colors.border}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              <TouchableOpacity 
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>🏢</Text>
                  <Text style={styles.menuText}>About Us</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>✉️</Text>
                  <Text style={styles.menuText}>Contact Us</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>🌾</Text>
                  <Text style={styles.menuText}>Meet Savvy</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>📄</Text>
                  <Text style={styles.menuText}>Privacy Policy</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.menuItem, styles.menuItemLast]}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuIcon}>📋</Text>
                  <Text style={styles.menuText}>Terms of Service</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.signOutButton} 
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Savvy Mobile v0.2.0</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
