import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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
        router.replace('/(tabs)');
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
      router.replace('/auth/LoginScreen');
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

  const handleRegisterRedirect = () => {
    router.push('/auth/RegisterScreen');
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
        <View style={styles.content}>
          <Text style={styles.appTitle}>SnapRead</Text>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Bienvenue ! Connectez-vous</Text>
            <Text style={styles.title}>pour continuer à vous former</Text>
          </View>

          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>
                {errorMessage}
              </Text>
              {errorMessage.includes('confirmer votre email') && (
                <TouchableOpacity onPress={resendConfirmationEmail}>
                  <Text style={styles.resendButton}>
                    Renvoyer l&apos;email de confirmation
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              placeholder="Gab1"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={[styles.input, passwordFocused && styles.inputFocused]}
              placeholder=""
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton}>
            <Image 
              source={require('../../assets/images/google.png')} 
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continuer avec Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRegisterRedirect}>
            <Text style={styles.registerLink}>
              Pas encore de compte ? <Text style={styles.registerLinkBlue}>S&apos;inscrire</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeTitle}>Bienvenue, {profile?.username || user.email}</Text>
      <Text style={styles.label}>Email :</Text>
      <Text style={styles.text}>{user.email}</Text>

      <TouchableOpacity onPress={handleLogout} style={[styles.loginButton, styles.logoutButton]}>
        <Text style={styles.loginButtonText}>Se déconnecter</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#7476FF',
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    lineHeight: 28,
  },
  errorContainer: {
    marginBottom: 20,
  },
  errorMessage: {
    color: '#d32f2f',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  resendButton: {
    color: '#7376FF',
    textDecorationLine: 'underline',
    marginTop: 8,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 7,
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: '#7376FF',
    backgroundColor: '#fff',
    shadowColor: '#7376FF',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  loginButton: {
    backgroundColor: '#7476FF',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#666',
    fontSize: 13,
  },
  googleButton: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
    marginBottom: 36,
    gap: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  registerLink: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginBottom: 25,
  },
  registerLinkBlue: {
    color: '#7476FF',
    fontWeight: '500',
  },
  // Styles pour l'état connecté
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#7376FF',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    marginTop: 32,
  },
});
