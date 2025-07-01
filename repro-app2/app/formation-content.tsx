import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { supabase } from '../lib/supabase';
import { getFontFamily } from '../constants/Fonts';
import ArrowIcon from '../assets/images/arrow.svg';
import FlecheIcon from '../assets/images/fleche.svg';
import CustomTabBar from '../components/CustomTabBar';

interface Chapter {
  id: string;
  title: string;
  courses?: Array<{
    id: string;
    title: string;
    content: string;
    duration: string;
  }>;
  quizzes?: Array<{
    id: string;
    title: string;
    question: string;
    options: Record<string, string>;
    correctAnswer: string;
  }>;
}

interface Formation {
  id: string;
  title: string;
  subtitle?: string;
  theme: string;
  formation_data?: {
    chapters?: Chapter[];
    iaResult?: {
      chapters?: Chapter[];
    };
  };
}

export default function FormationContentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormation();
  }, []);

  const fetchFormation = async () => {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setFormation(data);
    } catch (error) {
      console.error('Erreur lors du chargement de la formation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChapters = (): Chapter[] => {
    if (formation?.formation_data?.iaResult?.chapters) {
      return formation.formation_data.iaResult.chapters;
    }
    return [
      {
        id: '1',
        title: 'Chapitre 1',
        courses: [
          { id: '1', title: 'Introduction à Python', content: 'Introduction to Python', duration: '3:25' },
          { id: '2', title: 'Son histoire', content: 'The History of Python', duration: '4:25' },
          { id: '3', title: 'Pourquoi utiliser Python ?', content: 'Why Use Python?', duration: '4:25' },
        ],
        quizzes: [
          { id: '1', title: 'Test - Chapitre 1', question: 'What is Python?', options: { a: 'A snake', b: 'A programming language', c: 'A fruit' }, correctAnswer: 'b' }
        ]
      },
      {
        id: '2',
        title: 'Chapitre 2',
        courses: [
          { id: '4', title: 'Comment utiliser Python', content: 'How to Use Python', duration: '7:25' },
          { id: '5', title: 'Les astuces', content: 'Python Tips', duration: '5:00' },
          { id: '6', title: "Comment s'améliorer", content: 'How to Improve', duration: '4:25' },
        ],
        quizzes: [
          { id: '2', title: 'Test - Chapitre 2', question: 'What is the correct syntax for a comment in Python?', options: { a: '//', b: '/*', c: '#' }, correctAnswer: 'c' }
        ]
      }
    ];
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7376FF" />
            <Text style={styles.loadingText}>Chargement de la formation...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (!formation) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Formation non trouvée</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
              <Text style={styles.errorButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const chapters = getChapters();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowIcon width={20} height={20} color="#7376FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes formations</Text>
        </View>

        <ScrollView style={styles.container}>
          <Text style={styles.mainTitle}>Python</Text>
          <Text style={styles.subtitle}>Introduction à la programmation</Text>

          <View style={styles.tabsContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Formation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Statistiques</Text>
            </TouchableOpacity>
          </View>

          {chapters.map((chapter, chapterIndex) => {
            const getRomanNumeral = (num: number) => {
              const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
              return romanNumerals[num - 1] || num.toString();
            };

            let itemCounter = chapterIndex === 0
              ? 1
              : chapters
                  .slice(0, chapterIndex)
                  .reduce((acc, ch) => acc + (ch.courses?.length || 0) + (ch.quizzes?.length || 0), 1);

            return (
              <View key={chapter.id} style={styles.chapterSection}>
                <Text style={styles.chapterTitle}>
                  {getRomanNumeral(chapterIndex + 1)}. {chapter.title}
                </Text>

                {chapter.courses?.map((course, courseIndex) => (
                  <TouchableOpacity key={course.id} style={styles.courseItem}>
                    <View style={styles.contentLeft}>
                      <Text style={styles.contentNumber}>{itemCounter + courseIndex}</Text>
                      <View style={styles.contentInfo}>
                        <Text style={styles.contentTitle}>{course.title}</Text>
                        <Text style={styles.courseMeta}>Cours • {course.duration}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.courseButton} onPress={() => {/* navigation */}}>
                      <FlecheIcon 
                        width={150} 
                        height={150} 
                        color="#374151" 
                        style={{ marginTop: 55 }}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}

                {chapter.quizzes?.map((quiz, quizIndex) => {
                  const quizNumber = itemCounter + (chapter.courses?.length || 0) + quizIndex;
                  return (
                    <TouchableOpacity key={quiz.id} style={styles.quizItem}>
                      <View style={styles.contentLeft}>
                        <Text style={styles.contentNumber}>{quizNumber}</Text>
                        <View style={styles.contentInfo}>
                          <Text style={styles.contentTitle}>{quiz.title}</Text>
                          <Text style={styles.quizMeta}>Quiz • {quiz.question}</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.quizButton} onPress={() => {/* navigation */}}>
                        <FlecheIcon 
                          width={150} 
                          height={150} 
                          color="#374151" 
                          style={{ marginTop: 55 }}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
        <CustomTabBar />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fb',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#374151',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorButton: {
    backgroundColor: '#7376FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#f8f9fb',
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
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: getFontFamily('semiBold'),
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7376FF',
    marginBottom: 8,
    fontFamily: getFontFamily('bold'),
  },
  subtitle: {
    fontSize: 20,
    color: '#7376FF',
    marginBottom: 24,
    fontFamily: getFontFamily('regular'),
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#7376FF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    fontFamily: getFontFamily('semiBold'),
  },
  activeTabText: {
    color: 'white',
  },
  chapterSection: {
    marginBottom: 32,
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    fontFamily: getFontFamily('bold'),
  },
  contentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contentNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9ca3af',
    width: 24,
    marginRight: 16,
    fontFamily: getFontFamily('bold'),
  },
  contentInfo: {
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: getFontFamily('semiBold'),
  },
  courseMeta: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: getFontFamily('regular'),
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quizItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quizMeta: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: getFontFamily('regular'),
  },
  courseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});