import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Formations = [
  {
    theme: 'Code',
    title: 'Python',
    chapter: '1e CHAPITRE',
    courses: 10,
    quizzes: 3,
    color: '#3B5BA5',
  },
  {
    theme: 'Design',
    title: 'Composés Aromatiques',
    chapter: '3e CHAPITRE',
    courses: 25,
    quizzes: 9,
    color: '#DA8023',
  },
  {
    theme: 'Code',
    title: 'Génie Génétique',
    chapter: '2e CHAPITRE',
    courses: 15,
    quizzes: 6,
    color: '#2D6F65',
  },
];

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Mes Formations</Text>

        {Formations.map((formation, index) => (
          <View key={index} style={[styles.card, { borderLeftColor: formation.color }]}>
            <Text style={[styles.theme, { color: formation.color }]}>
              {formation.theme}
            </Text>
            <Text style={styles.status}>FORMATION ACHETÉE</Text>
            <Text style={[styles.title, { color: formation.color }]}>{formation.title}</Text>
            <Text style={styles.details}>
              {formation.chapter} • {formation.courses} COURS SUIVIS • {formation.quizzes} QUIZ RÉUSSIS
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1f2937',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderLeftWidth: 6,
  },
  theme: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    fontSize: 13,
    color: '#444',
  },
});
