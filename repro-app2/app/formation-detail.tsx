import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../lib/supabase';
import { getFontFamily } from '../constants/Fonts';
import CertifIcon from '../assets/images/certif.svg';
import StepsIcon from '../assets/images/steps.svg';
import TradIcon from '../assets/images/trad.svg';
import ArrowIcon from '../assets/images/arrow.svg';

const { width } = Dimensions.get('window');

interface Formation {
  id: string;
  title: string;
  description: string;
  theme: string;
  quiz_count: number;
  chapter_count: number;
  certificate_available: boolean;
  formation_data?: {
    coverImageUrl?: string;
    chapters?: Array<{
      quizzes?: any[];
    }>;
  };
}

export default function FormationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkImage, setIsDarkImage] = useState(true);

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

  const getChapters = (formation: Formation) => {
    if (formation?.formation_data?.chapters && formation.formation_data.chapters.length > 0) {
      return formation.formation_data.chapters;
    }
    return [];
  };

  const getChapterCount = (formation: Formation) => {
    const chapters = getChapters(formation);
    return chapters.length || formation.chapter_count || 0;
  };

  const getQuizCount = (formation: Formation) => {
    const chapters = getChapters(formation);
    if (chapters.length > 0) {
      return chapters.reduce((total, chapter) => {
        return total + (chapter.quizzes?.length || 0);
      }, 0);
    }
    return formation.quiz_count || 0;
  };

  const getCoverImageUrl = (formation: Formation) => {
    return formation?.formation_data?.coverImageUrl || null;
  };

  // Fonction pour naviguer vers la page de contenu
  const navigateToContent = () => {
    console.log('🔥 BOUTON CLIQUÉ - Navigation vers formation-content avec ID:', id);
    console.log('🔥 Type de ID:', typeof id);
    console.log('🔥 Router disponible:', !!router);
    
    try {
      console.log('🔥 Tentative de navigation...');
      router.push({
        pathname: '/formation-content',
        params: { id: id }
      } as any);
      console.log('🔥 Navigation lancée avec succès');
    } catch (error) {
      console.error('🔥 ERREUR de navigation:', error);
    }
  };

  // Fonction pour analyser la luminosité de l'image
  const analyzeImageBrightness = (imageUrl: string) => {
    // Pour simplifier, on va utiliser une heuristique basée sur l'URL ou le thème
    // Dans un cas réel, on pourrait analyser les pixels de l'image
    const darkThemes = ['python', 'code', 'informatique', 'programmation'];
    const lightThemes = ['design', 'arts', 'mathématiques'];
    
    if (formation?.theme) {
      const theme = formation.theme.toLowerCase();
      if (darkThemes.some(darkTheme => theme.includes(darkTheme))) {
        setIsDarkImage(true);
      } else if (lightThemes.some(lightTheme => theme.includes(lightTheme))) {
        setIsDarkImage(false);
      } else {
        // Par défaut, on considère l'image comme sombre
        setIsDarkImage(true);
      }
    }
  };

  useEffect(() => {
    if (formation) {
      const imageUrl = getCoverImageUrl(formation);
      if (imageUrl) {
        analyzeImageBrightness(imageUrl);
      }
    }
  }, [formation]);

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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const coverImageUrl = getCoverImageUrl(formation);
  const quizCount = getQuizCount(formation);
  const chapterCount = getChapterCount(formation);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Image de fond fixe */}
          <View style={styles.backgroundImageContainer}>
            {coverImageUrl ? (
              <Image
                source={{ uri: coverImageUrl }}
                style={styles.backgroundImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderBackground}>
                <Text style={styles.placeholderIcon}>📚</Text>
              </View>
            )}
          </View>

          {/* Bouton retour et titre */}
          <View style={styles.headerControls}>
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
            <Text style={[
              styles.pageTitle, 
              { color: isDarkImage ? '#ffffff' : '#1f2937' }
            ]}>
              Boutique
            </Text>
          </View>

          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topSpacer} />
            
            <View style={styles.contentContainer}>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0.95)', 'white']}
                style={styles.fadeGradient}
              />

              <View style={styles.contentSection}>

                {formation.certificate_available && (
                  <View style={styles.certificateBadge}>
                    <CertifIcon 
                      width={16} 
                      height={16} 
                      style={styles.certificateIcon}
                    />
                    <Text style={styles.certificateText}>Certificat Disponible</Text>
                  </View>
                )}

    
                <Text style={styles.title}>{formation.title}</Text>

                <Text style={styles.stats}>
                  {quizCount} Quiz • {chapterCount} Chapitres
                </Text>

                <View style={styles.infoRow}>
                  <View style={styles.languageSection}>
                    <TradIcon 
                      width={16} 
                      height={16} 
                      style={styles.languageIcon}
                    />
                    <Text style={styles.languageText}>Enseigné en Français</Text>
                  </View>
                  <View style={styles.ratingSection}>
                    <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
                    <Text style={styles.rating}>4.5/5.0</Text>
                  </View>
                </View>

                <View style={styles.stepsContainer}>
                  <StepsIcon 
                    width={width - 190} 
                    height={50}
                  />
                </View>

                <Text style={styles.sectionTitle}>Description de la formation</Text>

                <Text style={styles.description}>
                  {formation.description || "Cette formation vous permettra d'acquérir de nouvelles compétences et d'obtenir une certification reconnue."}
                </Text>

                <View style={{ height: 100 }} />

                <View style={styles.purchaseContainerInline}>
                  <TouchableOpacity 
                    style={[styles.purchaseButton, { backgroundColor: '#7376FF' }]}
                    onPress={navigateToContent}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.purchaseButtonText}>Acheter la formation</Text>
                    <Text style={styles.purchaseSubtext}>Certificat inclus dans SnapRead</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
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
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350,
    zIndex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 60,
    color: '#6b7280',
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 18,
    color: '#7376FF',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSpacer: {
    height: 220,
  },
  contentContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
  },
  fadeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  contentSection: {
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  certificateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  certificateIcon: {
    marginRight: 8,
  },
  certificateText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    fontFamily: getFontFamily('medium'),
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    fontFamily: getFontFamily('bold'),
  },
  stats: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 16,
    fontFamily: getFontFamily('regular'),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  languageSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageIcon: {
    marginRight: 8,
  },
  languageText: {
    fontSize: 14,
    color: '#374151',
    fontFamily: getFontFamily('regular'),
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    fontSize: 16,
    marginRight: 8,
  },
  rating: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    fontFamily: getFontFamily('semiBold'),
  },
  stepsContainer: {
    marginVertical: 16,
    marginTop: - 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    fontFamily: getFontFamily('bold'),
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 0,
    fontFamily: getFontFamily('regular'),
  },
  purchaseContainerInline: {
    marginTop: 16,
    alignItems: 'center',
  },
  purchaseButton: {
    backgroundColor: '#7376FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: getFontFamily('bold'),
  },
  purchaseSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    fontFamily: getFontFamily('regular'),
  },
  backButtonText: {
    fontSize: 16,
    color: '#7376FF',
    fontWeight: '600',
  },
  headerControls: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    fontFamily: getFontFamily('bold'),
  },
}); 