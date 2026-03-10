import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

type Props = {
  /** Called when the splash duration completes */
  onFinish: () => void;
  /** How long to show the splash in milliseconds (default: 2000ms) */
  duration?: number;
};


// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function Splash({ onFinish, duration = 2000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    // Cleanup: cancel timer if component unmounts early
    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.iconCircle}>
        <Text style={styles.logoLeaf}>🥬</Text>
      </View>

      {/* Text */}
      <Text style={styles.appName}>Havvy</Text>
      <Text style={styles.tagline}>Smart pantry, zero waste</Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.footerText}>SECURE CLOUD SYNC</Text>
      </View>
    </View>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const COLORS = {
  background: '#0d9488',
  iconCircle: 'rgba(255, 255, 255, 0.15)',
  white: '#ffffff',
  tagline: '#99f6e4',
  footerText: 'rgba(255, 255, 255, 0.7)',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.iconCircle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  leafShape: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafVein: {
    backgroundColor: COLORS.background,
  },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    color: COLORS.tagline,
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lockIcon: {
    fontSize: 14,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.footerText,
    letterSpacing: 1.5,
  },
  logoLeaf: {
    fontSize: 64
  }
});