import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';

const complaintTypes = [
  { value: 'ac', label: 'AC Issue', icon: '❄️' },
  { value: 'projector', label: 'Projector Issue', icon: '📽️' },
  { value: 'hdmi_cable', label: 'HDMI Cable Needed', icon: '🔌' },
  { value: 'wifi', label: 'WiFi Issue', icon: '📶' },
  { value: 'furniture', label: 'Furniture Issue', icon: '🪑' },
  { value: 'cleanliness', label: 'Cleanliness', icon: '🧹' },
  { value: 'power_outlet', label: 'Power Outlet', icon: '⚡' },
  { value: 'whiteboard', label: 'Whiteboard', icon: '📝' },
  { value: 'sound_system', label: 'Sound System', icon: '🔊' },
  { value: 'lights', label: 'Lights', icon: '💡' },
  { value: 'water_dispenser', label: 'Water Dispenser', icon: '🚰' },
  { value: 'other', label: 'Other', icon: '📋' },
];

const priorities = [
  { value: 'low', label: 'Low', color: '#28a745' },
  { value: 'medium', label: 'Medium', color: '#ffc107' },
  { value: 'high', label: 'High', color: '#fd7e14' },
  { value: 'urgent', label: 'Urgent', color: '#dc3545' },
];

export default function CreateComplaintScreen() {
  const [type, setType] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Validation
    if (!type) {
      setError('Please select a complaint type');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.complaints}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          building: building.trim() || undefined,
          floor: floor.trim() || undefined,
          priority,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Success', 'Complaint submitted successfully!', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        setError(data.message || 'Failed to submit complaint. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting complaint:', err);
      setError('Failed to submit complaint. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.headerTitle}>New Complaint</ThemedText>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}

          {/* Complaint Type Selection */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Complaint Type *
            </ThemedText>
            <View style={styles.typeGrid}>
              {complaintTypes.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.typeCard,
                    type === item.value && styles.typeCardActive,
                  ]}
                  onPress={() => {
                    setType(item.value);
                    setError(null);
                  }}
                >
                  <ThemedText style={styles.typeIcon}>{item.icon}</ThemedText>
                  <ThemedText
                    style={[
                      styles.typeLabel,
                      type === item.value && styles.typeLabelActive,
                    ]}
                  >
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Title *
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="e.g., AC not working in Room 101"
              placeholderTextColor={Colors.textLight}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setError(null);
              }}
              maxLength={100}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Description *
            </ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the issue in detail..."
              placeholderTextColor={Colors.textLight}
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setError(null);
              }}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {/* Location */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Location *
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="e.g., Room 101, Lab A, Building B - Floor 2"
              placeholderTextColor={Colors.textLight}
              value={location}
              onChangeText={(text) => {
                setLocation(text);
                setError(null);
              }}
            />
          </View>

          {/* Building (Optional) */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Building (Optional)
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="e.g., Engineering Block, Main Building"
              placeholderTextColor={Colors.textLight}
              value={building}
              onChangeText={(text) => {
                setBuilding(text);
                setError(null);
              }}
            />
          </View>

          {/* Floor (Optional) */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Floor (Optional)
            </ThemedText>
            <TextInput
              style={styles.input}
              placeholder="e.g., Ground Floor, 2nd Floor"
              placeholderTextColor={Colors.textLight}
              value={floor}
              onChangeText={(text) => {
                setFloor(text);
                setError(null);
              }}
            />
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Priority
            </ThemedText>
            <View style={styles.priorityContainer}>
              {priorities.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.priorityButton,
                    priority === item.value && [
                      styles.priorityButtonActive,
                      { borderColor: item.color },
                    ],
                  ]}
                  onPress={() => setPriority(item.value)}
                >
                  <ThemedText
                    style={[
                      styles.priorityButtonText,
                      priority === item.value && [
                        styles.priorityButtonTextActive,
                        { color: item.color },
                      ],
                    ]}
                  >
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <ThemedText style={styles.submitButtonText}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.spacer} />
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
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  errorContainer: {
    padding: Spacing.md,
    backgroundColor: '#fee',
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: '#c33',
    fontSize: 14,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
    color: Colors.text,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeCard: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  typeCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#fff5f0',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  typeLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.textLight,
  },
  typeLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 120,
    paddingTop: Spacing.md,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderWidth: 2,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  priorityButtonTextActive: {
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  spacer: {
    height: Spacing.xl,
  },
});

