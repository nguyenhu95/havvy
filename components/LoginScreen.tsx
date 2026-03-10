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

/**
 * Props for the LoginScreen component.
 * 
 * These callback props allow the parent component (your navigation container)
 * to handle actions like sign-in, navigation to sign-up, etc.
 * 
 * 🔮 FUTURE: When you integrate Supabase auth in Weeks 5-6, the onSignIn
 * callback will trigger the actual authentication flow.
 */
type Props = {
  /** Called when user taps "Sign In" with valid credentials */
  onSignIn: (email: string, password: string, rememberMe: boolean) => void;
  /** Called when user taps "Sign up for free" */
  onSignUp: () => void;
  /** Called when user taps "Forgot password?" */
  onForgotPassword: () => void;
  /** Called when user taps Google sign-in button */
  onGoogleSignIn: () => void;
  /** Called when user taps Apple sign-in button */
  onAppleSignIn: () => void;
  /** Called when user taps Privacy Policy link */
  onPrivacyPolicy: () => void;
  /** Called when user taps Terms of Service link */
  onTermsOfService: () => void;
  /** Called when user taps Support link */
  onSupport: () => void;
  /** Optional: shows loading spinner on sign-in button when true */
  isLoading?: boolean;
  /** Optional: displays an error message below the form */
  error?: string;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function LoginScreen({
  onSignIn,
  onSignUp,
  onForgotPassword,
  onGoogleSignIn,
  onAppleSignIn,
  onPrivacyPolicy,
  onTermsOfService,
  onSupport,
  isLoading = false,
  error,
}: Props) {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  
  /**
   * Form state using controlled inputs.
   * Each input's value is stored in state and updated via onChange.
   * This is the pattern you learned in Jonas's course!
   */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  /**
   * Handles the sign-in button press.
   * Basic validation ensures both fields have content before proceeding.
   * 
   * 🔮 FUTURE: You could add more sophisticated validation here:
   * - Email format validation (regex or a library like Zod)
   * - Password minimum length
   * - These are covered in Phase 2 of your plan (form validation with Zod)
   */
  const handleSignIn = () => {
    // Trim whitespace and check for empty fields
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      // In a real app, you'd set a local error state here
      // For now, we just don't proceed if fields are empty
      return;
    }

    onSignIn(trimmedEmail, trimmedPassword, rememberMe);
  };

  /**
   * Toggles password visibility between hidden (dots) and visible (text).
   * The eye icon in the password field triggers this.
   */
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  /**
   * Toggles the "Keep me signed in" checkbox.
   */
  const toggleRememberMe = () => {
    setRememberMe((prev) => !prev);
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

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
          {/* ----------------------------------------------------------------- */}
          {/* CARD CONTAINER - The white card containing the form               */}
          {/* ----------------------------------------------------------------- */}
          <View style={styles.card}>
            {/* --------------------------------------------------------------- */}
            {/* HEADER - Logo and welcome text                                  */}
            {/* --------------------------------------------------------------- */}
            <View style={styles.header}>
              {/* Logo and brand name row */}
              <View style={styles.logoRow}>
                <View style={styles.logoIcon}>
                  <Text style={styles.logoLeaf}>🥬</Text>
                </View>
                <Text style={styles.brandName}>Havvy</Text>
              </View>

              {/* Welcome text */}
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.welcomeSubtitle}>
                Please enter your details to sign in to your account.
              </Text>
            </View>

            {/* --------------------------------------------------------------- */}
            {/* FORM - Email, password, and options                             */}
            {/* --------------------------------------------------------------- */}
            <View style={styles.form}>
              {/* Email input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@company.com"
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

              {/* Password input with forgot password link */}
              <View style={styles.inputGroup}>
                <View style={styles.passwordLabelRow}>
                  <Text style={styles.label}>Password</Text>
                  <Pressable onPress={onForgotPassword} disabled={isLoading}>
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                  </Pressable>
                </View>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    editable={!isLoading}
                  />
                  <Pressable
                    onPress={togglePasswordVisibility}
                    style={styles.eyeButton}
                    hitSlop={8}
                  >
                    <Text style={styles.eyeIcon}>
                      {showPassword ? '🙈' : '👁️'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Remember me checkbox */}
              <Pressable
                style={styles.checkboxRow}
                onPress={toggleRememberMe}
                disabled={isLoading}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  Keep me signed in for 30 days
                </Text>
              </Pressable>

              {/* Error message (if any) */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Sign in button */}
              <Pressable
                style={({ pressed }) => [
                  styles.signInButton,
                  pressed && styles.signInButtonPressed,
                  isLoading && styles.signInButtonDisabled,
                ]}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.signInButtonText}>Sign In</Text>
                )}
              </Pressable>
            </View>

            {/* --------------------------------------------------------------- */}
            {/* DIVIDER - "OR CONTINUE WITH" separator                          */}
            {/* --------------------------------------------------------------- */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* --------------------------------------------------------------- */}
            {/* SOCIAL LOGIN BUTTONS                                            */}
            {/* 🔮 FUTURE: These are placeholders. Real OAuth requires          */}
            {/* expo-dev-client and proper development builds (not Expo Go).    */}
            {/* This is noted in your plan for after the Supabase integration.  */}
            {/* --------------------------------------------------------------- */}
            <View style={styles.socialButtonsRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.socialButtonPressed,
                ]}
                onPress={onGoogleSignIn}
                disabled={isLoading}
              >
                <Text style={styles.socialIcon}>G</Text>
                <Text style={styles.socialButtonText}>Google</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.socialButtonPressed,
                ]}
                onPress={onAppleSignIn}
                disabled={isLoading}
              >
                <Text style={styles.appleIcon}></Text>
                <Text style={styles.socialButtonText}>Apple</Text>
              </Pressable>
            </View>

            {/* --------------------------------------------------------------- */}
            {/* SIGN UP LINK                                                    */}
            {/* --------------------------------------------------------------- */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <Pressable onPress={onSignUp} disabled={isLoading}>
                <Text style={styles.signUpLink}>Sign up for free</Text>
              </Pressable>
            </View>
          </View>

          {/* ----------------------------------------------------------------- */}
          {/* FOOTER - Privacy, Terms, Support links                            */}
          {/* ----------------------------------------------------------------- */}
          <View style={styles.footer}>
            <Pressable onPress={onPrivacyPolicy}>
              <Text style={styles.footerLink}>PRIVACY{'\n'}POLICY</Text>
            </Pressable>
            <Pressable onPress={onTermsOfService}>
              <Text style={styles.footerLink}>TERMS OF{'\n'}SERVICE</Text>
            </Pressable>
            <Pressable onPress={onSupport}>
              <Text style={styles.footerLink}>SUPPORT</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =============================================================================
// STYLES
// =============================================================================

/**
 * Colour palette - extracted as constants for consistency.
 * These match your splash screen colours (#0d9488 teal theme).
 */
const COLORS = {
  // Primary brand colours
  teal: '#0d9488',
  tealDark: '#0f766e',
  tealLight: '#99f6e4',
  
  // Background colours
  background: '#f1f5f9', // Light slate grey
  cardBackground: '#ffffff',
  
  // Text colours
  textPrimary: '#1e293b', // Slate 800
  textSecondary: '#64748b', // Slate 500
  textMuted: '#94a3b8', // Slate 400
  
  // Input colours
  inputBorder: '#e2e8f0', // Slate 200
  inputBackground: '#ffffff',
  
  // Error colour
  error: '#ef4444',
  errorBackground: '#fef2f2',
};

const styles = StyleSheet.create({
  // ---------------------------------------------------------------------------
  // LAYOUT
  // ---------------------------------------------------------------------------
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
  
  // ---------------------------------------------------------------------------
  // CARD
  // ---------------------------------------------------------------------------
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 2,
  },

  // ---------------------------------------------------------------------------
  // HEADER
  // ---------------------------------------------------------------------------
  header: {
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoLeaf: {
    fontSize: 20,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  // ---------------------------------------------------------------------------
  // FORM
  // ---------------------------------------------------------------------------
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
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
  
  // ---------------------------------------------------------------------------
  // PASSWORD FIELD
  // ---------------------------------------------------------------------------
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.teal,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    backgroundColor: COLORS.inputBackground,
  },
  passwordInput: {
    flex: 1,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  eyeButton: {
    padding: 12,
  },
  eyeIcon: {
    fontSize: 20,
  },

  // ---------------------------------------------------------------------------
  // CHECKBOX
  // ---------------------------------------------------------------------------
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: 4,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  // ---------------------------------------------------------------------------
  // ERROR MESSAGE
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // SIGN IN BUTTON
  // ---------------------------------------------------------------------------
  signInButton: {
    height: 52,
    backgroundColor: COLORS.teal,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonPressed: {
    backgroundColor: COLORS.tealDark,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // ---------------------------------------------------------------------------
  // DIVIDER
  // ---------------------------------------------------------------------------
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.inputBorder,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },

  // ---------------------------------------------------------------------------
  // SOCIAL BUTTONS
  // ---------------------------------------------------------------------------
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    gap: 8,
  },
  socialButtonPressed: {
    backgroundColor: '#f8fafc',
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4285f4', // Google blue
  },
  appleIcon: {
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  // ---------------------------------------------------------------------------
  // SIGN UP LINK
  // ---------------------------------------------------------------------------
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.teal,
  },

  // ---------------------------------------------------------------------------
  // FOOTER
  // ---------------------------------------------------------------------------
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingHorizontal: 8,
  },
  footerLink: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});