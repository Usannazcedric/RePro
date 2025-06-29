import React, { useState } from 'react';
import { SafeAreaView, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';

interface RegisterSubmitProps {
  userData: any;
  onPrev: () => void;
  onSubmit: () => void;
}

export default function RegisterSubmit({ userData, onPrev, onSubmit }: RegisterSubmitProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        throw authError;
      }

      // Ensuite créer le profil avec l'ID de l'utilisateur créé
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user?.id,
            username: userData.username,
            email: userData.email,
            tranche_age: userData.age,
            genre: userData.genre,
            theme: userData.theme,
            raison: userData.raison,
            rythme: userData.rythme
          }
        ]);

      if (error) {
        throw error;
      }

      onSubmit();
      Alert.alert('Inscription réussie', 'Votre inscription a bien été prise en compte !');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Récapitulatif</Text>
      <Text>Nom d'utilisateur : {userData.username}</Text>
      <Text>Email : {userData.email}</Text>
      <Text>Âge : {userData.age}</Text>
      <Text>Genre : {userData.genre}</Text>
      <Text>Thème : {userData.theme}</Text>
      <Text>Raison : {userData.raison}</Text>
      <Text>Rythme : {userData.rythme}</Text>
      <Button title="Précédent" onPress={onPrev} />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Soumettre" onPress={handleSubmit} />
      )}
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
});
