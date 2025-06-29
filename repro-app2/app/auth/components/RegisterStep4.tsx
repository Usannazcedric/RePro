import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, StyleSheet } from 'react-native';

interface RegisterStep4Props {
  onNext: (data: { raison: string }) => void;
  onPrev: () => void;
  userData?: any;
}

export default function RegisterStep4({ onNext, onPrev, userData }: RegisterStep4Props) {
  const [raison, setRaison] = useState(userData?.raison || '');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Quelle est votre raison ?</Text>
      <TextInput
        style={styles.input}
        placeholder="Raison"
        value={raison}
        onChangeText={setRaison}
      />
      <Button title="Suivant" onPress={() => onNext({ raison })} />
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
