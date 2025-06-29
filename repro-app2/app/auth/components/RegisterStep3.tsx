import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, StyleSheet } from 'react-native';

interface RegisterStep3Props {
  onNext: (data: { theme: string }) => void;
  onPrev: () => void;
  userData?: any;
}

export default function RegisterStep3({ onNext, onPrev, userData }: RegisterStep3Props) {
  const [theme, setTheme] = useState(userData?.theme || '');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Quel est votre thème préféré ?</Text>
      <TextInput
        style={styles.input}
        placeholder="Thème"
        value={theme}
        onChangeText={setTheme}
      />
      <Button title="Suivant" onPress={() => onNext({ theme })} />
      <Button title="Précédent" onPress={onPrev} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
