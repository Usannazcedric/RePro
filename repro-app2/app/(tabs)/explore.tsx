import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import BagIcon from '../../components/BagIcon';
import { getFontFamily } from '../../constants/Fonts';
import { supabase } from '../../lib/supabase';

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

export default function TabTwoScreen() {
  const router = useRouter();
  const [formations, setFormations] = useState<PurchasedFormation[]>([]);
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
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
      setFormations([]);
    } finally {
      setLoading(false);
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
    
    // Pour le moment, on simule un progrès
    const chapterCount = formation.formations.chapter_count || 1;
    const currentChapter = Math.floor(Math.random() * chapterCount) + 1;
    
    // Calculer les cours suivis et quiz réussis (simulation)
    const totalCourses = formation.formations.formation_data?.chapters?.reduce((total, chapter) => {
      return total + (chapter.courses?.length || 0);
    }, 0) || 10;
    
    const totalQuizzes = formation.formations.formation_data?.chapters?.reduce((total, chapter) => {
      return total + (chapter.quizzes?.length || 0);
    }, 0) || formation.formations.quiz_count || 3;
    
    const coursesFollowed = Math.floor(totalCourses * 0.7); // 70% des cours suivis
    const quizzesCompleted = Math.floor(totalQuizzes * 0.6); // 60% des quiz réussis
    
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
});
