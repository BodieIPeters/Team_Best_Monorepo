/**
 * "Forgot password" screen (Kanban story #60). The app has no real accounts or
 * email yet, so this only shows the steps a real reset would follow: the student
 * enters their username or email and sees a confirmation message.
 */
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  onBack: () => void;
};

export function ForgotPassword({ onBack }: Props) {
  const [identifier, setIdentifier] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (identifier.trim()) {
      setSent(true);
    }
  };

  return (
    <View testID="forgot-password">
      <Text style={styles.title}>Reset your password</Text>

      {sent ? (
        <Text style={styles.message} testID="reset-confirmation">
          If an account matches {identifier.trim()}, we sent a link to reset your
          password. Check your email.
        </Text>
      ) : (
        <>
          <Text style={styles.subtitle}>
            Enter your username or email and we will send you a link to reset your password.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Username or email"
            placeholderTextColor="#888"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            testID="input-reset-identifier"
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit} testID="btn-send-reset">
            <Text style={styles.buttonText}>Send Reset Link</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.backBtn} onPress={onBack} testID="btn-back-to-signin">
        <Text style={styles.backText}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 12 },
  message: { fontSize: 15, color: '#065f46', textAlign: 'center', marginVertical: 16 },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  backBtn: { marginTop: 16, alignItems: 'center' },
  backText: { color: '#1e3a8a', fontWeight: '600' },
});