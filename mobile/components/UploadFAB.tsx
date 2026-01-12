import { TouchableOpacity, StyleSheet, Text, Animated, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useRef } from 'react';

export default function UploadFAB() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const highlightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      delay: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(pressAnim, {
        toValue: 1.15,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(highlightAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(pressAnim, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(highlightAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
    
    router.push('/(tabs)/upload');
  };

  const highlightColor = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      theme === 'dark' ? 'rgba(28, 36, 33, 0.98)' : 'rgba(255, 255, 255, 0.98)',
      theme === 'dark' ? 'rgba(95, 125, 115, 0.25)' : 'rgba(95, 125, 115, 0.15)',
    ],
  });

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    fab: {
      width: 75,
      height: 75,
      borderRadius: 28,
      backgroundColor: theme === 'dark' ? 'rgba(28, 36, 33, 0.98)' : 'rgba(255, 255, 255, 0.98)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    icon: {
      fontSize: 30,
      textAlign: 'center',
      lineHeight: 30,
    },
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <Animated.View
        style={[
          styles.fab,
          { backgroundColor: highlightColor }
        ]}
      >
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
        >
          <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
            <Text style={styles.icon}>📸</Text>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}
