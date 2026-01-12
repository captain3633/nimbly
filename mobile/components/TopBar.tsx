import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title }: TopBarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  const styles = StyleSheet.create({
    container: {
      paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 16,
      paddingBottom: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 34,
      fontWeight: 'bold',
      color: colors.text.primary,
      letterSpacing: 0.4,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.sage,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <TouchableOpacity 
        style={styles.avatar}
        onPress={() => router.push('/(tabs)/profile')}
        activeOpacity={0.7}
      >
        <Text style={styles.avatarText}>
          {user ? getInitials(user.email) : '?'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
