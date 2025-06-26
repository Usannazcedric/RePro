import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BagIcon from '../../components/BagIcon';
import { getFontFamily } from '../../constants/Fonts';
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
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Mes Formations</Text>
          <TouchableOpacity 
            style={styles.boutiqueButton}
            onPress={() => router.push('/boutique')}
          >
            <BagIcon width={16} height={18} color="#7376FF" />
            <Text style={styles.boutiqueText}>Boutique</Text>
          </TouchableOpacity>
        </View>

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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: getFontFamily('bold'),
  },
  boutiqueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  boutiqueText: {
    color: '#7376FF',
    fontWeight: '600',
    fontSize: 16,
    fontFamily: getFontFamily('semiBold'),
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
    fontFamily: getFontFamily('semiBold'),
  },
  status: {
    fontSize: 12,
    color: '#888',
    marginBottom: 6,
    fontFamily: getFontFamily('regular'),
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: getFontFamily('bold'),
  },
  details: {
    fontSize: 13,
    color: '#444',
    fontFamily: getFontFamily('regular'),
  },
});
