import { StyleSheet, ScrollView, View, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';

interface Complaint {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  type: string;
  title: string;
  description: string;
  location: string;
  building?: string;
  floor?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  adminNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const complaintTypeLabels: Record<string, string> = {
  ac: 'AC Issue',
  projector: 'Projector Issue',
  hdmi_cable: 'HDMI Cable Needed',
  wifi: 'WiFi Issue',
  furniture: 'Furniture Issue',
  cleanliness: 'Cleanliness',
  power_outlet: 'Power Outlet',
  whiteboard: 'Whiteboard',
  sound_system: 'Sound System',
  lights: 'Lights',
  water_dispenser: 'Water Dispenser',
  other: 'Other',
};

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'faculty' | 'admin'>('student');

  useEffect(() => {
    fetchComplaint();
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

  const fetchComplaint = async () => {
    try {
      setError(null);
      setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      const [complaintResponse, currentUser] = await Promise.all([
        fetch(`${API_BASE_URL}${API_ENDPOINTS.complaints}/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetchCurrentUser(token),
      ]);

      const complaintData = await complaintResponse.json();

      if (complaintData.success && complaintData.data) {
        const complaint = complaintData.data;
        setComplaint(complaint);

        if (currentUser) {
          // Set user role from current user, not from complaint
          setUserRole(currentUser.role || 'student');
        }
      } else {
        throw new Error(complaintData.message || 'Complaint not found');
      }
    } catch (err: any) {
      console.error('Error fetching complaint:', err);
      setError(err.message || 'Failed to load complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    Alert.alert(
      'Update Status',
      `Change complaint status to "${newStatus.replace('_', ' ')}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) {
                Alert.alert('Error', 'Please login to update complaint status');
                return;
              }

              const response = await fetch(
                `${API_BASE_URL}${API_ENDPOINTS.complaints}/${id}/status`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ status: newStatus }),
                }
              );

              const data = await response.json();

              if (response.ok && data.success) {
                Alert.alert('Success', 'Complaint status updated successfully');
                fetchComplaint(); // Refresh complaint data
              } else {
                Alert.alert('Error', data.message || 'Failed to update status');
              }
            } catch (err) {
              console.error('Error updating status:', err);
              Alert.alert('Error', 'Failed to update status. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.primaryDark;
      case 'in_progress':
        return Colors.primary;
      case 'resolved':
        return Colors.primary;
      case 'closed':
        return '#6c757d';
      default:
        return Colors.text;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#dc3545';
      case 'high':
        return '#fd7e14';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#28a745';
      default:
        return Colors.text;
    }
  };

  const getStatusLabel = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ThemedText>Loading complaint...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error || !complaint) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            {error || 'Complaint not found'}
          </ThemedText>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.retryButtonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const isOwner = complaint.userId._id.toString() === userRole;
  const canUpdateStatus = userRole === 'admin' || userRole === 'faculty';

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>Complaint Details</ThemedText>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status and Priority Badges */}
        <View style={styles.badgesContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(complaint.status) },
            ]}
          >
            <ThemedText style={styles.statusBadgeText}>
              {getStatusLabel(complaint.status)}
            </ThemedText>
          </View>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(complaint.priority) },
            ]}
          >
            <ThemedText style={styles.priorityBadgeText}>
              {complaint.priority.toUpperCase()} PRIORITY
            </ThemedText>
          </View>
        </View>

        {/* Complaint Card */}
        <View style={styles.card}>
          <ThemedText type="title" style={styles.title}>{complaint.title}</ThemedText>
          
          <View style={styles.typeContainer}>
            <ThemedText style={styles.typeLabel}>
              {complaintTypeLabels[complaint.type] || complaint.type}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Description</ThemedText>
            <ThemedText style={styles.description}>{complaint.description}</ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Location</ThemedText>
            <View style={styles.locationContainer}>
              <ThemedText style={styles.locationIcon}>📍</ThemedText>
              <View style={styles.locationInfo}>
                <ThemedText style={styles.locationText}>{complaint.location}</ThemedText>
                {complaint.building && (
                  <ThemedText style={styles.buildingText}>
                    Building: {complaint.building}
                  </ThemedText>
                )}
                {complaint.floor && (
                  <ThemedText style={styles.floorText}>
                    Floor: {complaint.floor}
                  </ThemedText>
                )}
              </View>
            </View>
          </View>

          {/* Assigned To */}
          {complaint.assignedTo && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Assigned To</ThemedText>
              <ThemedText style={styles.assignedText}>
                {complaint.assignedTo.name} ({complaint.assignedTo.email})
              </ThemedText>
            </View>
          )}

          {/* Admin Notes */}
          {complaint.adminNotes && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Admin Notes</ThemedText>
              <View style={styles.adminNotesContainer}>
                <ThemedText style={styles.adminNotesText}>{complaint.adminNotes}</ThemedText>
              </View>
            </View>
          )}

          {/* Resolved Date */}
          {complaint.resolvedAt && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>Resolved At</ThemedText>
              <ThemedText style={styles.resolvedDate}>
                {new Date(complaint.resolvedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </ThemedText>
            </View>
          )}

          {/* Created Date */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Created</ThemedText>
            <ThemedText style={styles.createdDate}>
              {new Date(complaint.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </ThemedText>
          </View>

          {/* Submitted By */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Submitted By</ThemedText>
            <ThemedText style={styles.submittedBy}>
              {complaint.userId.name} ({complaint.userId.email})
            </ThemedText>
            <ThemedText style={styles.submittedRole}>
              {complaint.userId.role === 'student' ? '📚 Student' : '👨‍🏫 Faculty'}
            </ThemedText>
          </View>
        </View>

        {/* Status Update Buttons (Admin/Staff only) */}
        {canUpdateStatus && (
          <View style={styles.statusUpdateSection}>
            <ThemedText type="subtitle" style={styles.statusUpdateTitle}>
              Update Status
            </ThemedText>
            <View style={styles.statusButtonsContainer}>
              {['pending', 'in_progress', 'resolved', 'closed'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    complaint.status === status && styles.statusButtonActive,
                  ]}
                  onPress={() => handleStatusUpdate(status)}
                >
                  <ThemedText
                    style={[
                      styles.statusButtonText,
                      complaint.status === status && styles.statusButtonTextActive,
                    ]}
                  >
                    {getStatusLabel(status)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.spacer} />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: 16,
    color: '#c33',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 24,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.sm,
    minWidth: 60,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  priorityBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  priorityBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  typeContainer: {
    marginBottom: Spacing.md,
  },
  typeLabel: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    color: Colors.text,
  },
  description: {
    fontSize: 15,
    color: Colors.textLight,
    lineHeight: 22,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  locationInfo: {
    flex: 1,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  buildingText: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 2,
  },
  floorText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  assignedText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  adminNotesContainer: {
    backgroundColor: '#fff5f0',
    padding: Spacing.md,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  adminNotesText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  resolvedDate: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '500',
  },
  createdDate: {
    fontSize: 14,
    color: Colors.textLight,
  },
  submittedBy: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  submittedRole: {
    fontSize: 14,
    color: Colors.textLight,
  },
  statusUpdateSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusUpdateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statusButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  statusButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: '#fff5f0',
  },
  statusButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  statusButtonTextActive: {
    color: Colors.primary,
  },
  spacer: {
    height: Spacing.xl,
  },
});

