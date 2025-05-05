import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string; username: string } | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Erreur lors de la lecture du token', err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:1337/api/auth-app-user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur ${res.status} : ${errorText}`);
      }

      const data = await res.json();
      await AsyncStorage.setItem('token', data.jwt);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.jwt);
      setUser(data.user);
    } catch (err) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (!token || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Connexion</Text>
        <TextInput
          style={styles.input}
          placeholder="Adresse email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        <Text style={styles.or}>Ou</Text>

        <TouchableOpacity style={[styles.button, styles.outline]}>
          <Text style={[styles.buttonText, styles.outlineText]}>Continuer avec Google</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity style={[styles.button, styles.outline]}>
            <Text style={[styles.buttonText, styles.outlineText]}>Continuer avec Apple</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bienvenue, {user.username}</Text>
      <Text style={styles.label}>Email :</Text>
      <Text style={styles.text}>{user.email}</Text>

      <TouchableOpacity onPress={handleLogout} style={[styles.button, styles.logoutButton]}>
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#0B3C83',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0B3C83',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  outline: {
    backgroundColor: '#f2f2f2',
  },
  outlineText: {
    color: '#333',
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: 'red',
    marginTop: 32,
  },
});
