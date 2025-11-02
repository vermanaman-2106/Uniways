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
import { useState } from 'react';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { API_BASE_URL } from '@/constants/api';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@(muj\.manipal\.edu|jaipur\.manipal\.edu)$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid college email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        
        // Check if email was sent successfully (not a development fallback)
        if (data.message && data.message.includes('email sent') && !data.data?.resetToken) {
          // Email sent successfully - show success message
          Alert.alert(
            'Email Sent ✅',
            'Password reset email has been sent to your email address.\n\n📧 Please check your inbox and spam folder.\n\nClick the link in the email to reset your password.',
            [
              { 
                text: 'OK',
                onPress: () => router.back() // Go back to login
              }
            ]
          );
        } else if (data.data && data.data.resetToken) {
          // Development mode: email failed, show token as fallback
          setResetToken(data.data.resetToken);
          Alert.alert(
            'Email Failed - Use Token Instead',
            `Email could not be sent. For development/testing, use this token:\n\n${data.data.resetToken}\n\nUse this token on the reset password page.`,
            [
              {
                text: 'Go to Reset Password',
                onPress: () => {
                  router.push({
                    pathname: '/reset-password',
                    params: { token: data.data.resetToken },
                  });
                },
              },
              { text: 'OK' },
            ]
          );
        } else {
          // Generic success message
          Alert.alert(
            'Success',
            data.message || 'Password reset email has been sent. Please check your email inbox and spam folder.',
            [{ text: 'OK' }]
          );
        }
      } else {
        setError(data.message || 'Failed to generate reset token. Please try again.');
      }
    } catch (err) {
      console.error('Error in forgot password:', err);
      setError('Failed to process request. Please check your connection and try again.');
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
            <ThemedText type="title" style={styles.headerTitle}>Forgot Password</ThemedText>
            <View style={styles.backButton} />
          </View>

          <View style={styles.content}>
            <ThemedText style={styles.description}>
              Enter your college email address and we'll send you a password reset token.
            </ThemedText>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            )}

            {/* Success Message */}
            {success && !resetToken && (
              <View style={styles.successContainer}>
                <ThemedText style={styles.successIcon}>📧</ThemedText>
                <ThemedText style={styles.successText}>
                  Password reset email has been sent!
                </ThemedText>
                <ThemedText style={styles.successSubtext}>
                  Please check your inbox and spam folder. Click the link in the email to reset your password.
                </ThemedText>
              </View>
            )}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Email Address *</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="your.email@muj.manipal.edu"
                placeholderTextColor={Colors.textLight}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading && !success}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, (loading || success) && styles.submitButtonDisabled]}
              onPress={handleForgotPassword}
              disabled={loading || success}
            >
              <ThemedText style={styles.submitButtonText}>
                {loading ? 'Generating Token...' : success ? 'Token Generated' : 'Get Reset Token'}
              </ThemedText>
            </TouchableOpacity>

            {/* Reset Token Display (Development only) */}
            {resetToken && (
              <View style={styles.tokenContainer}>
                <ThemedText style={styles.tokenLabel}>Reset Token (Development):</ThemedText>
                <View style={styles.tokenBox}>
                  <ThemedText style={styles.tokenText}>{resetToken}</ThemedText>
                </View>
                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={() => {
                    router.push({
                      pathname: '/reset-password',
                      params: { token: resetToken },
                    });
                  }}
                >
                  <ThemedText style={styles.continueButtonText}>
                    Continue to Reset Password →
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => router.push('/login')}
            >
              <ThemedText style={styles.backToLoginText}>
                Remember your password? Back to Login
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
  successContainer: {
    padding: Spacing.lg,
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    marginBottom: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#28a745',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  successText: {
    color: '#28a745',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  successSubtext: {
    color: '#2e7d32',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
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
  tokenContainer: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: '#fff5f0',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  tokenLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  tokenBox: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  tokenText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: Colors.text,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
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

