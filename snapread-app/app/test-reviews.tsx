import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function TestReviewsScreen() {
  const [testing, setTesting] = useState(false);

  const testReviewsTable = async () => {
    if (testing) return;
    
    try {
      setTesting(true);
      console.log('🔍 Test de la table reviews...');

      // Test 1: Vérifier si la table existe
      const { data: tableData, error: tableError } = await supabase
        .from('reviews')
        .select('*')
        .limit(1);

      console.log('📋 Test table existence:', { tableData, tableError });

      if (tableError) {
        Alert.alert('❌ Erreur Table', `La table reviews n'existe pas ou n'est pas accessible:\n${tableError.message}`);
        return;
      }

      // Test 2: Vérifier l'utilisateur connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        Alert.alert('❌ Erreur Auth', 'Aucun utilisateur connecté');
        return;
      }

      console.log('👤 Utilisateur connecté:', user.id);

      // Test 3: Essayer d'insérer une note de test
      const testReview = {
        user_id: user.id,
        formation_id: 'test-formation-id',
        rating: 5,
        updated_at: new Date().toISOString()
      };

      console.log('💾 Insertion test:', testReview);

      const { data: insertData, error: insertError } = await supabase
        .from('reviews')
        .upsert(testReview, {
          onConflict: 'user_id,formation_id'
        })
        .select();

      console.log('📝 Résultat insertion:', { insertData, insertError });

      if (insertError) {
        Alert.alert('❌ Erreur Insertion', `Impossible d'insérer:\n${insertError.message}`);
        return;
      }

      // Test 4: Supprimer la note de test
      const { error: deleteError } = await supabase
        .from('reviews')
        .delete()
        .eq('user_id', user.id)
        .eq('formation_id', 'test-formation-id');

      if (deleteError) {
        console.warn('⚠️ Erreur suppression test:', deleteError);
      }

      Alert.alert('✅ Succès', 'La table reviews fonctionne correctement!');

    } catch (error) {
      console.error('❌ Erreur générale:', error);
      Alert.alert('❌ Erreur', `Erreur inattendue: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Test Table Reviews</Text>
        <Text style={styles.description}>
          Ce test vérifie si la table reviews existe et fonctionne correctement.
        </Text>
        
        <TouchableOpacity 
          style={[styles.button, { opacity: testing ? 0.7 : 1 }]}
          onPress={testReviewsTable}
          disabled={testing}
        >
          <Text style={styles.buttonText}>
            {testing ? 'Test en cours...' : 'Tester la table reviews'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.instructions}>
          {'\n'}Instructions après le test:
          {'\n'}• Si le test échoue, va sur supabase.com
          {'\n'}• SQL Editor → colle le contenu de create-reviews-table.sql
          {'\n'}• Clique sur Run pour créer la table
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#7376FF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
}); 