import { StyleSheet, ScrollView, View, TouchableOpacity, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router, Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';

interface FacultyMember {
  _id: string;
  id?: number;
  name: string;
  department: string;
  email: string;
  designation?: string;
  phone?: string;
  office?: string;
  image?: string;
  bio?: string;
  address?: string;
}

export default function FacultyProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [faculty, setFaculty] = useState<FacultyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFacultyProfile();
  }, [id]);

  const fetchFacultyProfile = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.faculty}/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setFaculty(data.data);
      } else {
        throw new Error(data.message || 'Faculty member not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load faculty profile';
      setError(errorMessage);
      console.error('Error fetching faculty profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEmailPress = () => {
    if (faculty?.email) {
      Linking.openURL(`mailto:${faculty.email}`);
    }
  };

  const handlePhonePress = () => {
    if (faculty?.phone) {
      Linking.openURL(`tel:${faculty.phone}`);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.centerContent}>
          <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error || !faculty) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorText}>⚠️ {error || 'Faculty member not found'}</ThemedText>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <ThemedText style={styles.backIconText}>←</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>Faculty Profile</ThemedText>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {getInitials(faculty.name)}
                </ThemedText>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <ThemedText type="title" style={styles.name}>{faculty.name}</ThemedText>
              {faculty.designation && (
                <ThemedText style={styles.designation}>{faculty.designation}</ThemedText>
              )}
              <View style={styles.departmentBadge}>
                <ThemedText style={styles.departmentBadgeText}>{faculty.department}</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity onPress={handleEmailPress} style={styles.quickActionButton}>
            <ThemedText style={styles.quickActionIcon}>✉️</ThemedText>
            <ThemedText style={styles.quickActionText}>Email</ThemedText>
          </TouchableOpacity>
          {faculty.phone && (
            <TouchableOpacity onPress={handlePhonePress} style={styles.quickActionButton}>
              <ThemedText style={styles.quickActionIcon}>📞</ThemedText>
              <ThemedText style={styles.quickActionText}>Call</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Contact Information</ThemedText>
          
          <TouchableOpacity onPress={handleEmailPress} style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <ThemedText style={styles.iconText}>✉️</ThemedText>
            </View>
            <View style={styles.contactInfo}>
              <ThemedText style={styles.contactLabel}>Email</ThemedText>
              <ThemedText style={styles.contactValue}>{faculty.email}</ThemedText>
            </View>
            <ThemedText style={styles.actionArrow}>→</ThemedText>
          </TouchableOpacity>

          {faculty.phone && (
            <TouchableOpacity onPress={handlePhonePress} style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <ThemedText style={styles.iconText}>📞</ThemedText>
              </View>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactLabel}>Phone</ThemedText>
                <ThemedText style={styles.contactValue}>{faculty.phone}</ThemedText>
              </View>
              <ThemedText style={styles.actionArrow}>→</ThemedText>
            </TouchableOpacity>
          )}

          {faculty.office && (
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <ThemedText style={styles.iconText}>🏢</ThemedText>
              </View>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactLabel}>Office</ThemedText>
                <ThemedText style={styles.contactValue}>{faculty.office}</ThemedText>
              </View>
            </View>
          )}

          {faculty.address && (
            <View style={styles.contactItem}>
              <View style={styles.contactIcon}>
                <ThemedText style={styles.iconText}>📍</ThemedText>
              </View>
              <View style={styles.contactInfo}>
                <ThemedText style={styles.contactLabel}>Address</ThemedText>
                <ThemedText style={styles.contactValue}>{faculty.address}</ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Bio Section */}
        {faculty.bio && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>About</ThemedText>
            <View style={styles.bioCard}>
              <ThemedText style={styles.bioText}>{faculty.bio}</ThemedText>
            </View>
          </View>
        )}

        {/* Appointment Button */}
        <View style={styles.section}>
          <Link href={`/appointments/book?facultyId=${faculty._id}`} asChild>
            <TouchableOpacity style={styles.appointmentButton}>
              <ThemedText style={styles.appointmentButtonText}>Book Appointment</ThemedText>
              <ThemedText style={styles.appointmentButtonArrow}>→</ThemedText>
            </TouchableOpacity>
          </Link>
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
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    marginRight: Spacing.md,
    padding: Spacing.sm,
  },
  backIconText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    color: Colors.textLight,
    fontSize: 16,
  },
  errorText: {
    color: Colors.primary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.md,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: Colors.white,
    margin: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: 20,
    padding: Spacing.xl,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: Colors.backgroundAlt,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 40,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontSize: 30,
    marginBottom: Spacing.xs,
    textAlign: 'center',
    color: Colors.text,
    fontWeight: '700',
  },
  designation: {
    color: Colors.textLight,
    fontSize: 17,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  departmentBadge: {
    backgroundColor: Colors.backgroundAlt,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  departmentBadgeText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    marginHorizontal: Spacing.xs,
  },
  quickActionButtonPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  quickActionText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionTextWhite: {
    color: Colors.white,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.primary,
    marginBottom: Spacing.md,
    fontSize: 20,
    fontWeight: '700',
  },
  contactItem: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  actionArrow: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: Spacing.sm,
  },
  contactIcon: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: Colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  iconText: {
    fontSize: 24,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    color: Colors.textLight,
    fontSize: 12,
    marginBottom: 4,
  },
  contactValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  bioCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  bioText: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  appointmentButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    marginTop: Spacing.sm,
  },
  appointmentButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  appointmentButtonArrow: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: Spacing.sm,
  },
});

