import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { API_BASE_URL } from '@/constants/api';

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [checkingAuth, setCheckingAuth] = useState(false);

  useEffect(() => {
    // Animate logo appearance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = async () => {
    setCheckingAuth(true);
    
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        // No token, navigate to login
        router.replace('/login');
        return;
      }

      // Verify token is valid
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Valid token, navigate to home
        router.replace('/');
      } else {
        // Invalid token, clear and navigate to login
        await AsyncStorage.removeItem('token');
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      // On error, navigate to login
      router.replace('/login');
    } finally {
      setCheckingAuth(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('@/assets/images/logo.webp')}
            style={styles.logo}
            contentFit="contain"
            transition={500}
          />
        </Animated.View>

        <View style={styles.textContainer}>
          <ThemedText type="title" style={styles.title}>Welcome to Uniways</ThemedText>
          <ThemedText style={styles.subtitle}>
            Your all-in-one campus management solution
          </ThemedText>
          <ThemedText style={styles.description}>
            Connect with faculty, manage appointments, track complaints, and explore campus - all in one place.
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.getStartedButton, checkingAuth && styles.buttonDisabled]}
          onPress={handleGetStarted}
          activeOpacity={0.8}
          disabled={checkingAuth}
        >
          <ThemedText style={styles.getStartedText}>
            {checkingAuth ? 'Loading...' : 'Get Started'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f0f0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  logoContainer: {
    marginBottom: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: Spacing.sm,
  },
  getStartedButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderRadius: 30,
    marginTop: Spacing.xl,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 200,
    alignItems: 'center',
  },
  getStartedText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

