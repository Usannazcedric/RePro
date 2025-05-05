import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>Reprenons l’apprentissage,</Text>
          <Text style={styles.title}>
            <Text style={{ fontWeight: 'bold', color: '#0B3C83' }}>Alex Park!</Text>
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Image
            source={require('/Users/drikce/Desktop/RePro/repro-app/assets/images/pexels-photo-415829.jpeg')} 
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    color: '#000',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
