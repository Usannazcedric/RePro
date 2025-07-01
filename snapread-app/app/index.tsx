import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Timeout robuste : si Supabase ne répond pas en 5 secondes, on continue
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => {
            reject(new Error('Supabase timeout'));
          }, 5000)
        );
        
        const authPromise = supabase.auth.getUser();
        
        const { data: { user }, error: authError } = await Promise.race([
          authPromise,
          timeoutPromise
        ]) as any;
        
        if (authError) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!user);
        }
      } catch (error) {
        // En cas d'erreur ou timeout, on continue vers auth
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Ajouter un délai minimum pour éviter le flash
    const minDelay = new Promise(resolve => setTimeout(resolve, 1000));
    
    Promise.all([checkAuthStatus(), minDelay]).then(() => {
      // Cette promesse se résout quand les deux sont terminées
    });
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Chargement de SnapRead...</Text>
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? "/(tabs)" : "/auth"} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
