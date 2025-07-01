// BoutiqueScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import LoupeIcon from '../assets/images/loupe.svg';
import FiltresIcon from '../assets/images/filtres.svg';
import CertifIcon from '../assets/images/certif.svg';
import ArrowIcon from '../assets/images/arrow.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { getFontFamily } from '../constants/Fonts';
import CustomTabBar from '../components/CustomTabBar';

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

export default function BoutiqueScreen() {
  const router = useRouter();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFormations, setFilteredFormations] = useState<Formation[]>([]);

  useEffect(() => {
    fetchFormations();
  }, []);

  useEffect(() => {
    filterFormations();
  }, [formations, searchQuery]);

  const fetchFormations = async () => {
    try {
      const { data, error } = await supabase
        .from('formations')
        .select('*')
        .order('theme', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      setFormations(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFormations = () => {
    if (!searchQuery.trim()) {
      setFilteredFormations(formations);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = formations.filter(f =>
      (f.title || '').toLowerCase().includes(query) ||
      (f.theme || '').toLowerCase().includes(query)
    );

    setFilteredFormations(filtered);
  };

  const groupFormationsByTheme = (list: Formation[]) => {
    return list.reduce((groups, f) => {
      const key = f.theme || 'Autre';
      if (!groups[key]) groups[key] = [];
      groups[key].push(f);
      return groups;
    }, {} as Record<string, Formation[]>);
  };

  // Fonctions pour extraire les données selon la structure de la DB
  const getChapters = (formation: Formation) => {
    // Nouveau format: chapitres dans formation_data
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
      // Compter tous les quiz dans tous les chapitres
      return chapters.reduce((total, chapter) => {
        return total + (chapter.quizzes?.length || 0);
      }, 0);
    }
    // Fallback ancien format
    return formation.quiz_count || 0;
  };

  const getCoverImageUrl = (formation: Formation) => {
    return formation?.formation_data?.coverImageUrl || null;
  };

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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7376FF" />
          <Text style={styles.loadingText}>Chargement des formations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const grouped = groupFormationsByTheme(filteredFormations);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top','left','right']}>
      {/* Header mis à jour */}
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

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Boutique de formations</Text>
        <Text style={styles.subtitle}>
          Explorez de nouvelles formations et obtenez une certification !
        </Text>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <LoupeIcon 
              width={20} 
              height={20} 
              color="#7376FF"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Nom de la formation..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9ca3af"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <FiltresIcon 
              width={20} 
              height={20} 
              color="#7376FF"
              style={styles.filterIcon}
            />
            <Text style={styles.filterText}>Filtres</Text>
          </TouchableOpacity>
        </View>

        {Object.entries(grouped).map(([theme, list]) => (
          <View key={theme} style={styles.themeSection}>
            <Text style={[styles.themeTitle, { color: getThemeColor(theme) }]}>
              {theme}
            </Text>
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
              style={styles.horizontalScroll}
            >
              {list.map(f => {
                const coverImageUrl = getCoverImageUrl(f);
                const quizCount = getQuizCount(f);
                const chapterCount = getChapterCount(f);
                
                return (
                  <TouchableOpacity 
                    key={f.id} 
                    style={styles.formationCard}
                    onPress={() => router.push(`/formation-detail?id=${f.id}`)}
                  >
                    {/* Image de couverture en pleine largeur */}
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

                    {/* Contenu en bas */}
                    <View style={styles.cardContent}>
                      {/* Badge certificat en dessous de l'image */}
                      {f.certificate_available && (
                        <View style={styles.certificateBadge}>
                          <CertifIcon 
                            width={12} 
                            height={12} 
                            style={styles.certificateIcon}
                          />
                          <Text style={styles.certificateText}>Certificat Disponible</Text>
                        </View>
                      )}
                      
                      <Text style={styles.formationTitle}>
                        {f.title || 'Formation sans titre'}
                      </Text>
                      <Text style={styles.formationStats}>
                        {quizCount} Quiz • {chapterCount} Chapitres
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ))}

        {filteredFormations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucune formation trouvée</Text>
            <Text style={styles.emptySubtext}>
              Essayez de modifier vos critères de recherche
            </Text>
          </View>
        )}
      </ScrollView>
      <CustomTabBar />
    </SafeAreaView>
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
    padding: 16,
    paddingBottom: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7376FF',
    marginBottom: 12,
    fontFamily: getFontFamily('bold'),
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 24,
    fontFamily: getFontFamily('regular'),
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    fontFamily: getFontFamily('regular'),
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    color: '#7376FF',
    fontWeight: '500',
    fontFamily: getFontFamily('medium'),
  },
  themeSection: {
    marginBottom: 32,
  },
  themeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: getFontFamily('bold'),
  },
  horizontalScrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  horizontalScroll: {
    marginHorizontal: -16,
  },
  formationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    width: (width - 64) / 2,
    marginRight: 16,
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
    fontFamily: getFontFamily('regular'),
  },
  cardContent: {
    padding: 16,
  },
  formationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    fontFamily: getFontFamily('bold'),
  },
  formationStats: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: getFontFamily('regular'),
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    fontFamily: getFontFamily('semiBold'),
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontFamily: getFontFamily('regular'),
  },
});
