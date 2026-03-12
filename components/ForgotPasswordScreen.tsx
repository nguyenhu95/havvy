import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type Props = {
  /** Called when user taps "Send Reset Link" with a valid email */
  onSendResetLink: (email: string) => void;
  /** Called when user taps the back arrow or "Back to Sign In" */
  onBackToSignIn: () => void;
  /** Optional: shows loading spinner on the button when true */
  isLoading?: boolean;
  /** Optional: displays an error message below the form */
  error?: string;
  /** Optional: displays a success message after email is sent */
  success?: string;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ForgotPasswordScreen({
  onSendResetLink,
  onBackToSignIn,
  isLoading = false,
  error,
  success,
}: Props) {
  const [email, setEmail] = useState('');

  const handleSendResetLink = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    onSendResetLink(trimmedEmail);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoid}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <Pressable
                onPress={onBackToSignIn}
                style={styles.backButton}
                hitSlop={12}
                disabled={isLoading}
              >
                <Text style={styles.backIcon}>←</Text>
              </Pressable>
              <Text style={styles.headerTitle}>Forgot Password</Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* Welcome */}
            <View style={styles.welcomeContainer}>
              <View style={styles.iconCircle}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
              <Text style={styles.welcomeTitle}>Reset password</Text>
              <Text style={styles.welcomeSubtitle}>
                Enter your email to receive a reset link
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="hello@example.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  editable={!isLoading}
                />
              </View>

              {/* Error message */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Success message */}
              {success && (
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>{success}</Text>
                </View>
              )}

              {/* Action Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.sendButton,
                  pressed && styles.sendButtonPressed,
                  isLoading && styles.sendButtonDisabled,
                ]}
                onPress={handleSendResetLink}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.sendButtonText}>Send Reset Link</Text>
                )}
              </Pressable>
            </View>

            {/* Back to Sign In */}
            <View style={styles.backToSignInContainer}>
              <Pressable onPress={onBackToSignIn} disabled={isLoading}>
                <Text style={styles.backToSignInText}>← Back to Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const COLORS = {
  teal: '#0d9488',
  tealDark: '#0f766e',
  tealLight: 'rgba(13, 148, 139, 0.1)',
  background: '#f1f5f9',
  cardBackground: '#ffffff',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  inputBorder: '#e2e8f0',
  inputBackground: '#ffffff',
  error: '#ef4444',
  errorBackground: '#fef2f2',
  success: '#16a34a',
  successBackground: '#f0fdf4',
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },

  // Welcome / Icon
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  lockIcon: {
    fontSize: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },

  // Form
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.inputBackground,
  },

  // Error
  errorContainer: {
    backgroundColor: COLORS.errorBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
  },

  // Success
  successContainer: {
    backgroundColor: COLORS.successBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  successText: {
    color: COLORS.success,
    fontSize: 14,
    textAlign: 'center',
  },

  // Send Button
  sendButton: {
    height: 52,
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonPressed: {
    backgroundColor: COLORS.tealDark,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Back to Sign In
  backToSignInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToSignInText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.teal,
  },
});