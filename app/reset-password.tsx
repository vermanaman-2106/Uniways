import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { API_BASE_URL } from '@/constants/api';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string }>();
  const [resetToken, setResetToken] = useState(params.token || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.token) {
      setResetToken(params.token);
    }
  }, [params.token]);

  const handleResetPassword = async () => {
    // Validation
    if (!resetToken.trim()) {
      setError('Please enter the reset token');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a new password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken: resetToken.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token for automatic login
        if (data.data && data.data.token) {
          await AsyncStorage.setItem('token', data.data.token);
        }

        Alert.alert('Success', 'Password reset successfully!', [
          {
            text: 'OK',
            onPress: () => router.replace('/'),
          },
        ]);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error('Error in reset password:', err);
      setError('Failed to reset password. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ThemedText style={styles.backButtonText}>← Back</ThemedText>
            </TouchableOpacity>
            <ThemedText type="title" style={styles.headerTitle}>Reset Password</ThemedText>
            <View style={styles.backButton} />
          </View>

          <View style={styles.content}>
            <ThemedText style={styles.description}>
              Enter your reset token and new password to reset your account password.
            </ThemedText>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            )}

            {/* Reset Token Input */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Reset Token *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter reset token"
                placeholderTextColor={Colors.textLight}
                value={resetToken}
                onChangeText={(text) => {
                  setResetToken(text);
                  setError(null);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* New Password Input */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>New Password *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Enter new password (min 6 characters)"
                placeholderTextColor={Colors.textLight}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError(null);
                }}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                autoComplete="password-new"
                editable={!loading}
              />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Confirm Password *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor={Colors.textLight}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError(null);
                }}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                autoComplete="password-new"
                editable={!loading}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <ThemedText style={styles.submitButtonText}>
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </ThemedText>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => router.push('/login')}
            >
              <ThemedText style={styles.backToLoginText}>Back to Login</ThemedText>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl * 2 + 20,
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
  content: {
    padding: Spacing.xl,
    flex: 1,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: Spacing.xl,
    lineHeight: 24,
    textAlign: 'center',
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
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
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
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: Spacing.md,
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
  backToLoginButton: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  backToLoginText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

