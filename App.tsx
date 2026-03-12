import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Splash from './components/Splash';
import Onboarding from './components/Onboarding';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignupScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import PantryManagement from './components/PantryManagement';

const ONBOARDING_KEY = 'hasSeenOnboarding';

// Mock credentials for testing
const MOCK_EMAIL = 'test@havvy.com';
const MOCK_PASSWORD = 'password123';

type Screen = 'splash' | 'onboarding' | 'login' | 'signup' | 'forgotPassword' | 'pantry';

export default function App() {
  const [screen, setScreen] = useState<Screen>('pantry');
  const [loginError, setLoginError] = useState<string | undefined>();

  const handleSplashFinish = async () => {
    const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
    setScreen(seen ? 'login' : 'onboarding');
  };

  const handleOnboardingDone = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setScreen('login');
  };

  const handleSignIn = (email: string, password: string, _rememberMe: boolean) => {
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      setLoginError(undefined);
      setScreen('pantry');
    } else {
      setLoginError('Invalid email or password. Try test@havvy.com / password123');
    }
  };

  if (screen === 'splash') {
    return <Splash onFinish={handleSplashFinish} />;
  }

  if (screen === 'onboarding') {
    return (
      <Onboarding
        onComplete={handleOnboardingDone}
        onSkip={handleOnboardingDone}
      />
    );
  }

  if (screen === 'signup') {
    return (
      <SignUpScreen
        onBack={() => setScreen('login')}
        onSignUp={(fullName, email, password) => {
          // TODO: integrate Supabase auth
        }}
        onSignIn={() => setScreen('login')}
        onGoogleSignUp={() => {}}
        onAppleSignUp={() => {}}
        onTermsOfService={() => {}}
        onPrivacyPolicy={() => {}}
      />
    );
  }

  if (screen === 'forgotPassword') {
    return (
      <ForgotPasswordScreen
        onSendResetLink={(email) => {
          // TODO: integrate Supabase password reset
        }}
        onBackToSignIn={() => setScreen('login')}
      />
    );
  }

  if (screen === 'pantry') {
    return (
      <SafeAreaProvider>
        <PantryManagement
          onAddItem={() => {}}
          onItemPress={() => {}}
          onProfilePress={() => setScreen('login')}
          onFilterPress={() => {}}
          onTabPress={() => {}}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <LoginScreen
      onSignIn={handleSignIn}
      onSignUp={() => setScreen('signup')}
      onForgotPassword={() => setScreen('forgotPassword')}
      onGoogleSignIn={() => {}}
      onAppleSignIn={() => {}}
      onPrivacyPolicy={() => {}}
      onTermsOfService={() => {}}
      onSupport={() => {}}
      error={loginError}
    />
  );
}
