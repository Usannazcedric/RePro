import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import BagIcon from '../../components/BagIcon';
import { getFontFamily } from '../../constants/Fonts';
import { supabase } from '../../lib/supabase';

// Progress SVG imports
import FlagColoredIcon from '../../assets/images/flag-colored.svg';
import ProgressBarGreyIcon from '../../assets/images/progressbar grey.svg';
import ProgressBarMidIcon from '../../assets/images/progressbar mid.svg';
import ProgressBarColoredIcon from '../../assets/images/progressbarcolored.svg';
import Chapter1GreyIcon from '../../assets/images/1 grey.svg';
import Chapter1ColoredIcon from '../../assets/images/1 colored.svg';
import Chapter2GreyIcon from '../../assets/images/2 grey.svg';
import Chapter2ColoredIcon from '../../assets/images/2 colored.svg';
import Chapter3GreyIcon from '../../assets/images/3 grey.svg';
import Chapter3ColoredIcon from '../../assets/images/3 colored.svg';
import TrophyGreyIcon from '../../assets/images/trophy grey.svg';
import TrophyColoredIcon from '../../assets/images/trophy colored.svg';

interface PurchasedFormation {
  id: string;
  formation_id: string;
  purchased_at: string;
  formations: {
    id: string;
    title: string;
    theme: string;
    description: string;
    quiz_count: number;
    chapter_count: number;
    formation_data?: {
      chapters?: Array<{
        quizzes?: any[];
        courses?: any[];
      }>;
    };
  } | null;
}

interface UserProgress {
  formation_id: string;
  chapter_id: string;
  course_id?: string;
  quiz_id?: string;
  type: 'course' | 'quiz';
  completed: boolean;
  score?: number;
}

interface FormationProgress {
  [key: string]: { // formation_id
    [key: string]: { // chapter_id
      courseCompleted: boolean;
      quizCompleted: boolean;
    };
  };
}

// Composant pour afficher la progression d'une formation
interface ProgressBarProps {
  formation: PurchasedFormation['formations'];
  progress: FormationProgress[string];
}

