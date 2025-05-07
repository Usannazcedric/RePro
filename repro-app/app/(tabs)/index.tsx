import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
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
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
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

        {/* Quiz + stats */}
        <View style={styles.dashboard}>
          <View style={[styles.card, styles.quiz]}>
            <Text style={styles.quizLabel}>AUJOURD’HUI - QUIZ</Text>
            <Text style={styles.quizTitle}>Python</Text>
            
          </View>

          <View style={[styles.card, styles.circle]}>
            <Text style={styles.circleValue}>90%</Text>
            <Text style={styles.circleLabel}>XP restant</Text>
          </View>

          <View style={[styles.card, styles.circle]}>
            <Text style={styles.circleValue}>75%</Text>
            <Text style={styles.circleLabel}>Précision</Text>
          </View>
        </View>

        {/* Historique */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historique des Quiz</Text>
            <TouchableOpacity onPress={() => router.push('/history')}>
  <Text style={styles.link}>Voir tout</Text>
</TouchableOpacity>
          </View>
          <View style={styles.quizHistory}>
            <Text style={styles.quizSubject}>React Native</Text>
            <Text style={styles.quizInfo}>
              Quiz : 19/20 <Text style={styles.success}>RÉUSSI</Text>
            </Text>
          </View>
        </View>

        {/* Routine */}
        <View style={styles.routine}>
          <Text style={styles.routineTitle}>REPRO ROUTINE • 4 JOURS</Text>
          <Text style={styles.routineSubtext}>
            Connectez-vous plusieurs jours d’affilée pour créer une routine.
          </Text>
          <View style={styles.routineDays}>
            {['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'].map((day, index) => (
              <View
                key={day}
                style={[
                  styles.day,
                  index >= 2 && index <= 5
                    ? styles.activeDay
                    : index === 6
                    ? styles.pendingDay
                    : styles.inactiveDay,
                ]}
              >
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Formations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Formations Suggérées</Text>
          <View style={styles.courseContainer}>
            <View style={styles.courseCard}>
              <Text style={styles.courseBadge}>📄 Certificat Disponible</Text>
              <Text style={styles.courseTitle}>Computer Science</Text>
              <Text style={styles.courseInfo}>30 Quiz • 10 Chapitres</Text>
            </View>
            <View style={styles.courseCard}>
              <Text style={styles.courseBadge}>🧪 Certificat Disponible</Text>
              <Text style={styles.courseTitle}>AP® Biology</Text>
              <Text style={styles.courseInfo}>20 Quiz • 7 Chapitres</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  dashboard: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    flex: 1,
    alignItems: 'center',
  },
  quiz: {
    alignItems: 'flex-start',
  },
  quizLabel: {
    fontSize: 12,
    color: '#888',
  },
  quizTitle: {
    fontSize: 20,
    marginVertical: 8,
  },
  quizBtn: {
    backgroundColor: '#0B3C83',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  quizBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  circle: {
    justifyContent: 'center',
  },
  circleValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B3C83',
  },
  circleLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#0B3C83',
    fontSize: 14,
  },
  quizHistory: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 12,
  },
  quizSubject: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  quizInfo: {
    fontSize: 14,
    color: '#444',
  },
  success: {
    color: 'green',
    fontWeight: 'bold',
  },
  routine: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  routineTitle: {
    fontWeight: 'bold',
    color: '#0B3C83',
    marginBottom: 4,
  },
  routineSubtext: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  routineDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeDay: {
    backgroundColor: '#34c759',
  },
  inactiveDay: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  pendingDay: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    opacity: 0.6,
  },
  courseContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  courseCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  courseBadge: {
    fontSize: 12,
    color: '#0B3C83',
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  courseInfo: {
    fontSize: 13,
    color: '#666',
  },
});
