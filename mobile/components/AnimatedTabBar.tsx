import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useRef } from 'react';

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function AnimatedTabBar({ state, descriptors, navigation }: TabBarProps) {
  const { colors, theme } = useTheme();
  const slideUpAnim = useRef(new Animated.Value(150)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Create scale animations for each tab (excluding profile and upload)
  const scaleAnims = useRef(
    state.routes.filter((route: any) => route.name !== 'profile' && route.name !== 'upload').map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideUpAnim, {
        toValue: 0,
        tension: 50,
        friction: 9,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Animate scale for focused tab
    const visibleRoutes = state.routes.filter((route: any) => route.name !== 'profile' && route.name !== 'upload');
    scaleAnims.forEach((anim: Animated.Value, index: number) => {
      const routeIndex = state.routes.findIndex((r: any) => r.name === visibleRoutes[index].name);
      Animated.spring(anim, {
        toValue: state.index === routeIndex ? 1.05 : 1,
        tension: 80,
        friction: 7,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 110, // Leave more space for camera button
      height: 75,
      backgroundColor: theme === 'dark' ? 'rgba(28, 36, 33, 0.98)' : 'rgba(255, 255, 255, 0.98)',
      borderRadius: 20,
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
      gap: 4,
    },
    tabButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      width: 62,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 14,
      gap: 3,
    },
    label: {
      fontSize: 11,
      fontWeight: '600',
      marginTop: 2,
    },
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideUpAnim }],
        },
      ]}
    >
      {state.routes
        .filter((route: any) => route.name !== 'profile' && route.name !== 'upload') // Filter out profile and upload tabs
        .map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIcon = (routeName: string) => {
          switch (routeName) {
            case 'home':
              return '🏠';
            case 'index':
              return '🧾';
            case 'deals':
              return '🏷️';
            case 'insights':
              return '💡';
            default:
              return '•';
          }
        };

        const getLabel = (routeName: string) => {
          switch (routeName) {
            case 'home':
              return 'Home';
            case 'index':
              return 'Receipts';
            case 'deals':
              return 'Deals';
            case 'insights':
              return 'Insights';
            default:
              return routeName;
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [{ scale: scaleAnims[index] }],
                },
                isFocused && {
                  backgroundColor:
                    theme === 'dark'
                      ? 'rgba(95, 125, 115, 0.25)'
                      : 'rgba(95, 125, 115, 0.15)',
                },
              ]}
            >
              <Text style={{ fontSize: 26 }}>{getIcon(route.name)}</Text>
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? colors.sage : colors.text.muted },
                ]}
              >
                {getLabel(route.name)}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}
