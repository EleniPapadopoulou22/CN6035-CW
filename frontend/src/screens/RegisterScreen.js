// Οθόνη εγγραφής νέου χρήστη με όνομα, email και κωδικό πρόσβασης, με διαχείριση σφαλμάτων και φόρτωσης
//ελεγχος για κενά πεδία, ασθενείς κωδικούς, εμφάνιση μηνύματος σφάλματος σε περίπτωση αποτυχίας εγγραφής, και απενεργοποίηση κουμπιού κατά τη διάρκεια της υποβολής
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

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    if (!name || !email || !password) {
      Alert.alert('Κενά πεδία', 'Παρακαλώ συμπληρώστε όλα τα πεδία.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Ασθενής κωδικός', 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name.trim(), email.trim(), password);
    } catch (error) {
      const message = error.response?.data?.message || 'Η εγγραφή απέτυχε. Παρακαλώ δοκιμάστε ξανά.';
      Alert.alert('Σφάλμα εγγραφής', message);
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
          <Text style={styles.eyebrow}>Νέος χρήστης</Text>
          <Text style={styles.title}>Δημιούργησε το προφίλ σου!</Text>
          <Text style={styles.subtitle}>Κάνε εγγραφή για να έχεις πρόσβαση σε κρατήσεις παραστάσεων.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Όνομα</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Το όνομά σου"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

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
            placeholder="Τουλάχιστον 6 χαρακτήρες"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />

          <Pressable
            onPress={handleRegister}
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
              <Text style={styles.primaryButtonText}>Δημιουργία λογαριασμού</Text>
            )}
          </Pressable>

          <Pressable onPress={() => navigation.navigate('Login')} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Επιστροφή στην είσοδο</Text>
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
    marginBottom: 30,
  },
  eyebrow: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 38,
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