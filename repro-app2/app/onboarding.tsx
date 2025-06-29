import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/bg-onboarding.png')}
      style={styles.background}
      resizeMode="contain"
    >
      <View style={styles.content}>
        <Text style={styles.logo}>Repro</Text>
        <Text style={styles.title}>Apprenez tout,{'\n'}n'importe où</Text>

        <TouchableOpacity onPress={() => router.push('/auth/RegisterScreen')} style={styles.button}>
          <Text style={styles.buttonText}>Se lancer</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 60,
    alignItems: 'center',
  },
  logo: {
    fontSize: 16,
    color: '#6C6C6C',
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20, // réduit l’espace ici (au lieu de 40)
  },
  
  button: {
    backgroundColor: '#000',
    width: '80%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});
