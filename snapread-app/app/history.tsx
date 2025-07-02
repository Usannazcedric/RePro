import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { Fonts } from '../constants/Fonts';

// Import des icônes
import LoupeIcon from '../assets/images/loupe.svg';
import FiltresIcon from '../assets/images/filtres.svg';
import ArrowIcon from '../assets/images/arrow.svg';

interface QuizHistory {
  id: string;
  formation_title: string;
  formation_theme: string;
  chapter_title: string;
  quiz_title: string;
  score: number;
  total_questions: number;
  completed_at: string;
  formation_id: string;
  chapter_id: string;
  quiz_id: string;
}

export default function HistoryScreen() {
  const router = useRouter();
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchQuizHistory();
    }, [])
  );

  useEffect(() => {
    filterHistory();
  }, [quizHistory, searchQuery]);

  const fetchQuizHistory = async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Utilisateur non connecté');
        setQuizHistory([]);
        return;
      }

      // Récupérer l'historique des quiz complétés avec les détails des formations
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select(`
          *,
          formations!inner (
            id,
            title,
            theme,
            formation_data
          )
        `)
        .eq('user_id', user.id)
        .eq('type', 'quiz')
        .eq('completed', true)
        .order('completed_at', { ascending: false });

      if (progressError) {
        console.error('Erreur lors du chargement de l\'historique:', progressError);
        setQuizHistory([]);
        return;
      }

      // Transformer les données pour inclure les détails des quiz
      const formattedHistory: QuizHistory[] = [];
      
      for (const progress of (progressData || [])) {
        const formation = progress.formations;
        const chapters = formation?.formation_data?.iaResult?.chapters || formation?.formation_data?.chapters || [];
        
        // Trouver le chapitre et le quiz correspondants
        const chapter = chapters.find((ch: any) => String(ch.id) === String(progress.chapter_id));
        if (chapter) {
          const quiz = chapter.quizzes?.find((q: any) => String(q.id) === String(progress.quiz_id));
          if (quiz) {
            formattedHistory.push({
              id: progress.id,
              formation_title: formation.title,
              formation_theme: formation.theme,
              chapter_title: chapter.title,
              quiz_title: quiz.title,
              score: progress.score || 100,
              total_questions: 20, // Par défaut 20, on pourrait améliorer ça
              completed_at: progress.completed_at,
              formation_id: progress.formation_id,
              chapter_id: progress.chapter_id,
              quiz_id: progress.quiz_id,
            });
          }
        }
      }

      setQuizHistory(formattedHistory);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      setQuizHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const filterHistory = () => {
    if (!searchQuery.trim()) {
      setFilteredHistory(quizHistory);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = quizHistory.filter(item =>
      item.formation_title.toLowerCase().includes(query) ||
      item.chapter_title.toLowerCase().includes(query) ||
      item.quiz_title.toLowerCase().includes(query) ||
      item.formation_theme.toLowerCase().includes(query)
    );

    setFilteredHistory(filtered);
  };

  const getThemeBadge = (theme: string) => {
    // Simplifier le thème pour l'affichage
    if (theme.toLowerCase().includes('code') || theme.toLowerCase().includes('programmation') || theme.toLowerCase().includes('informatique')) {
      return 'Code';
    } else if (theme.toLowerCase().includes('design') || theme.toLowerCase().includes('art')) {
      return 'Design';
    } else if (theme.toLowerCase().includes('science') || theme.toLowerCase().includes('biologie') || theme.toLowerCase().includes('chimie') || theme.toLowerCase().includes('physique')) {
      return 'Science';
    } else if (theme.toLowerCase().includes('math')) {
      return 'Maths';
    }
    return 'Autre';
  };

  const formatChapterName = (chapterTitle: string, formationTitle: string) => {
    // Créer un format similaire à "DERNIER CHAPITRE - REACT NATIVE"
    const chapterNumber = chapterTitle.includes('1') ? '1e' : 
                         chapterTitle.includes('2') ? '2e' : 
                         'DERNIER';
    const formationShort = formationTitle.toUpperCase().split(' ')[0];
    return `${chapterNumber} CHAPITRE - ${formationShort}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Chargement de l'historique...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.topRow}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <ArrowIcon width={20} height={20} color="#7376FF" />
              </TouchableOpacity>
              <Text style={styles.backText}>Accueil</Text>
            </View>
            <Text style={styles.title}>Historique des Quiz</Text>
            <Text style={styles.description}>
              Tous les quiz auxquels vous avez participé au cours des 3 derniers mois.
            </Text>
          </View>

          {/* Search & Filter */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <LoupeIcon 
                width={20} 
                height={20} 
                color="#999"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Nom du sujet ou du chapitre..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <FiltresIcon 
                width={16} 
                height={16} 
                color="#6366F1"
                style={styles.filterIcon}
              />
              <Text style={styles.filterText}>Filtres</Text>
            </TouchableOpacity>
          </View>

          {/* Quiz list */}
          {filteredHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Aucun quiz trouvé' : 'Aucun quiz complété'}
              </Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? 'Essayez de modifier votre recherche' : 'Commencez une formation pour voir vos résultats ici'}
              </Text>
            </View>
          ) : (
            filteredHistory.map((item) => (
              <View key={item.id} style={styles.quizCard}>
                <View style={styles.quizHeader}>
                  <Text style={styles.quizBadge}>{getThemeBadge(item.formation_theme)}</Text>
                </View>
                <Text style={styles.quizSubject}>{item.formation_title}</Text>
                <Text style={styles.quizChapter}>{formatChapterName(item.chapter_title, item.formation_title)}</Text>
                <View style={styles.quizFooter}>
                  <Text style={styles.quizScore}>Quiz • {Math.round((item.score / 100) * item.total_questions)}/{item.total_questions}</Text>
                  <Text style={styles.successStatus}>RÉUSSI</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 12,
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: Fonts.extraBold,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 8,
    fontFamily: Fonts.extraBold,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    fontFamily: Fonts.regular,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontFamily: Fonts.regular,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
    fontFamily: Fonts.regular,
  },
  quizCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  quizHeader: {
    marginBottom: 12,
  },
  quizBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    fontFamily: Fonts.regular,
  },
  quizSubject: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#6366F1',
    fontFamily: Fonts.extraBold,
  },
  quizChapter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontWeight: '500',
    fontFamily: Fonts.regular,
  },
  quizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizScore: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    fontFamily: Fonts.regular,
  },
  successStatus: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 48,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Fonts.regular,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Fonts.regular,
  },
});
