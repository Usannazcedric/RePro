import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack, useFocusEffect } from 'expo-router';
import { supabase } from '../lib/supabase';
import { getFontFamily } from '../constants/Fonts';
import ArrowIcon from '../assets/images/arrow.svg';
import FlecheIcon from '../assets/images/fleche.svg';
import CheckVertIcon from '../assets/images/checkvert.svg';
import LockIcon from '../assets/images/lockgood.svg';
import TrophyWhiteIcon from '../assets/images/trophywhite.svg';
import BottomNavbar from '../components/BottomNavbar';

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
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [authorInfo, setAuthorInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'formation' | 'statistics'>('formation');

  useEffect(() => {
    fetchFormation();
  }, []);

  // Rafraîchir la progression quand on revient sur la page
  useFocusEffect(
    React.useCallback(() => {
      fetchUserProgress();
    }, [])
  );

  const fetchFormation = async () => {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setFormation(data);

      // Récupérer les informations de l'auteur
      if (data.user_id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', data.user_id)
          .single();

        if (!profileError && profileData) {
          setAuthorInfo(profileData);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la formation:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return;
      }

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('formation_id', id);

      if (error) {
        console.error('Erreur lors du chargement de la progression:', error);
        return;
      }

      setUserProgress(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement de la progression:', error);
    }
  };

  // Vérifier si un élément est complété
  const isCompleted = (chapterId: string, itemId: string, type: 'course' | 'quiz') => {
    return userProgress.some(progress => 
      String(progress.chapter_id) === String(chapterId) &&
      (type === 'course' ? String(progress.course_id) === String(itemId) : String(progress.quiz_id) === String(itemId)) &&
      progress.type === type &&
      progress.completed === true
    );
  };

  // Vérifier si tous les cours d'un chapitre sont complétés
  const areAllCoursesCompleted = (chapterId: string, courses: any[]) => {
    return courses.every(course => isCompleted(chapterId, course.id, 'course'));
  };

  // Vérifier si le chapitre précédent est complété
  const isPreviousChapterCompleted = (currentChapterIndex: number, chapters: any[]) => {
    if (currentChapterIndex === 0) return true; // Premier chapitre toujours accessible
    
    const previousChapter = chapters[currentChapterIndex - 1];
    const previousCoursesCompleted = areAllCoursesCompleted(previousChapter.id, previousChapter.courses || []);
    const previousQuizCompleted = (previousChapter.quizzes || []).every((quiz: any) => 
      isCompleted(previousChapter.id, quiz.id, 'quiz')
    );
    
    return previousCoursesCompleted && previousQuizCompleted;
  };

  // Vérifier si toute la formation est complétée
  const isFormationCompleted = (chapters: any[]) => {
    return chapters.every(chapter => {
      const coursesCompleted = areAllCoursesCompleted(chapter.id, chapter.courses || []);
      const quizzesCompleted = (chapter.quizzes || []).every((quiz: any) => 
        isCompleted(chapter.id, quiz.id, 'quiz')
      );
      return coursesCompleted && quizzesCompleted;
    });
  };

  // Gérer le clic sur un cours
  const handleCourseClick = (course: any, chapter: any, chapterIndex: number, chapters: any[]) => {
    // Vérifier si le chapitre précédent est complété
    if (!isPreviousChapterCompleted(chapterIndex, chapters)) {
      Alert.alert(
        'Chapitre verrouillé', 
        'Vous devez compléter le chapitre précédent avant d\'accéder à celui-ci.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Navigation normale
    router.push({
      pathname: '/course-content',
      params: {
        formationId: id,
        chapterId: chapter.id,
        courseId: course.id
      }
    } as any);
  };

  // Gérer le clic sur un quiz
  const handleQuizClick = (quiz: any, chapter: any, chapterIndex: number, chapters: any[]) => {
    // Vérifier si le chapitre précédent est complété
    if (!isPreviousChapterCompleted(chapterIndex, chapters)) {
      Alert.alert(
        'Chapitre verrouillé', 
        'Vous devez compléter le chapitre précédent avant d\'accéder à celui-ci.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Vérifier si tous les cours du chapitre actuel sont complétés
    if (!areAllCoursesCompleted(chapter.id, chapter.courses || [])) {
      Alert.alert(
        'Cours requis', 
        'Vous devez lire tous les cours de ce chapitre avant de passer au quiz.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Navigation normale
    router.push({
      pathname: '/quiz-content',
      params: {
        formationId: id,
        chapterId: chapter.id,
        quizId: quiz.id
      }
    } as any);
  };

  // Calculer les statistiques
  const calculateStatistics = () => {
    const chapters = getChapters();
    
    // Compter le total d'éléments (cours + quiz)
    let totalItems = 0;
    let completedItems = 0;
    
    chapters.forEach(chapter => {
      const courses = chapter.courses || [];
      const quizzes = chapter.quizzes || [];
      
      totalItems += courses.length + quizzes.length;
      
      // Compter les éléments complétés
      courses.forEach(course => {
        if (isCompleted(chapter.id, course.id, 'course')) {
          completedItems++;
        }
      });
      
      quizzes.forEach(quiz => {
        if (isCompleted(chapter.id, quiz.id, 'quiz')) {
          completedItems++;
        }
      });
    });
    
    const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    
    return {
      precision: 90, // Fake comme demandé
      completion: completionPercentage,
      winLossRatio: 75, // Fake comme demandé
      bestTest: {
        title: 'Chapitre Test - 1',
        score: '09/10',
        status: 'RÉUSSI',
        date: '25/04/2025'
      },
      learningTime: '5:22min',
      coursesCount: 4
    };
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
          <Text style={styles.mainTitle}>{formation?.title || 'Formation'}</Text>
          <Text style={styles.subtitle}>
            Par {authorInfo?.username || authorInfo?.full_name || 'Auteur inconnu'}
          </Text>

          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'formation' && styles.activeTab]}
              onPress={() => setActiveTab('formation')}
            >
              <Text style={[styles.tabText, activeTab === 'formation' && styles.activeTabText]}>Formation</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'statistics' && styles.activeTab]}
              onPress={() => setActiveTab('statistics')}
            >
              <Text style={[styles.tabText, activeTab === 'statistics' && styles.activeTabText]}>Statistiques</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'formation' ? (
            chapters.map((chapter, chapterIndex) => {
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
                      <TouchableOpacity 
                        style={styles.courseButton} 
                        onPress={() => handleCourseClick(course, chapter, chapterIndex, chapters)}
                      >
                        {isCompleted(chapter.id, course.id, 'course') ? (
                          <CheckVertIcon 
                            width={30} 
                            height={30} 
                            color="#10B981" 
                            style={{ marginTop: 5 }}
                          />
                        ) : !isPreviousChapterCompleted(chapterIndex, chapters) ? (
                          <LockIcon 
                            width={30} 
                            height={30} 
                            color="#9CA3AF" 
                            style={{ marginTop: 5 }}
                          />
                        ) : (
                          <FlecheIcon 
                            width={150} 
                            height={150} 
                            color="#374151" 
                            style={{ marginTop: 55 }}
                          />
                        )}
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
                        <TouchableOpacity 
                          style={styles.quizButton} 
                          onPress={() => handleQuizClick(quiz, chapter, chapterIndex, chapters)}
                        >
                          {isCompleted(chapter.id, quiz.id, 'quiz') ? (
                            <CheckVertIcon 
                              width={30} 
                              height={30} 
                              color="#10B981" 
                              style={{ marginTop: 5 }}
                            />
                          ) : !isPreviousChapterCompleted(chapterIndex, chapters) || !areAllCoursesCompleted(chapter.id, chapter.courses || []) ? (
                            <LockIcon 
                              width={30} 
                              height={30} 
                              color="#9CA3AF" 
                              style={{ marginTop: 5 }}
                            />
                          ) : (
                            <FlecheIcon 
                              width={150} 
                              height={150} 
                              color="#374151" 
                              style={{ marginTop: 55 }}
                            />
                          )}
                        </TouchableOpacity>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })
          ) : (
            // Contenu des statistiques
            (() => {
              const stats = calculateStatistics();
              return (
                <View style={styles.statisticsContainer}>
                  {/* Cartes de statistiques principales */}
                  <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                      <View style={styles.circularProgress}>
                        <Text style={styles.percentageText}>{stats.precision}%</Text>
                      </View>
                      <Text style={styles.statLabel}>Précision</Text>
                    </View>
                    
                    <View style={styles.statCard}>
                      <View style={styles.circularProgress}>
                        <Text style={styles.percentageText}>{stats.completion}%</Text>
                      </View>
                      <Text style={styles.statLabel}>Completion</Text>
                    </View>
                    
                    <View style={styles.statCard}>
                      <View style={styles.circularProgress}>
                        <Text style={styles.percentageText}>{stats.winLossRatio}%</Text>
                      </View>
                      <Text style={styles.statLabel}>W/L ratio</Text>
                    </View>
                  </View>

                  {/* Meilleur Test */}
                  <View style={styles.bestTestCard}>
                    <Text style={styles.bestTestTitle}>Meilleur Test</Text>
                    <Text style={styles.bestTestSubtitle}>Meilleur score obtenu sur les quiz</Text>
                    <Text style={styles.bestTestName}>{stats.bestTest.title}</Text>
                    <Text style={styles.bestTestScore}>{stats.bestTest.score} • {stats.bestTest.status}</Text>
                    <Text style={styles.bestTestDate}>Réalisé le {stats.bestTest.date}</Text>
                  </View>

                  {/* Temps d'apprentissage */}
                  <View style={styles.learningTimeCard}>
                    <Text style={styles.learningTimeTitle}>Temps d&apos;apprentissage</Text>
                    <Text style={styles.learningTimeSubtitle}>Moyenne de temps passé par cours</Text>
                    <Text style={styles.learningTimeValue}>{stats.learningTime}</Text>
                    <Text style={styles.learningTimeDetail}>({stats.coursesCount} Cours)</Text>
                  </View>
                </View>
              );
            })()
          )}

          {activeTab === 'formation' && (
            <View style={styles.certificateSection}>
              <TouchableOpacity 
                style={[
                  styles.certificateButton,
                  { opacity: isFormationCompleted(chapters) ? 1 : 0.5 }
                ]}
                disabled={!isFormationCompleted(chapters)}
                onPress={() => {
                  if (isFormationCompleted(chapters)) {
                    router.push({
                      pathname: '/certificate-result',
                      params: {
                        formationId: id,
                        formationTitle: formation?.title || 'Formation'
                      }
                    } as any);
                  }
                }}
              >
                <View style={styles.certificateButtonContent}>
                  <TrophyWhiteIcon 
                    width={24} 
                    height={24} 
                    color="#FFFFFF"
                    style={styles.trophyIcon}
                  />
                  <Text style={styles.certificateButtonText}>
                    Obtenir mon certificat
                  </Text>
                </View>
                {!isFormationCompleted(chapters) && (
                  <Text style={styles.certificateSubtext}>
                    Complétez tous les chapitres pour débloquer
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
        
        <BottomNavbar />
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
  certificateSection: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  
  certificateButton: {
    backgroundColor: '#7376FF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  certificateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyIcon: {
    marginRight: 8,
  },
  certificateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: getFontFamily('bold'),
  },
  certificateSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    fontFamily: getFontFamily('regular'),
  },
  bottomSpacer: {
    height: 80,
  },
  
  // Styles pour les statistiques
  statisticsContainer: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  circularProgress: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 6,
    borderColor: '#7376FF',
    borderStyle: 'solid',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: getFontFamily('bold'),
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    fontFamily: getFontFamily('medium'),
  },
  bestTestCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bestTestTitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 4,
    fontFamily: getFontFamily('medium'),
  },
  bestTestSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
    fontFamily: getFontFamily('regular'),
  },
  bestTestName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    fontFamily: getFontFamily('bold'),
  },
  bestTestScore: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 8,
    fontFamily: getFontFamily('medium'),
  },
  bestTestDate: {
    fontSize: 14,
    color: '#10b981',
    fontFamily: getFontFamily('regular'),
  },
  learningTimeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  learningTimeTitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
    fontFamily: getFontFamily('medium'),
  },
  learningTimeSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
    fontFamily: getFontFamily('regular'),
  },
  learningTimeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
    fontFamily: getFontFamily('bold'),
  },
  learningTimeDetail: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: getFontFamily('regular'),
  },
});