const FormationProgressBar: React.FC<ProgressBarProps> = ({ formation, progress }) => {
  if (!formation) return null;
  
  // 🎯 DONNÉES SIMULÉES pour tester les états visuels
  // Une fois que l'affichage est correct, on utilisera les vraies données de `progress`
  console.log('📊 Progress data received:', progress);
  const getSimulatedProgress = () => {
    const formationTitle = formation.title?.toLowerCase() || '';
    
    if (formationTitle.includes('biologie')) {
      // Formation Biologie: Chapitre 1 cours fait (barre orange), quiz pas fait (numéro gris)
      return [
        { courseCompleted: true, quizCompleted: false },   // Chapitre 1: barre orange, numéro gris
        { courseCompleted: false, quizCompleted: false },  // Chapitre 2: barre grise, numéro gris
        { courseCompleted: false, quizCompleted: false }   // Chapitre 3: barre grise, numéro gris
      ];
    } else if (formationTitle.includes('marketing') || formationTitle.includes('elevator')) {
      // Formation Marketing: Ch1 complet (barre verte, numéro coloré), Ch2 cours fait (barre orange, numéro gris)  
      return [
        { courseCompleted: true, quizCompleted: true },    // Chapitre 1: barre verte, numéro coloré
        { courseCompleted: true, quizCompleted: false },   // Chapitre 2: barre orange, numéro gris
        { courseCompleted: false, quizCompleted: false }   // Chapitre 3: barre grise, numéro gris
      ];
    } else {
      // Autres formations: rien de commencé
      return [
        { courseCompleted: false, quizCompleted: false },  // Tout gris
        { courseCompleted: false, quizCompleted: false },
        { courseCompleted: false, quizCompleted: false }
      ];
    }
  };
  
  const simulatedProgress = getSimulatedProgress();

  const getChapterIcon = (chapterNumber: number, isCompleted: boolean) => {
    const iconProps = { width: 16, height: 16 };
    
    switch (chapterNumber) {
      case 1:
        return isCompleted ? <Chapter1ColoredIcon {...iconProps} /> : <Chapter1GreyIcon {...iconProps} />;
      case 2:
        return isCompleted ? <Chapter2ColoredIcon {...iconProps} /> : <Chapter2GreyIcon {...iconProps} />;
      case 3:
        return isCompleted ? <Chapter3ColoredIcon {...iconProps} /> : <Chapter3GreyIcon {...iconProps} />;
      default:
        return <Chapter1GreyIcon {...iconProps} />;
    }
  };

  const getProgressBarIcon = (chapterIndex: number) => {
    const chapterProgress = simulatedProgress[chapterIndex];
    const iconProps = { width: 30, height: 10 };
    
    if (!chapterProgress) {
      return <ProgressBarGreyIcon {...iconProps} />;
    }
    
    if (chapterProgress.courseCompleted && chapterProgress.quizCompleted) {
      return <ProgressBarColoredIcon {...iconProps} />;
    } else if (chapterProgress.courseCompleted) {
      return <ProgressBarMidIcon {...iconProps} />;
    }
    
    return <ProgressBarGreyIcon {...iconProps} />;
  };

  const isChapterCompleted = (chapterIndex: number) => {
    const chapterProgress = simulatedProgress[chapterIndex];
    return chapterProgress && chapterProgress.courseCompleted && chapterProgress.quizCompleted;
  };



  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressRow}>
        {/* Drapeau de départ - toujours coloré */}
        <FlagColoredIcon width={12} height={12} />
        
        {/* Barre 1 */}
        {getProgressBarIcon(0)}
        
        {/* Chapitre 1 */}
        {getChapterIcon(1, isChapterCompleted(0))}
        
        {/* Barre 2 */}
        {getProgressBarIcon(1)}
        
        {/* Chapitre 2 */}
        {getChapterIcon(2, isChapterCompleted(1))}
        
        {/* Barre 3 */}
        {getProgressBarIcon(2)}
        
        {/* Chapitre 3 */}
        {getChapterIcon(3, isChapterCompleted(2))}
        
        {/* Barre finale */}
        <ProgressBarGreyIcon width={30} height={10} />
        
        {/* Trophée - toujours gris pour l'instant (certificat pas encore implémenté) */}
        <TrophyGreyIcon width={12} height={12} />
      </View>
    </View>
  );
};

