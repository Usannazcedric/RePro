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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { getFontFamily } from '../constants/Fonts';

interface Formation {
  id: string;
  title: string;
  description: string;
  theme: string;
  quiz_count: number;
  chapter_count: number;
  certificate_available: boolean;
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
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes formations</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Boutique de formations</Text>
        <Text style={styles.subtitle}>
          Explorez de nouvelles formations et obtenez une certification !
        </Text>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Nom de la formation..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙️</Text>
            <Text style={styles.filterText}>Filtres</Text>
          </TouchableOpacity>
        </View>

        {Object.entries(grouped).map(([theme, list]) => (
          <View key={theme} style={styles.themeSection}>
            <Text style={[styles.themeTitle, { color: getThemeColor(theme) }]}>
              {theme}
            </Text>
            <View style={styles.formationsGrid}>
              {list.map(f => (
                <View key={f.id} style={styles.formationCard}>
                  <View style={styles.cardHeader}>
                    {f.certificate_available && (
                      <View style={styles.certificateBadge}>
                        <Text style={styles.certificateIcon}>🏆</Text>
                        <Text style={styles.certificateText}>Certificat Disponible</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.formationTitle, { color: getThemeColor(theme) }]}>  
                    {f.title || 'Formation sans titre'}
                  </Text>
                  <Text style={styles.formationStats}>
                    {f.quiz_count || 0} Quiz • {f.chapter_count || 0} Chapitres
                  </Text>
                </View>
              ))}
            </View>
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
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#f8f9fb',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 20,
    color: '#374151',
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
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    fontFamily: getFontFamily('bold'),
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    fontFamily: getFontFamily('regular'),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
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
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
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
  formationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  formationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  certificateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  certificateIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  certificateText: {
    fontSize: 10,
    color: '#0277bd',
    fontWeight: '600',
    fontFamily: getFontFamily('semiBold'),
  },
  formationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: getFontFamily('bold'),
  },
  formationStats: {
    fontSize: 13,
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
