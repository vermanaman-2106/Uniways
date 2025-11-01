import { StyleSheet, ScrollView, View, TouchableOpacity, RefreshControl, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
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

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'faculty'>('student');

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setFilteredAppointments(appointments);
    } else if (selectedStatus === 'rejected') {
      // Show both rejected and cancelled appointments when "Rejected" filter is selected
      setFilteredAppointments(appointments.filter(apt => apt.status === 'rejected' || apt.status === 'cancelled'));
    } else {
      setFilteredAppointments(appointments.filter(apt => apt.status === selectedStatus));
    }
  }, [selectedStatus, appointments]);

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

  const fetchAppointments = async () => {
    try {
      setError(null);
      // Get authentication token
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Please login to view appointments');
        return;
      }
      
      // Fetch appointments and current user in parallel
      const [appointmentsResponse, currentUser] = await Promise.all([
        fetch(`${API_BASE_URL}${API_ENDPOINTS.appointments}/my-appointments`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetchCurrentUser(token),
      ]);

      const data = await appointmentsResponse.json();

      if (data.success) {
        setAppointments(data.data || []);
        setFilteredAppointments(data.data || []);
        
        // Determine user role from current user
        if (currentUser && currentUser.role) {
          setUserRole(currentUser.role);
        } else if (data.data && data.data.length > 0) {
          // Fallback: determine from appointment structure
          const firstAppointment = data.data[0];
          const currentUserId = currentUser?._id?.toString();
          if (currentUserId && firstAppointment.facultyId._id.toString() === currentUserId) {
            setUserRole('faculty');
          } else {
            setUserRole('student');
          }
        }
      } else {
        throw new Error(data.message || 'Failed to fetch appointments');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load appointments';
      setError(errorMessage);
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Appointments</ThemedText>
        <ThemedText style={styles.subtitle}>
          {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
        </ThemedText>
      </View>

      {/* Action Button */}
      {userRole === 'student' && (
        <View style={styles.actionContainer}>
          <Link href="/faculty" asChild>
            <TouchableOpacity style={styles.bookButton}>
              <ThemedText style={styles.bookButtonText}>+ Book New Appointment</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      )}

      {/* Status Filters */}
      {appointments.length > 0 && (
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {statusFilters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterButton,
                  selectedStatus === filter.value && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedStatus(filter.value)}
              >
                <ThemedText
                  style={[
                    styles.filterButtonText,
                    selectedStatus === filter.value && styles.filterButtonTextActive,
                  ]}
                >
                  {filter.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Content */}
      {loading && !refreshing ? (
        <View style={styles.centerContent}>
          <ThemedText style={styles.loadingText}>Loading appointments...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
          <TouchableOpacity onPress={fetchAppointments} style={styles.retryButton}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </View>
      ) : filteredAppointments.length === 0 ? (
        <View style={styles.centerContent}>
          <ThemedText style={styles.emptyText}>
            {selectedStatus === 'all' 
              ? 'No appointments yet' 
              : `No ${selectedStatus} appointments`}
          </ThemedText>
          {userRole === 'student' && appointments.length === 0 && (
            <Link href="/faculty" asChild>
              <TouchableOpacity style={styles.bookButtonSmall}>
                <ThemedText style={styles.bookButtonText}>Book Your First Appointment</ThemedText>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
        >
          {filteredAppointments.map((appointment) => (
            userRole === 'faculty' ? (
              <Link key={appointment._id} href={`/appointments/${appointment._id}`} asChild>
                <TouchableOpacity activeOpacity={0.7} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                        {appointment.studentId.name}
                      </ThemedText>
                      <ThemedText style={styles.cardDate}>
                        {formatDate(appointment.date)} at {appointment.time}
                      </ThemedText>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                      <ThemedText style={styles.statusText}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.reason} numberOfLines={2}>
                    {appointment.reason}
                  </ThemedText>
                  {appointment.meetingLink && (
                    <ThemedText style={styles.meetingLink}>
                      🔗 Meeting Link Available
                    </ThemedText>
                  )}
                </TouchableOpacity>
              </Link>
            ) : (
              <View key={appointment._id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                      {appointment.facultyId.name}
                    </ThemedText>
                    <ThemedText style={styles.cardSubtitle}>
                      {appointment.facultyId.department}
                    </ThemedText>
                    <ThemedText style={styles.cardDate}>
                      {formatDate(appointment.date)} at {appointment.time}
                    </ThemedText>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                    <ThemedText style={styles.statusText}>
                      {appointment.status === 'approved' 
                        ? '✓ Confirmed' 
                        : appointment.status === 'pending'
                        ? '⏳ Pending'
                        : appointment.status === 'rejected'
                        ? '✕ Rejected'
                        : appointment.status === 'cancelled'
                        ? '🚫 Cancelled'
                        : appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </ThemedText>
                  </View>
                </View>
                {appointment.status === 'approved' && (
                  <View style={styles.confirmedInfo}>
                    <ThemedText style={styles.confirmedText}>
                      ✅ Your appointment has been confirmed!
                    </ThemedText>
                    {appointment.meetingLink && (
                      <TouchableOpacity
                        style={styles.meetingLinkButton}
                        onPress={() => Linking.openURL(appointment.meetingLink!)}
                      >
                        <ThemedText style={styles.meetingLinkButtonText}>
                          🔗 Join Meeting
                        </ThemedText>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                {appointment.status === 'rejected' && (
                  <View style={styles.rejectedInfo}>
                    <ThemedText style={styles.rejectedText}>
                      ❌ Your appointment request has been rejected.
                    </ThemedText>
                    {appointment.facultyNotes && (
                      <ThemedText style={styles.facultyNotes}>
                        Note: {appointment.facultyNotes}
                      </ThemedText>
                    )}
                  </View>
                )}
                {appointment.status === 'pending' && (
                  <View style={styles.pendingInfo}>
                    <ThemedText style={styles.pendingText}>
                      ⏳ Waiting for faculty confirmation...
                    </ThemedText>
                  </View>
                )}
                {appointment.status === 'cancelled' && (
                  <View style={styles.cancelledInfo}>
                    <ThemedText style={styles.cancelledText}>
                      🚫 This appointment has been cancelled.
                    </ThemedText>
                  </View>
                )}
              </View>
            )
          ))}
        </ScrollView>
      )}
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
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.white,
    opacity: 0.9,
  },
  actionContainer: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  bookButton: {
    backgroundColor: Colors.primary,
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
  bookButtonSmall: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  filterButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: Colors.white,
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
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.md,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  cardSubtitle: {
    color: Colors.textLight,
    fontSize: 14,
    marginBottom: 4,
  },
  cardDate: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    marginLeft: Spacing.md,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  reason: {
    color: Colors.text,
    fontSize: 14,
    marginTop: Spacing.sm,
  },
  meetingLink: {
    color: Colors.primary,
    fontSize: 12,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  confirmedInfo: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  confirmedText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  meetingLinkButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
    marginTop: Spacing.xs,
  },
  meetingLinkButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  rejectedInfo: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  rejectedText: {
    color: '#C62828',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  facultyNotes: {
    color: '#C62828',
    fontSize: 12,
    fontStyle: 'italic',
  },
  pendingInfo: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  pendingText: {
    color: '#E65100',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelledInfo: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: '#ECEFF1',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#757575',
  },
  cancelledText: {
    color: '#424242',
    fontSize: 14,
    fontWeight: '600',
  },
});

