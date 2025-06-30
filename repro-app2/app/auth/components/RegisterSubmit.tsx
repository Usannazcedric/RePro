import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
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

      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user?.id,
            username: userData.username,
            email: userData.email,
            tranche_age: userData.age,
            genre: userData.genre,
            theme: userData.themes ? userData.themes.join(', ') : '',
            raison: userData.raisons ? userData.raisons.join(', ') : '',
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
      <View style={styles.progressBar}>
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={[styles.progressStep, styles.progressStepActive]} />
      </View>

      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Merci pour votre patience</Text>
          <Text style={styles.subtitle}>Votre profil a été créé avec succès</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image 
            source={require('../../../assets/images/submitregister.png')} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#7376FF" />
          ) : (
            <>
              <TouchableOpacity style={styles.startButton} onPress={handleSubmit}>
                <Text style={styles.startButtonText}>Commencer à se former</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backButton} onPress={onPrev}>
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressBar: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingTop: 20,
    gap: 8,
  },
  progressStep: {
    flex: 1,
    height: 13,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  progressStepActive: {
    backgroundColor: '#7376FF',
    shadowColor: '#7376FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 60,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  image: {
    width: '100%',
    height: 1000,
  },
  hexagonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexagon: {
    width: 120,
    height: 120,
    backgroundColor: '#7376FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7376FF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  checkmark: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  startButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#7376FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7376FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  backButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});
