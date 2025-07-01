import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { getFontFamily } from '../constants/Fonts';
import { supabase } from '../lib/supabase';
import { TestnetBadgeService } from '../services/testnetBadgeService';
import ArrowIcon from '../assets/images/arrow.svg';
import StarEmptyIcon from '../assets/images/starempty.svg';
import StarFullIcon from '../assets/images/starfull.svg';
import CongratulationsIcon from '../assets/images/congratulations.svg';
import BottomNavbar from '../components/BottomNavbar';

export default function CertificateResultScreen() {
  const router = useRouter();
  const { formationId, formationTitle } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [formation, setFormation] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizStats, setQuizStats] = useState({ correct: 0, total: 0 });
  const [badgeService] = useState(() => new TestnetBadgeService());
  const [generatingBadge, setGeneratingBadge] = useState(false);

  const handleStarPress = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  useEffect(() => {
    fetchFormationAndProgress();
  }, []);

  const fetchFormationAndProgress = async () => {
    try {
      // Récupérer la formation
      const { data: formationData, error: formationError } = await supabase
        .from('formations')
        .select('*')
        .eq('id', formationId)
        .single();

      if (formationError) throw formationError;
      setFormation(formationData);

      // Récupérer la progression de l'utilisateur
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        setLoading(false);
        return;
      }

      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('formation_id', formationId)
        .eq('type', 'quiz')
        .eq('completed', true);

      if (progressError) throw progressError;
      setUserProgress(progressData || []);

      // Calculer les statistiques des quiz
      const chapters = formationData?.formation_data?.iaResult?.chapters || [];
      let totalQuizzes = 0;
      chapters.forEach((chapter: any) => {
        totalQuizzes += chapter.quizzes?.length || 0;
      });

      const correctQuizzes = progressData?.length || 0;
      setQuizStats({ correct: correctQuizzes, total: totalQuizzes });

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBadgeNFT = async () => {
    if (generatingBadge) return;
    
    try {
      setGeneratingBadge(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Alert.alert('Erreur', 'Vous devez être connecté pour générer un badge');
        return;
      }

      // Obtenir les informations du testnet
      const testnetInfo = badgeService.getTestnetInfo();
      console.log('🌐 Testnet Info:', testnetInfo);

      const result = await badgeService.generateFormationBadge(
        user.id,
        formationId as string,
        quizStats.correct,
        quizStats.total
      );

      if (result.success) {
        Alert.alert(
          'Badge NFT généré sur testnet !',
          `Votre badge unique a été créé sur ${result.network}.\n\n` +
          `🎯 Token ID: ${result.tokenId}\n` +
          `🔗 Transaction: ${result.transactionHash?.substring(0, 10)}...\n\n` +
          `📍 Réseau: ${result.network}\n` +
          `💰 Frais: Gratuit (testnet)\n\n` +
          `Vous pouvez voir la transaction sur l'explorateur blockchain et votre badge dans la section "Succès".`,
          [
            {
              text: 'Voir sur l\'explorateur',
              onPress: () => {
                // En production, on pourrait ouvrir l'URL dans le navigateur
                console.log('🔗 Block Explorer:', result.blockExplorer);
                Alert.alert(
                  'Explorateur Blockchain',
                  `Transaction visible sur:\n${result.blockExplorer}\n\n(Dans une vraie app, cela ouvrirait automatiquement le navigateur)`
                );
              }
            },
            {
              text: 'Voir mes badges',
              onPress: () => router.push('/(tabs)/success')
            },
            {
              text: 'OK',
              style: 'default'
            }
          ]
        );
      } else {
        // Gestion des erreurs spécifiques au testnet
        let errorMessage = result.error || 'Erreur lors de la génération du badge';
        
        if (errorMessage.includes('Solde insuffisant')) {
          const instructions = badgeService.getTestTokensInstructions();
          Alert.alert(
            'Tokens de test requis',
            `Pour créer un badge NFT sur le testnet, vous avez besoin de tokens gratuits.\n\n${instructions}`,
            [
              {
                text: 'Obtenir des tokens',
                onPress: () => {
                  console.log('🚰 Redirection vers le faucet...');
                  Alert.alert(
                    'Faucet Mumbai',
                    'Allez sur https://faucet.polygon.technology/ pour obtenir des tokens gratuits.\n\nUne fois les tokens reçus, réessayez de générer votre badge.'
                  );
                }
              },
              { text: 'OK' }
            ]
          );
        } else {
          Alert.alert('Erreur', errorMessage);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la génération du badge:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la génération du badge');
    } finally {
      setGeneratingBadge(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleStarPress(i)}
          style={styles.starButton}
        >
          {i < rating ? (
            <StarFullIcon width={32} height={32} />
          ) : (
            <StarEmptyIcon width={32} height={32} />
          )}
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowIcon width={20} height={20} color="#7376FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{formation?.title || formationTitle || 'Formation'}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7376FF" />
            <Text style={styles.loadingText}>Chargement des résultats...</Text>
          </View>
        ) : (
          <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <View style={styles.titlesContainer}>
              <Text style={styles.mainTitle}>{formation?.title || 'Formation'}</Text>
              <Text style={styles.subtitle}>Résultat du Test - Final</Text>
            </View>

            {/* Badge hexagonal avec animation */}
            <View style={styles.badgeContainer}>
              <View style={styles.hexagonBadge}>
                <CongratulationsIcon 
                  width={220} 
                  height={220} 
                  color="#FFFFFF"
                />
              </View>
            </View>

            <View style={styles.centeredTextContainer}>
              <Text style={styles.congratulationsCenteredTitle}>Félicitation</Text>
              <Text style={styles.resultCenteredText}>
                Votre résultat est : <Text style={styles.resultHighlight}>Super !</Text>
              </Text>
            </View>

            {/* Statistiques */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>
                  Réponses correctes ( <Text style={styles.correctAnswersHighlight}>{quizStats.correct}</Text> / {quizStats.total} )
                </Text>
              </View>
            </View>

            {/* Système de notation */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Noter la formation :</Text>
              <View style={styles.starsContainer}>
                {renderStars()}
              </View>
            </View>

            {/* Boutons d'action */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.primaryButton,
                  { opacity: generatingBadge ? 0.7 : 1 }
                ]}
                onPress={generateBadgeNFT}
                disabled={generatingBadge}
              >
                <Text style={styles.primaryButtonText}>
                  {generatingBadge ? 'Génération du badge NFT...' : '🔗 Générer mon badge NFT (Testnet)'}
                </Text>
                <Text style={styles.primaryButtonSubtext}>
                  Mumbai Testnet • Gratuit
                </Text>
              </TouchableOpacity>

              <View style={styles.secondaryButtonsContainer}>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>+80 exp</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => router.push('/(tabs)/explore')}
                >
                  <Text style={styles.secondaryButtonText}>Accéder à mes formations</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Espace pour éviter le chevauchement avec la navbar */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}
        
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
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  titlesContainer: {
    alignItems: 'flex-start',
    marginBottom: 24,
    width: '100%',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7376FF',
    marginBottom: 8,
    fontFamily: getFontFamily('bold'),
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 20,
    color: '#7376FF',
    marginBottom: 0,
    fontFamily: getFontFamily('regular'),
    textAlign: 'left',
  },
  badgeContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  hexagonBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    shadowColor: '#7376FF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  congratulationsCenteredTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    fontFamily: getFontFamily('bold'),
    textAlign: 'center',
  },
  resultCenteredText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
    fontFamily: getFontFamily('regular'),
    textAlign: 'center',
  },
  resultHighlight: {
    color: '#7376FF',
    fontWeight: 'bold',
    fontFamily: getFontFamily('bold'),
  },
  statsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontFamily: getFontFamily('regular'),
  },
  ratingSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
    fontFamily: getFontFamily('regular'),
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#7376FF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: getFontFamily('bold'),
  },
  primaryButtonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    fontFamily: getFontFamily('regular'),
  },
  secondaryButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7376FF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7376FF',
    fontFamily: getFontFamily('semiBold'),
  },
  bottomSpacer: {
    height: 40,
  },
  centeredTextContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7376FF',
    fontFamily: getFontFamily('bold'),
  },
  correctAnswersHighlight: {
    color: '#7376FF',
    fontWeight: 'bold',
    fontFamily: getFontFamily('bold'),
  },
}); 