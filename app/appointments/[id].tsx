import { StyleSheet, ScrollView, View, TouchableOpacity, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';

interface Appointment {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  facultyId: {
    _id: string;
    name: string;
    email: string;
    department: string;
    designation?: string;
  };
  date: string;
  time: string;
  duration: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  meetingLink?: string;
  facultyNotes?: string;
  createdAt: string;
}

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'faculty'>('student');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth}/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.error('Error fetching current user:', err);
      return null;
    }
  };

  const fetchAppointment = async () => {
    try {
      setError(null);
      setLoading(true);
      // Get authentication token
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Please login to view appointment');
        return;
      }
      
      // Fetch appointment and current user in parallel
      const [appointmentResponse, currentUser] = await Promise.all([
        fetch(`${API_BASE_URL}${API_ENDPOINTS.appointments}/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetchCurrentUser(token),
      ]);
      
      const appointmentData = await appointmentResponse.json();

      if (appointmentData.success && appointmentData.data) {
        const appointment = appointmentData.data;
        setAppointment(appointment);
        
        // Determine user role by comparing IDs
        if (currentUser) {
          const currentUserId = currentUser._id.toString();
          if (appointment.studentId._id.toString() === currentUserId) {
            setUserRole('student');
          } else if (appointment.facultyId._id.toString() === currentUserId) {
            setUserRole('faculty');
          } else {
            // Fallback: use user role from token
            setUserRole(currentUser.role || 'student');
          }
        }
      } else {
        throw new Error(appointmentData.message || 'Appointment not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load appointment';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: 'approved' | 'rejected' | 'cancelled') => {
    setUpdating(true);
    try {
      // Get authentication token
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('Please login to update appointment');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.appointments}/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        fetchAppointment(); // Refresh appointment data
      } else {
        throw new Error(data.message || 'Failed to update appointment');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update appointment';
      alert(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#757575';
      default:
        return Colors.textLight;
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.centerContent}>
          <ThemedText style={styles.loadingText}>Loading appointment...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error || !appointment) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorText}>⚠️ {error || 'Appointment not found'}</ThemedText>
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
        <ThemedText type="title" style={styles.headerTitle}>Appointment Details</ThemedText>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
            <ThemedText style={styles.statusText}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </ThemedText>
          </View>
        </View>

        {/* Appointment Info */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {userRole === 'student' ? 'Faculty Information' : 'Student Information'}
          </ThemedText>
          <View style={styles.infoCard}>
            <ThemedText type="defaultSemiBold" style={styles.infoName}>
              {userRole === 'student' 
                ? appointment.facultyId.name 
                : appointment.studentId.name}
            </ThemedText>
            <ThemedText style={styles.infoEmail}>
              {userRole === 'student' 
                ? appointment.facultyId.email 
                : appointment.studentId.email}
            </ThemedText>
            {userRole === 'student' && (
              <>
                <ThemedText style={styles.infoDept}>
                  {appointment.facultyId.department}
                </ThemedText>
                {appointment.facultyId.designation && (
                  <ThemedText style={styles.infoDesignation}>
                    {appointment.facultyId.designation}
                  </ThemedText>
                )}
              </>
            )}
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Date & Time</ThemedText>
          <View style={styles.infoCard}>
            <View style={styles.timeRow}>
              <ThemedText style={styles.timeIcon}>📅</ThemedText>
              <View style={styles.timeInfo}>
                <ThemedText style={styles.timeLabel}>Date</ThemedText>
                <ThemedText style={styles.timeValue}>{formatDate(appointment.date)}</ThemedText>
              </View>
            </View>
            <View style={styles.timeRow}>
              <ThemedText style={styles.timeIcon}>🕐</ThemedText>
              <View style={styles.timeInfo}>
                <ThemedText style={styles.timeLabel}>Time</ThemedText>
                <ThemedText style={styles.timeValue}>{appointment.time}</ThemedText>
              </View>
            </View>
            <View style={styles.timeRow}>
              <ThemedText style={styles.timeIcon}>⏱️</ThemedText>
              <View style={styles.timeInfo}>
                <ThemedText style={styles.timeLabel}>Duration</ThemedText>
                <ThemedText style={styles.timeValue}>{appointment.duration} minutes</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Reason */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Reason</ThemedText>
          <View style={styles.reasonCard}>
            <ThemedText style={styles.reasonText}>{appointment.reason}</ThemedText>
          </View>
        </View>

        {/* Meeting Link */}
        {appointment.meetingLink && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Meeting Link</ThemedText>
            <TouchableOpacity
              style={styles.linkCard}
              onPress={() => Linking.openURL(appointment.meetingLink!)}
            >
              <ThemedText style={styles.linkText}>{appointment.meetingLink}</ThemedText>
              <ThemedText style={styles.linkTap}>Tap to open →</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* Faculty Notes */}
        {appointment.facultyNotes && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Faculty Notes</ThemedText>
            <View style={styles.notesCard}>
              <ThemedText style={styles.notesText}>{appointment.facultyNotes}</ThemedText>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {appointment.status === 'pending' && (
          <View style={styles.actionsContainer}>
            {userRole === 'faculty' && (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleStatusUpdate('approved')}
                  disabled={updating}
                >
                  <ThemedText style={styles.actionButtonText}>
                    {updating ? 'Confirming...' : '✓ Confirm Appointment'}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleStatusUpdate('rejected')}
                  disabled={updating}
                >
                  <ThemedText style={styles.actionButtonText}>
                    {updating ? 'Rejecting...' : '✕ Reject Appointment'}
                  </ThemedText>
                </TouchableOpacity>
              </>
            )}
            {(userRole === 'student' || userRole === 'faculty') && (
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleStatusUpdate('cancelled')}
                disabled={updating}
              >
                <ThemedText style={styles.actionButtonText}>Cancel Appointment</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        )}
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
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    padding: Spacing.lg,
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
  statusContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statusBadge: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 20,
  },
  statusText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    color: Colors.primary,
    marginBottom: Spacing.md,
    fontSize: 18,
  },
  infoCard: {
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
  infoName: {
    fontSize: 20,
    marginBottom: 4,
  },
  infoEmail: {
    color: Colors.primary,
    fontSize: 14,
    marginBottom: 4,
  },
  infoDept: {
    color: Colors.textLight,
    fontSize: 14,
    marginBottom: 2,
  },
  infoDesignation: {
    color: Colors.textLight,
    fontSize: 12,
    fontStyle: 'italic',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  timeIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  timeInfo: {
    flex: 1,
  },
  timeLabel: {
    color: Colors.textLight,
    fontSize: 12,
    marginBottom: 2,
  },
  timeValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  reasonCard: {
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
  reasonText: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  linkCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 14,
    marginBottom: 4,
  },
  linkTap: {
    color: Colors.primary,
    fontSize: 12,
    fontStyle: 'italic',
  },
  notesCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  notesText: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  cancelButton: {
    backgroundColor: '#757575',
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

