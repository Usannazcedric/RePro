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
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Erreur lors de la récupération du profil:", profileError.message);
          return;
        }

        if (!profile || profile.role !== 'apprenant') {
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          setErrorMessage("Accès non autorisé. Seuls les apprenants peuvent se connecter à l'application.");
          return;
        }

        setUser(user);
        setProfile(profile);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async () => {
    try {
      setErrorMessage('');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error("Erreur lors de la récupération du profil:", profileError.message);
          await supabase.auth.signOut();
          setErrorMessage("Erreur lors de la récupération du profil");
          return;
        }

        if (!profile || profile.role !== 'apprenant') {
          await supabase.auth.signOut();
          setErrorMessage("Accès non autorisé. Seuls les apprenants peuvent se connecter à l'application.");
          return;
        }

        setUser(data.user);
        setProfile(profile);
      }
    } catch (error: any) {
      console.error("Erreur lors de la connexion:", error.message);
      if (error.message === "Email not confirmed") {
        setErrorMessage("Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.");
      } else if (error.message.includes("Invalid login credentials")) {
        setErrorMessage("Email ou mot de passe incorrect");
      } else {
        setErrorMessage("Une erreur est survenue lors de la connexion");
      }
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
    }
  };

  const resendConfirmationEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) throw error;

      setErrorMessage("Un nouveau mail de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.");
    } catch (error) {
      console.error("Erreur lors de l'envoi du mail de confirmation:", error);
      setErrorMessage("Impossible d'envoyer le mail de confirmation. Veuillez réessayer plus tard.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#7376FF" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Connexion</Text>
        {errorMessage ? (
          <Text style={styles.errorMessage}>
            {errorMessage}
            {errorMessage.includes('confirmer votre email') && (
              <TouchableOpacity onPress={resendConfirmationEmail}>
                <Text style={styles.resendButton}>
                  Renvoyer l&apos;email de confirmation
                </Text>
              </TouchableOpacity>
            )}
          </Text>
        ) : null}
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
      <Text style={styles.title}>Bienvenue, {profile?.username || user.email}</Text>
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
    color: '#7376FF',
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
    backgroundColor: '#7376FF',
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
  errorMessage: {
    color: '#d32f2f',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: 'center',
  },
  resendButton: {
    color: '#7376FF',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
});
