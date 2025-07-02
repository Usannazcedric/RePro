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
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { supabase } from '../lib/supabase';
import { getFontFamily } from '../constants/Fonts';
import ArrowIcon from '../assets/images/arrow.svg';
import BottomNavbar from '../components/BottomNavbar';

interface Quiz {
  id: string;
  title: string;
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
}

interface Chapter {
  id: string;
  title: string;
  courses?: any[];
  quizzes?: Quiz[];
}

interface Formation {
  id: string;
  title: string;
  theme: string;
  formation_data?: {
    chapters?: Chapter[];
    iaResult?: {
      chapters?: Chapter[];
    };
  };
}

export default function QuizContentScreen() {
  const router = useRouter();
  const { formationId, chapterId, quizId, replayMode } = useLocalSearchParams();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [chapterTitle, setChapterTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestionIndex] = useState(0); // Pour l'instant, toujours 0 car 1 seul quiz
  const [submitting, setSubmitting] = useState(false);

  const isReplayMode = replayMode === 'true';

  useEffect(() => {
    fetchFormationAndQuiz();
  }, []);

  const fetchFormationAndQuiz = async () => {
    try {
      // Récupérer la formation
      const { data: formationData, error: formationError } = await supabase
        .from('formations')
        .select('*')
        .eq('id', formationId)
        .single();

      if (formationError) throw formationError;
      
      setFormation(formationData);

      // Trouver le quiz et le chapitre
      const chapters = formationData?.formation_data?.iaResult?.chapters || getDefaultChapters();
      
      let foundQuiz: Quiz | null = null;
      let foundChapterTitle = '';

      // Rechercher dans tous les chapitres
      for (const chapter of chapters) {
        // Convertir les deux en string pour la comparaison
        if (String(chapter.id) === String(chapterId)) {
          foundChapterTitle = chapter.title;
          
          // Rechercher le quiz
          foundQuiz = chapter.quizzes?.find((q: any) => String(q.id) === String(quizId)) || null;
          break;
        }
      }

      // Si pas trouvé, utiliser les données par défaut
      if (!foundQuiz) {
        const defaultChapters = getDefaultChapters();
        for (const chapter of defaultChapters) {
          if (String(chapter.id) === String(chapterId)) {
            foundChapterTitle = chapter.title;
            foundQuiz = chapter.quizzes?.find(q => String(q.id) === String(quizId)) || null;
            break;
          }
        }
      }

      setQuiz(foundQuiz);
      setChapterTitle(foundChapterTitle);

    } catch (error) {
      console.error('❌ Erreur lors du chargement du quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultChapters = (): Chapter[] => {
    return [
      {
        id: '1',
        title: 'Chapitre 1',
        courses: [],
        quizzes: [
          { 
            id: '1', 
            title: 'Test - Chapitre 1', 
            question: 'Complète la phrase\n\nPython est un langage ________.', 
            options: { 
              a: 'interprété', 
              b: 'compilé', 
              c: 'intermédiaire',
              d: 'interprété et compilé',
              e: 'Aucune de ces réponses'
            }, 
            correctAnswer: 'a' 
          }
        ]
      },
      {
        id: '2',
        title: 'Chapitre 2',
        courses: [],
        quizzes: [
          { 
            id: '2', 
            title: 'Test - Chapitre 2', 
            question: 'Quelle est la syntaxe correcte pour un commentaire en Python?', 
            options: { 
              a: '//', 
              b: '/*', 
              c: '#',
              d: '--',
              e: 'Aucune de ces réponses'
            }, 
            correctAnswer: 'c' 
          }
        ]
      }
    ];
  };

  const handleAnswerSelect = (optionKey: string) => {
    setSelectedAnswer(optionKey);
  };

  const handleValidate = async () => {
    if (!selectedAnswer || !quiz || submitting) return;
    
    setSubmitting(true);
    
    try {
      const isCorrect = selectedAnswer === quiz.correctAnswer;
      
      if (isCorrect) {
        // Sauvegarder la progression seulement si ce n'est pas en mode replay
        if (!isReplayMode) {
          await saveQuizProgress();
        }
        
        // Quiz réussi, retour à la formation
        Alert.alert(
          'Bien joué !', 
          isReplayMode ? 'Bonne réponse ! (Mode replay)' : 'Bonne réponse !', 
          [
            {
              text: 'OK',
              onPress: () => {
                router.back();
              }
            }
          ]
        );
      } else {
        // Afficher l'alerte d'échec
        Alert.alert(
          'Mauvaise réponse', 
          isReplayMode ? 'Réessayez ! (Mode replay)' : 'Réessayez ! Vous pouvez reprendre le quiz.',
          [
            {
              text: 'Réessayer',
              onPress: () => {
                setSelectedAnswer(null); // Reset la sélection
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la validation.');
    } finally {
      setSubmitting(false);
    }
  };

  const saveQuizProgress = async () => {
    try {
      // Vérifier si l'utilisateur est connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Utilisateur non connecté');
      }

      // Sauvegarder la progression du quiz
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert([
          {
            user_id: user.id,
            formation_id: formationId,
            chapter_id: chapterId,
            quiz_id: quizId,
            type: 'quiz',
            completed: true,
            score: 100, // 100% car bonne réponse
          }
        ], {
          onConflict: 'user_id,formation_id,chapter_id,course_id,quiz_id,type'
        });

      if (progressError) {
        console.error('Erreur lors de la sauvegarde:', progressError);
        setSubmitting(false);
        return;
      }

      
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la progression:', error);
      throw error;
    }
  };

  const getProgressPercentage = () => {
    // Au lieu d'afficher 1/1, on peut montrer un pourcentage basé sur la question actuelle
    // Par exemple : 100% quand on a répondu, 10% quand on commence
    return selectedAnswer ? 100 : 10;
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7376FF" />
            <Text style={styles.loadingText}>Chargement du quiz...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (!formation || !quiz) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Quiz non trouvé</Text>
            <TouchableOpacity onPress={() => router.back()} style={styles.errorButton}>
              <Text style={styles.errorButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowIcon width={20} height={20} color="#7376FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{formation.title}</Text>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.formationTitle}>{formation.title}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            {isReplayMode && (
              <View style={styles.replayBadge}>
                <Text style={styles.replayBadgeText}>REPLAY</Text>
              </View>
            )}
          </View>
          
          {/* Barre de progression */}
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>{getProgressPercentage()}%</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${getProgressPercentage()}%` }]} />
            </View>
          </View>

          {/* Question */}
          <View style={styles.questionSection}>
            <Text style={styles.questionLabel}>Questions {currentQuestionIndex + 1} :</Text>
            <Text style={styles.questionText}>{quiz.question}</Text>
          </View>

          {/* Options de réponse */}
          <View style={styles.optionsSection}>
            {Object.entries(quiz.options).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.optionButton,
                  selectedAnswer === key && styles.selectedOption
                ]}
                onPress={() => handleAnswerSelect(key)}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswer === key && styles.selectedOptionText
                ]}>
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bouton Valider */}
        <View style={styles.validateSection}>
          <TouchableOpacity
            style={[
              styles.validateButton,
              (!selectedAnswer || submitting) && styles.validateButtonDisabled
            ]}
            onPress={handleValidate}
            disabled={!selectedAnswer || submitting}
          >
            <Text style={[
              styles.validateButtonText,
              (!selectedAnswer || submitting) && styles.validateButtonTextDisabled
            ]}>
              {submitting ? 'Validation...' : 'Valider'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Navbar globale */}
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
    fontFamily: getFontFamily('semiBold'),
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 200, // Espace pour le bouton valider et la navbar
  },
  formationTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7376FF',
    marginBottom: 8,
    fontFamily: getFontFamily('bold'),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  quizTitle: {
    fontSize: 20,
    color: '#7376FF',
    fontFamily: getFontFamily('regular'),
    flex: 1,
  },
  replayBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  replayBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: getFontFamily('bold'),
  },
  progressSection: {
    marginBottom: 32,
  },
  progressText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
    textAlign: 'right',
    fontFamily: getFontFamily('medium'),
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#7376FF',
    borderRadius: 4,
  },
  questionSection: {
    marginBottom: 32,
  },
  questionLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
    fontFamily: getFontFamily('medium'),
  },
  questionText: {
    fontSize: 20,
    color: '#1F2937',
    lineHeight: 28,
    fontFamily: getFontFamily('semiBold'),
  },
  optionsSection: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#E5E7EB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#DDD6FE',
    borderColor: '#7376FF',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontFamily: getFontFamily('medium'),
  },
  selectedOptionText: {
    color: '#7376FF',
    fontWeight: '600',
  },
  validateSection: {
    position: 'absolute',
    bottom: 120, // Au-dessus de la navbar
    left: 24,
    right: 24,
  },
  validateButton: {
    backgroundColor: '#7376FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  validateButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  validateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: getFontFamily('bold'),
  },
  validateButtonTextDisabled: {
    color: '#E5E7EB',
  },
}); 