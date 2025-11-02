import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, router, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { API_BASE_URL } from '@/constants/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty';
}

interface MenuItem {
  title: string;
  description: string;
  route: '/faculty' | '/parking' | '/map' | '/appointments' | '/complaints';
  icon: string;
}

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        // No token, redirect to login
        router.replace('/login');
        return;
      }

      // Fetch user info
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.data);
      } else {
        // Invalid token, clear and redirect to login
        await AsyncStorage.removeItem('token');
        router.replace('/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      await AsyncStorage.removeItem('token');
      router.replace('/login');
    } finally {
      setCheckingAuth(false);
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkAuth();
    }, [checkAuth])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getMenuItems = (): MenuItem[] => {
    const items: MenuItem[] = [
      {
        title: 'Faculty',
        description: 'Meet our faculty members',
        route: '/faculty',
        icon: '👨‍🏫',
      },
      {
        title: 'Parking',
        description: 'Check parking availability',
        route: '/parking',
        icon: '🚗',
      },
      {
        title: 'College Map',
        description: 'View campus layout',
        route: '/map',
        icon: '🗺️',
      },
    ];

    // Add Appointments for all logged-in users
    if (user) {
      items.push({
        title: 'Appointments',
        description: user.role === 'student' 
          ? 'View your appointments' 
          : 'Manage appointments',
        route: '/appointments',
        icon: '📅',
      });
      
      // Add Complaints for all logged-in users
      items.push({
        title: 'Complaints',
        description: user.role === 'student' 
          ? 'Submit and track complaints' 
          : 'View and manage complaints',
        route: '/complaints',
        icon: '📋',
      });
    }

    return items;
  };

  const menuItems = getMenuItems();

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <ThemedText type="title" style={styles.title}>Uniways</ThemedText>
            {user && (
              <View style={styles.userInfo}>
                <ThemedText style={styles.userGreeting}>
                  Welcome, {user.name}! 👋
                </ThemedText>
                <ThemedText style={styles.userRole}>
                  {user.role === 'student' ? '📚 Student' : '👨‍🏫 Faculty'}
                </ThemedText>
              </View>
            )}
          </View>
          {user && (
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <ThemedText style={styles.logoutText}>Logout</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Link key={index} href={item.route} asChild>
              <TouchableOpacity style={styles.menuCard}>
                <View style={styles.menuIcon}>
                  <ThemedText style={styles.iconText}>{item.icon}</ThemedText>
                </View>
                <View style={styles.menuContent}>
                  <ThemedText type="defaultSemiBold" style={styles.menuTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.menuDescription}>
                    {item.description}
                  </ThemedText>
                </View>
                <ThemedText style={styles.arrow}>→</ThemedText>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textLight,
    fontSize: 16,
  },
  header: {
    paddingTop: 80,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    color: Colors.white,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  userInfo: {
    marginTop: Spacing.sm,
  },
  userGreeting: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userRole: {
    color: Colors.white,
    fontSize: 14,
    opacity: 0.9,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  logoutText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  menuContainer: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  menuIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  iconText: {
    fontSize: 28,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    marginBottom: 4,
    color: Colors.text,
  },
  menuDescription: {
    color: Colors.textLight,
    fontSize: 14,
  },
  arrow: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
