import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const storedUser = await AsyncStorage.getItem('user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUsername(parsed.username);
          } else {
            setUsername(null);
          }
        } catch (err) {
          console.error('Erreur lors du chargement de l’utilisateur', err);
        }
      };

      fetchUser();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>Reprenons l’apprentissage,</Text>
          <Text style={styles.title}>
            <Text style={{ fontWeight: 'bold', color: '#0B3C83' }}>
              {username ? `${username} !` : '...'}
            </Text>
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
