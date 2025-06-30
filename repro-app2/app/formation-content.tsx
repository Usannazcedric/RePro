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

interface Chapter {
  id: string;
  title: string;
  videos?: Array<{
    id: string;
    title: string;
    duration: string;
    type: 'video' | 'cours';
  }>;
  quizzes?: Array<{
    id: string;
    title: string;
    score?: string;
  }>;
}

interface Formation {
  id: string;
  title: string;
  subtitle?: string;
  theme: string;
  formation_data?: {
    chapters?: Chapter[];
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
    if (formation?.formation_data?.chapters) {
      return formation.formation_data.chapters;
    }
    
    // Données de démonstration si pas de chapitres dans la DB
    return [
      {
        id: '1',
        title: 'Chapitre 1',
        videos: [
          { id: '1', title: 'Introduction à Python', duration: '3:25', type: 'video' },
          { id: '2', title: 'Son histoire', duration: '4:25', type: 'cours' },
          { id: '3', title: 'Pourquoi utiliser Python ?', duration: '4:25', type: 'video' },
        ],
        quizzes: [
          { id: '1', title: 'Test - Chapitre 1', score: '09/10 RÉUSSI' }
        ]
      },
      {
        id: '2',
        title: 'Chapitre 2',
        videos: [
          { id: '4', title: 'Comment utiliser Python', duration: '7:25', type: 'video' },
          { id: '5', title: 'Les astuces', duration: '5:00', type: 'video' },
          { id: '6', title: "Comment s'améliorer", duration: '4:25', type: 'video' },
        ],
        quizzes: [
          { id: '2', title: 'Test - Chapitre 2' }
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowIcon 
              width={20} 
              height={20} 
              color="#7376FF"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes formations</Text>
        </View>

        <ScrollView style={styles.container}>
          {/* Titre principal */}
          <Text style={styles.mainTitle}>Python</Text>
          <Text style={styles.subtitle}>Introduction à la programmation</Text>

          {/* Onglets */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Formation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Statistiques</Text>
            </TouchableOpacity>
          </View>

          {/* Chapitres */}
          {chapters.map((chapter, chapterIndex) => (
            <View key={chapter.id} style={styles.chapterSection}>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              
              {/* Vidéos/Cours */}
              {chapter.videos?.map((video, videoIndex) => (
                <TouchableOpacity key={video.id} style={styles.contentItem}>
                  <View style={styles.contentLeft}>
                    <Text style={styles.contentNumber}>
                      {chapterIndex * 10 + videoIndex + 1}
                    </Text>
                    <View style={styles.contentInfo}>
                      <Text style={styles.contentTitle}>{video.title}</Text>
                      <Text style={styles.contentMeta}>
                        {video.type === 'video' ? 'Vidéo' : 'Cours'} • {video.duration}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.playButton}>
                    <Text style={styles.playIcon}>▶</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}

              {/* Quiz */}
              {chapter.quizzes?.map((quiz, quizIndex) => (
                <TouchableOpacity key={quiz.id} style={styles.contentItem}>
                  <View style={styles.contentLeft}>
                    <Text style={styles.contentNumber}>
                      {chapterIndex * 10 + (chapter.videos?.length || 0) + quizIndex + 1}
                    </Text>
                    <View style={styles.contentInfo}>
                      <Text style={styles.contentTitle}>{quiz.title}</Text>
                      <Text style={styles.contentMeta}>
                        Quiz {quiz.score ? `• ${quiz.score}` : ''}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.playButton}>
                    <Text style={styles.playIcon}>▶</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
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
  contentItem: {
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
  contentMeta: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: getFontFamily('regular'),
  },
  playButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 2,
  },
}); 