/*
    This is the welcome page that is shown when the app is first opened.
    It has a button that takes the user to the auth screen (login / signup)
*/

import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';


export default function WelcomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Welcome!</ThemedText>
      <ThemedText style={styles.subtitle}>Press the button to enter the app.</ThemedText>
      
      {/* "replace" removes the welcome screen from the navigation history */}
      <Link href="/auth" replace style={styles.button}>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          Enter App
        </ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonText: {
    color: '#ffffff',
  },
});