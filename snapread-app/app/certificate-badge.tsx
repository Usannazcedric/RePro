import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
// @ts-ignore
import { useRouter, useLocalSearchParams } from 'expo-router';
// import { getFontFamily } from '../constants/Fonts';
import ArrowIcon from '../assets/images/arrow.svg';
import MarketingBadgeIcon from '../assets/images/marketing-badge.svg';
import BottomNavbar from '../components/BottomNavbar';

export default function CertificateBadgeScreen() {
  const router = useRouter();
  const { formationId, formationTitle, rating, quizCorrect, quizTotal } = useLocalSearchParams();

  const today = new Date();
  const formattedDate = today.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fb" />
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowIcon width={20} height={20} color="#7376FF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{formationTitle}</Text>
        </View>

        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          {/* Badge principal */}
          <View style={styles.badgeContainer}>
            <MarketingBadgeIcon 
              width={350} 
              height={350} 
            />
          </View>

          {/* Informations du certificat */}
          <View style={styles.infoContainer}>
            <Text style={styles.snapreadTitle}>Snapread</Text>
            <Text style={styles.certificateTitle}>{formationTitle} Débutant</Text>
            <Text style={styles.learnedText}>Learned™ Formations</Text>
            <Text style={styles.completionText}>Formation complétée le {formattedDate}</Text>
            <Text style={styles.scoreText}>Le score du final était de {quizCorrect}/{quizTotal}</Text>
          </View>

          {/* Footer du certificat */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Ce Badge A Été Attribué Et Signé Numériquement Par{'\n'}
              <Text style={styles.snapreadLink}>Snapread</Text>
            </Text>
            <Text style={styles.copyrightText}>© 2024, Tous Droits Réservés, Snapread</Text>
          </View>

          {/* Espace pour éviter le chevauchement avec la navbar */}
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
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 44,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
    position: 'relative',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  snapreadTitle: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  certificateTitle: {
    fontSize: 28,
    color: '#1f2937',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  learnedText: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 12,
  },
  completionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    width: '100%',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  snapreadLink: {
    color: '#7376FF',
    fontWeight: '600',
  },
  copyrightText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '400',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
}); 