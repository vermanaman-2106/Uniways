import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';

interface Faculty {
  _id: string;
  name: string;
  email: string;
  department: string;
  designation?: string;
}

export default function BookAppointmentScreen() {
  const { facultyId } = useLocalSearchParams<{ facultyId?: string }>();
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingFaculty, setLoadingFaculty] = useState(true);

  useEffect(() => {
    if (facultyId) {
      fetchFacultyById(facultyId);
    } else {
      // Fallback: if no facultyId, show faculty list
      fetchFacultyList();
    }
  }, [facultyId]);

  const fetchFacultyById = async (id: string) => {
    try {
      setLoadingFaculty(true);
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.faculty}/${id}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setFaculty(data.data);
      } else {
        throw new Error('Faculty not found');
      }
    } catch (err) {
      console.error('Error fetching faculty:', err);
      setError('Failed to load faculty information');
    } finally {
      setLoadingFaculty(false);
    }
  };

  const fetchFacultyList = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.appointments}/faculty`);
      const data = await response.json();
      
      if (data.success) {
        // If no facultyId, show list (but this shouldn't happen now)
        // Keeping for fallback
      }
    } catch (err) {
      console.error('Error fetching faculty:', err);
    } finally {
      setLoadingFaculty(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!faculty || !date || !time || !reason.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get authentication token
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Please login to book an appointment');
        router.replace('/login');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.appointments}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          facultyId: faculty._id,
          date: new Date(date).toISOString(),
          time,
          duration,
          reason,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      // Navigate back or to appointments list
      router.replace('/appointments');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to book appointment';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // 3 months ahead
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
              <ThemedText style={styles.backIconText}>←</ThemedText>
            </TouchableOpacity>
            <ThemedText type="title" style={styles.title}>Book Appointment</ThemedText>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
              </View>
            )}

            {/* Faculty Info */}
            {loadingFaculty ? (
              <View style={styles.inputContainer}>
                <ThemedText style={styles.loadingText}>Loading faculty information...</ThemedText>
              </View>
            ) : faculty ? (
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Faculty</ThemedText>
                <View style={styles.selectedFaculty}>
                  <View style={styles.selectedInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.selectedName}>
                      {faculty.name}
                    </ThemedText>
                    <ThemedText style={styles.selectedDept}>{faculty.department}</ThemedText>
                    {faculty.designation && (
                      <ThemedText style={styles.selectedDesignation}>{faculty.designation}</ThemedText>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <View style={styles.errorContainer}>
                  <ThemedText style={styles.errorText}>⚠️ Failed to load faculty information</ThemedText>
                  <TouchableOpacity onPress={() => router.back()} style={styles.backButtonSmall}>
                    <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Date */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Date *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD (e.g., 2024-12-25)"
                placeholderTextColor={Colors.textLight}
                value={date}
                onChangeText={(text) => {
                  // Format as YYYY-MM-DD
                  const formatted = text.replace(/\D/g, '').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3').substring(0, 10);
                  setDate(formatted);
                }}
                keyboardType="numeric"
                editable={!loading}
              />
              <ThemedText style={styles.hintText}>
                Format: YYYY-MM-DD (select a date from tomorrow onwards)
              </ThemedText>
            </View>

            {/* Time */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Time *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="HH:MM (e.g., 14:30)"
                placeholderTextColor={Colors.textLight}
                value={time}
                onChangeText={(text) => {
                  // Format as HH:MM
                  const formatted = text.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1:$2').substring(0, 5);
                  setTime(formatted);
                }}
                keyboardType="numeric"
                editable={!loading}
              />
              <ThemedText style={styles.hintText}>Format: HH:MM (24-hour format)</ThemedText>
            </View>

            {/* Duration */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Duration (minutes) *</ThemedText>
              <View style={styles.durationContainer}>
                {[15, 30, 45, 60].map((dur) => (
                  <TouchableOpacity
                    key={dur}
                    style={[
                      styles.durationButton,
                      duration === dur && styles.durationButtonActive,
                    ]}
                    onPress={() => setDuration(dur)}
                    disabled={loading}
                  >
                    <ThemedText
                      style={[
                        styles.durationButtonText,
                        duration === dur && styles.durationButtonTextActive,
                      ]}
                    >
                      {dur} min
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Reason */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Reason/Description *</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Brief reason for the appointment..."
                placeholderTextColor={Colors.textLight}
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
                editable={!loading}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, (loading || !faculty || !date || !time || !reason.trim()) && styles.buttonDisabled]}
              onPress={handleBookAppointment}
              disabled={loading || !faculty || !date || !time || !reason.trim()}
            >
              <ThemedText style={styles.submitButtonText}>
                {loading ? 'Booking...' : 'Book Appointment'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
  title: {
    color: Colors.white,
    fontSize: 24,
  },
  formContainer: {
    padding: Spacing.lg,
  },
  errorContainer: {
    backgroundColor: Colors.backgroundAlt,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  errorText: {
    color: Colors.primary,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },
  hintText: {
    color: Colors.textLight,
    fontSize: 12,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  facultyList: {
    maxHeight: 200,
  },
  facultyCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  facultyInfo: {
    flex: 1,
  },
  facultyName: {
    fontSize: 16,
    marginBottom: 2,
  },
  facultyDept: {
    color: Colors.textLight,
    fontSize: 14,
  },
  facultyDesignation: {
    color: Colors.textLight,
    fontSize: 12,
    fontStyle: 'italic',
  },
  selectText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedFaculty: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    fontSize: 16,
    marginBottom: 2,
  },
  selectedDept: {
    color: Colors.textLight,
    fontSize: 14,
  },
  changeButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  changeButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedDesignation: {
    color: Colors.textLight,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 2,
  },
  backButtonSmall: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  durationButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  durationButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  durationButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  durationButtonTextActive: {
    color: Colors.white,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    color: Colors.textLight,
    fontSize: 14,
    textAlign: 'center',
    padding: Spacing.md,
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: 14,
    textAlign: 'center',
    padding: Spacing.md,
  },
});

