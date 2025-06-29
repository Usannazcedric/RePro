import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, StyleSheet } from 'react-native';

interface RegisterStep5Props {
  onNext: (data: { rythme: string }) => void;
  onPrev: () => void;
  userData?: any;
}

export default function RegisterStep5({ onNext, onPrev, userData }: RegisterStep5Props) {
  const [rythme, setRythme] = useState(userData?.rythme || '');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Quel est votre rythme ?</Text>
      <TextInput
        style={styles.input}
        placeholder="Rythme"
        value={rythme}
        onChangeText={setRythme}
      />
      <Button title="Next" onPress={() => onNext({ rythme })} />
      <Button title="Previous" onPress={onPrev} />
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
