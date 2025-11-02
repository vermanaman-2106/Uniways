import { StyleSheet, ScrollView, View, TouchableOpacity, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Link, router, useFocusEffect } from 'expo-router';
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

export default function ComplaintsScreen() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchComplaints();
    }, [])
  );

  useEffect(() => {
    filterComplaints();
  }, [selectedStatus, selectedType, complaints]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.complaints}/my-complaints`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setComplaints(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch complaints');
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to fetch complaints. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterComplaints = () => {
    let filtered = [...complaints];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((complaint) => complaint.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((complaint) => complaint.type === selectedType);
    }

    setFilteredComplaints(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'in_progress':
        return Colors.primary;
      case 'resolved':
        return '#28a745';
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

  const statusFilters = ['all', 'pending', 'in_progress', 'resolved', 'closed'];
  const typeFilters = ['all', 'ac', 'projector', 'hdmi_cable', 'wifi', 'furniture', 'cleanliness', 'power_outlet', 'whiteboard', 'sound_system', 'lights', 'water_dispenser', 'other'];

  if (loading && complaints.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ThemedText>Loading complaints...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText type="title" style={styles.headerTitle}>My Complaints</ThemedText>
        </View>
        <Link href="/complaints/create" asChild>
          <TouchableOpacity style={styles.createButton}>
            <ThemedText style={styles.createButtonText}>+ New Complaint</ThemedText>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
          {statusFilters.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                selectedStatus === status && styles.filterChipActive,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <ThemedText
                style={[
                  styles.filterChipText,
                  selectedStatus === status && styles.filterChipTextActive,
                ]}
              >
                {status === 'all' ? 'All' : getStatusLabel(status)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeFilters}>
          {typeFilters.slice(0, 6).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                selectedType === type && styles.filterChipActive,
              ]}
              onPress={() => setSelectedType(type)}
            >
              <ThemedText
                style={[
                  styles.filterChipText,
                  selectedType === type && styles.filterChipTextActive,
                ]}
              >
                {type === 'all' ? 'All Types' : complaintTypeLabels[type]}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      {/* Complaints List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {filteredComplaints.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No complaints found</ThemedText>
            <Link href="/complaints/create" asChild>
              <TouchableOpacity style={styles.emptyButton}>
                <ThemedText style={styles.emptyButtonText}>Create Your First Complaint</ThemedText>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          filteredComplaints.map((complaint) => (
            <Link key={complaint._id} href={`/complaints/${complaint._id}`} asChild>
              <TouchableOpacity style={styles.complaintCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <ThemedText type="subtitle" style={styles.complaintTitle}>
                      {complaint.title}
                    </ThemedText>
                    <ThemedText style={styles.complaintType}>
                      {complaintTypeLabels[complaint.type] || complaint.type}
                    </ThemedText>
                  </View>
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
                </View>

                <ThemedText style={styles.complaintDescription} numberOfLines={2}>
                  {complaint.description}
                </ThemedText>

                <View style={styles.cardFooter}>
                  <View style={styles.locationContainer}>
                    <ThemedText style={styles.locationIcon}>📍</ThemedText>
                    <ThemedText style={styles.locationText}>{complaint.location}</ThemedText>
                  </View>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(complaint.priority) },
                    ]}
                  >
                    <ThemedText style={styles.priorityBadgeText}>
                      {complaint.priority.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText style={styles.complaintDate}>
                  {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </ThemedText>
              </TouchableOpacity>
            </Link>
          ))
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl * 2 + 20,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  createButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  createButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  filtersContainer: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.background,
    marginTop: Spacing.sm,
  },
  statusFilters: {
    marginBottom: Spacing.sm,
  },
  typeFilters: {
    marginTop: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  errorContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: '#fee',
    borderRadius: 8,
  },
  errorText: {
    color: '#c33',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl * 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  complaintCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  complaintTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  complaintType: {
    fontSize: 13,
    color: Colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  complaintDescription: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  locationText: {
    fontSize: 13,
    color: Colors.textLight,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  complaintDate: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
});

