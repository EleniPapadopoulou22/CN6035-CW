// Οθόνη σύνδεσης χρήστη με email και κωδικό πρόσβασης, με διαχείριση σφαλμάτων και φόρτωσης
//ελεγχος για κενά πεδία, εμφάνιση μηνύματος σφάλματος σε περίπτωση αποτυχίας σύνδεσης, και απενεργοποίηση κουμπιού κατά τη διάρκεια της υποβολής
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ScreenBackground from '../components/ScreenBackground';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Κενά πεδία', 'Εισαγετε το email και τον κωδικό σας.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
    } catch (error) {
      const message = error.response?.data?.message || 'Αποτυχία συνδεσης.';
      Alert.alert('Login error', message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenBackground>
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>CN6035-CW-Παπαδοπούλου Ελένη</Text>
          <Text style={styles.title}>Theatre Reservations</Text>
          <Text style={styles.subtitle}>Πραγματοποίηστε κράτηση ανερχόμενων παραστάσεων.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Text style={styles.label}>Κωδικός</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Your password"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Pressable
            onPress={handleLogin}
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
              isSubmitting && styles.buttonDisabled,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.primaryButtonText}>Σύνδεση</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Register')} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Δημιουργία νέου λογαριασμού</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 34,
  },
  eyebrow: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 10,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  form: {
    gap: 10,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minHeight: 50,
    marginTop: 14,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: colors.primaryLight,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});