export default function TabTwoScreen() {
  const router = useRouter();
  const [formations, setFormations] = useState<PurchasedFormation[]>([]);
  const [formationProgress, setFormationProgress] = useState<FormationProgress>({});
  const [loading, setLoading] = useState(true);

  const fetchPurchasedFormations = async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Utilisateur non connecté');
        setFormations([]);
        return;
      }

      const { data, error } = await supabase
        .from('purchased_formations')
        .select(`
          id,
          formation_id,
          purchased_at,
          formations (
            id,
            title,
            theme,
            description,
            quiz_count,
            chapter_count,
            formation_data
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('purchased_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des formations:', error);
        setFormations([]);
        return;
      }

      setFormations((data as any) || []);
      
      // Récupérer la progression pour ces formations
      if (data && data.length > 0) {
        await fetchUserProgress(user.id, data.map(f => f.formation_id));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
      setFormations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async (userId: string, formationIds: string[]) => {
    try {
      console.log('🔍 Fetching progress for user:', userId);
      console.log('🔍 Formation IDs:', formationIds);
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .in('formation_id', formationIds);

      if (error) {
        console.error('❌ Erreur lors du chargement de la progression:', error);
        return;
      }

      console.log('📊 Raw progress data:', data);

      // Organiser les données de progression par formation et chapitre
      const progressMap: FormationProgress = {};
      
      (data as UserProgress[] || []).forEach(progress => {
        console.log('📝 Processing progress:', progress);
        
        if (!progressMap[progress.formation_id]) {
          progressMap[progress.formation_id] = {};
        }
        
        if (!progressMap[progress.formation_id][progress.chapter_id]) {
          progressMap[progress.formation_id][progress.chapter_id] = {
            courseCompleted: false,
            quizCompleted: false
          };
        }
        
        if (progress.type === 'course' && progress.completed) {
          progressMap[progress.formation_id][progress.chapter_id].courseCompleted = true;
        } else if (progress.type === 'quiz' && progress.completed) {
          progressMap[progress.formation_id][progress.chapter_id].quizCompleted = true;
        }
      });
      
      console.log('🗺️ Final progress map:', progressMap);
      setFormationProgress(progressMap);
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la progression:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPurchasedFormations();
    }, [])
  );

  const getThemeColor = (theme: string) => {
    const colors: Record<string, string> = {
      'Code': '#3B5BA5',
      'Design': '#DA8023',
      'Science': '#2D6F65',
      'Biologie': '#8B4513',
      'Chimie': '#FF6B35',
      'Physique': '#6A5ACD',
      'Mathématiques': '#DC143C',
      'Informatique': '#20B2AA',
      'Programmation': '#3B5BA5',
      'Placement avancé (AP)': '#8B4513',
      'Arts et design': '#DA8023',
    };
    return colors[theme] || '#7376FF';
  };

  const getFormationProgress = (formation: PurchasedFormation) => {
    if (!formation.formations) return { currentChapter: 1, totalChapters: 1, coursesFollowed: 0, quizzesCompleted: 0 };
    
    const chapterCount = formation.formations.chapter_count || 1;
    const currentChapter = Math.floor(Math.random() * chapterCount) + 1;
    

    const totalCourses = formation.formations.formation_data?.chapters?.reduce((total, chapter) => {
      return total + (chapter.courses?.length || 0);
    }, 0) || 10;
    
    const totalQuizzes = formation.formations.formation_data?.chapters?.reduce((total, chapter) => {
      return total + (chapter.quizzes?.length || 0);
    }, 0) || formation.formations.quiz_count || 3;
    
    const coursesFollowed = Math.floor(totalCourses * 0.7); 
    const quizzesCompleted = Math.floor(totalQuizzes * 0.6);
    
    return {
      currentChapter,
      totalChapters: chapterCount,
      coursesFollowed,
      quizzesCompleted
    };
  };

  const navigateToFormationContent = (formationId: string) => {
    router.push(`/formation-content?id=${formationId}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7376FF" />
          <Text style={styles.loadingText}>Chargement de vos formations...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

        {formations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucune formation achetée</Text>
            <Text style={styles.emptySubtext}>
              Explorez la boutique pour découvrir nos formations
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/boutique')}
            >
              <Text style={styles.browseButtonText}>Parcourir les formations</Text>
            </TouchableOpacity>
          </View>
        ) : (
          formations.map((purchasedFormation) => {
            const formation = purchasedFormation.formations;
            if (!formation) return null;
            
            const progress = getFormationProgress(purchasedFormation);
            const themeColor = getThemeColor(formation.theme);
            
            return (
              <TouchableOpacity
                key={purchasedFormation.id}
                style={[styles.card, { borderLeftColor: themeColor }]}
                onPress={() => navigateToFormationContent(formation.id)}
              >
                <Text style={[styles.theme, { color: themeColor }]}>
                  {formation.theme}
                </Text>
                <Text style={styles.status}>FORMATION ACHETÉE</Text>
                <Text style={[styles.title, { color: themeColor }]}>
                  {formation.title}
                </Text>
                
                {/* Barre de progression SVG */}
                <FormationProgressBar 
                  formation={formation}
                  progress={formationProgress[purchasedFormation.formation_id] || {}}
                />
                
                <Text style={styles.details}>
                  {progress.currentChapter}e CHAPITRE • {progress.coursesFollowed} COURS SUIVIS • {progress.quizzesCompleted} QUIZ RÉUSSIS
                </Text>
              </TouchableOpacity>
            );
          })
        )}
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
    color: '#7376FF',
    fontFamily: getFontFamily('bold'),
  },
  boutiqueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#7376FF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#1f2937',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 16,
    fontFamily: getFontFamily('regular'),
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#7376FF',
    padding: 16,
    borderRadius: 25,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 1,
  },
});
