import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function TestPostsScreen() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    runTests();
  }, []);

  const addTestResult = (test: string, result: string, success: boolean) => {
    setTestResults(prev => [...prev, { test, result, success }]);
  };

  const runTests = async () => {
    try {
      // Test 1: Vérifier l'utilisateur connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        addTestResult("1. Utilisateur connecté", `Erreur: ${userError.message}`, false);
      } else if (user) {
        setUser(user);
        addTestResult("1. Utilisateur connecté", `✅ ID: ${user.id}`, true);
      } else {
        addTestResult("1. Utilisateur connecté", "❌ Aucun utilisateur", false);
      }

      // Test 2: Compter tous les posts
      const { count: postsCount, error: countError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        addTestResult("2. Compter les posts", `Erreur: ${countError.message}`, false);
      } else {
        addTestResult("2. Compter les posts", `Total: ${postsCount || 0} posts`, postsCount > 0);
      }

      // Test 3: Récupérer tous les posts (sans filtre)
      const { data: allPosts, error: allPostsError } = await supabase
        .from('posts')
        .select('*')
        .limit(5);

      if (allPostsError) {
        addTestResult("3. Récupérer posts", `Erreur: ${allPostsError.message}`, false);
      } else {
        addTestResult("3. Récupérer posts", `${allPosts?.length || 0} posts récupérés`, true);
        setPosts(allPosts || []);
      }

      // Test 4: Tester la création d'un post
      if (user) {
        const testPost = {
          content: 'Test post depuis l\'app mobile',
          formation_title: 'Elevator Pitch 2',
          user_id: user.id,
          created_at: new Date().toISOString()
        };

        const { data: newPost, error: createError } = await supabase
          .from('posts')
          .insert([testPost])
          .select()
          .single();

        if (createError) {
          addTestResult("4. Créer un post", `Erreur: ${createError.message}`, false);
        } else {
          addTestResult("4. Créer un post", `✅ Post créé avec ID: ${newPost.id}`, true);
          
          // Supprimer le post de test
          await supabase.from('posts').delete().eq('id', newPost.id);
        }
      }

      // Test 5: Vérifier les politiques RLS
      const { data: rlsInfo, error: rlsError } = await supabase
        .from('posts')
        .select('id')
        .limit(1);

      if (rlsError && rlsError.message.includes('policy')) {
        addTestResult("5. Politiques RLS", `❌ Problème de permissions: ${rlsError.message}`, false);
      } else {
        addTestResult("5. Politiques RLS", "✅ Permissions OK", true);
      }

    } catch (error) {
      console.error('Erreur pendant les tests:', error);
      addTestResult("Erreur générale", error.message, false);
    } finally {
      setLoading(false);
    }
  };

  const createTestPost = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté');
      return;
    }

    try {
      const testPost = {
        content: 'Post de test créé manuellement depuis l\'app',
        formation_title: 'Elevator Pitch 2',
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('posts')
        .insert([testPost])
        .select()
        .single();

      if (error) {
        Alert.alert('Erreur', `Impossible de créer le post: ${error.message}`);
      } else {
        Alert.alert('Succès', `Post créé avec l'ID: ${data.id}`);
        runTests(); // Relancer les tests
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>🔍 Test de Debug Posts</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résultats des tests:</Text>
          {testResults.map((result, index) => (
            <View key={index} style={[styles.testResult, { backgroundColor: result.success ? '#e8f5e8' : '#ffe8e8' }]}>
              <Text style={styles.testName}>{result.test}</Text>
              <Text style={styles.testDetail}>{result.result}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posts trouvés ({posts.length}):</Text>
          {posts.map((post, index) => (
            <View key={index} style={styles.postItem}>
              <Text style={styles.postId}>ID: {post.id}</Text>
              <Text style={styles.postContent}>{post.content}</Text>
              <Text style={styles.postFormation}>Formation: {post.formation_title || 'Aucune'}</Text>
              <Text style={styles.postDate}>Date: {new Date(post.created_at).toLocaleString()}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={createTestPost}>
          <Text style={styles.buttonText}>Créer un post de test</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={runTests}>
          <Text style={styles.buttonText}>Relancer les tests</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  testResult: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#7376FF',
  },
  testName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  testDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  postItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  postId: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  postFormation: {
    fontSize: 12,
    color: '#7376FF',
    marginTop: 4,
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#7376FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 