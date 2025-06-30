import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const router = useRouter();

  const quizzes = [
    {
      subject: 'React Native',
      chapter: 'DERNIER CHAPITRE – REACT NATIVE',
      score: '19/20',
    },
    {
      subject: 'Introduction à C++',
      chapter: '1e CHAPITRE – C++',
      score: '20/20',
    },
    {
      subject: 'Fondamentaux de React Native',
      chapter: '2e CHAPITRE – REACT NATIVE',
      score: '19/20',
    },
    {
      subject: 'Maîtriser Vue.js',
      chapter: 'DERNIER CHAPITRE – VUE.JS',
      score: '19/20',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.back}>{'<'} Accueil</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Historique des Quiz</Text>
          <Text style={styles.description}>
            Tous les quiz auxquels vous avez participé au cours des 3 derniers mois.
          </Text>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.search}
            placeholder="Nom du sujet ou du chapitre..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterText}>🎛️ Filtres</Text>
          </TouchableOpacity>
        </View>

        {/* Quiz list */}
        {quizzes.map((quiz, index) => (
          <View key={index} style={styles.quizCard}>
            <Text style={styles.quizType}> Code</Text>
            <Text style={styles.quizSubject}>{quiz.subject}</Text>
            <Text style={styles.quizChapter}>{quiz.chapter}</Text>
            <View style={styles.quizFooter}>
              <Text style={styles.quizScore}>Quiz · {quiz.score}</Text>
              <Text style={styles.quizStatus}>RÉUSSI</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  header: { marginTop: 20, marginBottom: 20 },
  back: { fontSize: 16, color: '#0B3C83', marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0B3C83' },
  description: { color: '#444', marginTop: 4 },
  searchRow: { flexDirection: 'row', marginTop: 16, gap: 12 },
  search: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
  },
  filterBtn: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  filterText: {
    fontSize: 14,
    color: '#0B3C83',
  },
  quizCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  quizType: {
    fontSize: 12,
    color: '#0B3C83',
    fontWeight: '600',
    marginBottom: 4,
  },
  quizSubject: {
    fontSize: 18,
    color: '#0B3C83',
    fontWeight: '700',
    marginBottom: 2,
  },
  quizChapter: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  quizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quizScore: {
    fontSize: 13,
    color: '#333',
  },
  quizStatus: {
    fontSize: 13,
    color: 'green',
    fontWeight: '600',
  },
});
