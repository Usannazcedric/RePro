import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
// @ts-ignore
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { Fonts } from '../../constants/Fonts';

// Import des SVG
import Svg75 from '../../assets/images/75.svg';
import Svg90 from '../../assets/images/90.svg';
import CertifIcon from '../../assets/images/certif.svg';

interface Formation {
  id: string;
  title: string;
  theme: string;
  description: string;
  quiz_count: number;
  chapter_count: number;
  certificate_available?: boolean;
  formation_data?: {
    coverImageUrl?: string;
    chapters?: Array<{
      quizzes?: any[];
    }>;
  };
}

export default function HomeScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [suggestedFormations, setSuggestedFormations] = useState<Formation[]>([]);

const fetchSuggestedFormations = async () => {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('id, title, theme, description, quiz_count, chapter_count, certificate_available, formation_data')
        .limit(20); // Augmenter pour avoir plus de choix

      if (error) {
        console.error('Erreur lors du chargement des formations:', error);
        return;
      }

      const allFormations = data || [];
      
      // D'abord essayer de trouver des formations avec des images
      const formationsWithImages = allFormations.filter(formation => {
        const coverImageUrl = formation?.formation_data?.coverImageUrl;
        return coverImageUrl && coverImageUrl.trim() !== '';
      });

      // Si on a des formations avec images, les utiliser. Sinon, prendre n'importe lesquelles
      const selectedFormations = formationsWithImages.length >= 2 
        ? formationsWithImages.slice(0, 2)
        : allFormations.slice(0, 2);

      setSuggestedFormations(selectedFormations);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
    }
  };

  // Helper functions to extract formation data
  const getCoverImageUrl = (formation: Formation) => {
    return formation?.formation_data?.coverImageUrl || null;
  };

  const getChapterCount = (formation: Formation) => {
    const chapters = formation?.formation_data?.chapters || [];
    return chapters.length || formation.chapter_count || 0;
  };

  const getQuizCount = (formation: Formation) => {
    const chapters = formation?.formation_data?.chapters || [];
    if (chapters.length > 0) {
      return chapters.reduce((total, chapter) => {
        return total + (chapter.quizzes?.length || 0);
      }, 0);
    }
    return formation.quiz_count || 0;
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', user.id)
              .single();

            if (error) {
              console.error('Erreur lors de la récupération du profil:', error);
              setUsername(null);
              setProfile(null);
            } else {
              setUsername(profileData?.username || user.email?.split('@')[0] || 'Utilisateur');
              setProfile(profileData);
            }
                      } else {
              setUsername(null);
              setProfile(null);
            }
          } catch (err) {
            console.error('Erreur lors du chargement de l&apos;utilisateur', err);
            setUsername(null);
            setProfile(null);
          }
      };

      fetchUser();
      fetchSuggestedFormations();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.subtitle}>Reprenons l&apos;apprentissage,</Text>
            <Text style={styles.usernameText}>
              {username ? `${username}!` : '...'}
            </Text>
          </View>

          <TouchableOpacity onPress={() => router.push('/profile')}>
            {profile?.avatar_url ? (
              <Image
                source={{ uri: profile.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={require('../../assets/images/pexels-photo-415829.jpeg')}
                style={styles.avatar}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Quiz + stats */}
        <View style={styles.dashboard}>
          <TouchableOpacity 
            style={[styles.card, styles.quiz]}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Text style={styles.quizLabel}>AUJOURD&apos;HUI - QUIZ</Text>
            <Text style={styles.quizTitle}>Python</Text>
            <Text style={styles.quizSubtitle}>Tenter maintenant</Text>
          </TouchableOpacity>

          <View style={[styles.card, styles.circle]}>
            <View style={styles.svgContainer}>
              <Svg90 width={160} height={160} />
            </View>
            <Text style={styles.circleLabel}>XP restant</Text>
          </View>

          <View style={[styles.card, styles.circle]}>
            <View style={styles.svgContainer}>
              <Svg75 width={160} height={160} />
            </View>
            <Text style={styles.circleLabel}>Précision</Text>
          </View>
        </View>

        {/* Historique */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Historique des Quiz</Text>
            <TouchableOpacity onPress={() => router.push('/history')}>
              <Text style={styles.link}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.quizHistoryCard}>
            <View style={styles.quizHistoryHeader}>
              <Text style={styles.codeLabel}>Code</Text>
            </View>
            <Text style={styles.quizSubject}>React Native</Text>
            <Text style={styles.quizChapter}>DERNIER CHAPITRE - REACT NATIVE</Text>
            <View style={styles.quizResult}>
              <Text style={styles.quizScore}>Quiz • 19/20</Text>
              <Text style={styles.success}>RÉUSSI</Text>
            </View>
          </View>
        </View>

        {/* Routine */}
        <View style={styles.routineCard}>
          <Text style={styles.routineTitle}>SNAPREAD ROUTINE • 4 JOURS</Text>
          <Text style={styles.routineSubtext}>
            Connectez-vous plusieurs jours d&apos;affilée pour créer une routine.
          </Text>
          <View style={styles.routineDays}>
            {['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'].map((day, index) => (
              <View
                key={day}
                style={[
                  styles.day,
                  index >= 2 && index <= 5
                    ? styles.activeDay
                    : index === 6
                    ? styles.pendingDay
                    : styles.inactiveDay,
                ]}
              >
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Formations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Formations Suggérées</Text>
          <View style={styles.courseContainer}>
            {suggestedFormations.map((formation) => {
              const coverImageUrl = getCoverImageUrl(formation);
              const quizCount = getQuizCount(formation);
              const chapterCount = getChapterCount(formation);
              
              return (
                <TouchableOpacity
                  key={formation.id}
                  style={styles.courseCard}
                  onPress={() => router.push(`/formation-detail?id=${formation.id}`)}
                >
                  {/* Image de couverture */}
                  <View style={styles.imageContainer}>
                    {coverImageUrl ? (
                      <Image
                        source={{ uri: coverImageUrl }}
                        style={styles.formationImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderIcon}>📚</Text>
                      </View>
                    )}
                  </View>

                  {/* Contenu de la carte */}
                  <View style={styles.cardContent}>
                    {/* Badge certificat */}
                    {formation.certificate_available && (
                      <View style={styles.certificateBadge}>
                        <CertifIcon 
                          width={12} 
                          height={12} 
                          style={styles.certificateIcon}
                        />
                        <Text style={styles.certificateText}>Certificat Disponible</Text>
                      </View>
                    )}
                    
                    <Text style={styles.courseTitle}>{formation.title}</Text>
                    <Text style={styles.courseInfo}>
                      {quizCount} Quiz • {chapterCount} Chapitres
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    paddingHorizontal: 20,
    fontFamily: Fonts.regular,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 24,
    paddingHorizontal: 4,
  },
  titleContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 22,
    color: '#1a1a1a',
    fontFamily: Fonts.regular,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 28,
  },
  usernameText: {
    fontSize: 28,
    color: '#6366F1',
    fontFamily: Fonts.extraBold,
    lineHeight: 34,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  dashboard: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    height: 120,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    flex: 1,
    alignItems: 'center',
  },
  quiz: {
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  quizLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 6,
    color: '#333',
  },
  quizSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 20,
  },
  quizBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  quizBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  circle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 8,
  },
  circleValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B3C83',
  },
  circleLabel: {
    marginTop: - 47,
    fontSize: 14,
    color: '#333',
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#6366F1',
  },
  link: {
    color: '#6366F1',
    fontSize: 14,
  },
  quizHistory: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 12,
  },
  quizHistoryCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  quizHistoryHeader: {
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  quizSubject: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 8,
    color: '#6366F1',
  },
  quizChapter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontWeight: '500',
  },
  quizResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizScore: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  quizInfo: {
    fontSize: 14,
    color: '#444',
  },
  success: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: 14,
  },
  routine: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  routineCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  routineTitle: {
    fontWeight: 'bold',
    color: '#6366F1',
    marginBottom: 4,
  },
  routineSubtext: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  routineDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeDay: {
    backgroundColor: '#34c759',
  },
  inactiveDay: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  pendingDay: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    opacity: 0.6,
  },
  courseContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  courseCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  courseBadge: {
    fontSize: 12,
    color: '#0B3C83',
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1f2937',
  },
  courseInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#e5e7eb',
  },
  formationImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
    color: '#6b7280',
  },
  cardContent: {
    padding: 16,
  },
  certificateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  certificateIcon: {
    marginRight: 4,
  },
  certificateText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  svgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
});
