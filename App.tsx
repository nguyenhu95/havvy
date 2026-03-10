import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Splash from './components/Splash';
import LoginScreen from './components/LoginScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return <LoginScreen onLoginSuccess={() => {}} onSignUpPress={() => {}} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
