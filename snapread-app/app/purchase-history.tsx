import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import { useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import { supabase } from '@/lib/supabase';
import { Stack } from 'expo-router';
import BottomNavbar from '@/components/BottomNavbar';
import ArrowIcon from '@/assets/images/arrow.svg';

// Import SVG icons

const FolderIcon = `<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

interface Purchase {
  id: string;
  formationTitle: string;
  price: number;
  purchasedAt: string;
  status: string;
}

export default function PurchaseHistoryScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'tout' | 'achat' | 'rembourse'>('tout');
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'utilisateur connecté
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        console.error('Utilisateur non connecté');
        setPurchases([]);
        return;
      }

      // Récupérer les achats de l'utilisateur
      const { data, error } = await supabase
        .from('purchased_formations')
        .select(`
          id,
          price,
          purchased_at,
          status,
          formations!inner(
            title
          )
        `)
        .eq('user_id', session.user.id)
        .order('purchased_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des achats:', error);
        setPurchases([]);
        return;
      }

      // Transformer les données
      const formattedPurchases = (data || []).map((purchase: any) => ({
        id: purchase.id,
        formationTitle: purchase.formations?.title || 'Formation inconnue',
        price: purchase.price,
        purchasedAt: purchase.purchased_at,
        status: purchase.status || 'active'
      }));

      setPurchases(formattedPurchases);

    } catch (error) {
      console.error('Erreur lors du chargement des achats:', error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      'active': 'Confirmé',
      'cancelled': 'Annulé',
      'refunded': 'Remboursé'
    };
    return statusMap[status as keyof typeof statusMap] || 'Inconnu';
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      'active': '#10B981',
      'cancelled': '#F59E0B',
      'refunded': '#EF4444'
    };
    return colorMap[status as keyof typeof colorMap] || '#6B7280';
  };

  const filteredPurchases = purchases.filter(purchase => {
    if (activeFilter === 'tout') return true;
    if (activeFilter === 'achat') return purchase.status === 'active';
    if (activeFilter === 'rembourse') return purchase.status === 'refunded';
    return true;
  });

  const handleBackPress = () => {
    router.push('/(tabs)/settings');
  };

  const handlePurchasePress = (purchase: Purchase) => {
    Alert.alert(
      'Détails de l\'achat',
      `Formation: ${purchase.formationTitle}\nPrix: ${purchase.price.toFixed(2)}€\nDate: ${formatDate(purchase.purchasedAt)} à ${formatTime(purchase.purchasedAt)}\nStatut: ${getStatusLabel(purchase.status)}`
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />
        
        {/* Header Controls */}
        <View style={styles.headerControls}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowIcon width={20} height={20} color="#7376FF" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Paramètres</Text>
        </View>
        
        {/* Page Title */}
        <View style={styles.pageTitleContainer}>
          <Text style={styles.mainTitle}>Vos achats</Text>
        </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Filtres */}
        <View style={styles.filtersSection}>
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[styles.filterTab, activeFilter === 'tout' && styles.activeFilterTab]}
              onPress={() => setActiveFilter('tout')}
            >
              <Text style={[styles.filterTabText, activeFilter === 'tout' && styles.activeFilterTabText]}>
                Tout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, activeFilter === 'achat' && styles.activeFilterTab]}
              onPress={() => setActiveFilter('achat')}
            >
              <Text style={[styles.filterTabText, activeFilter === 'achat' && styles.activeFilterTabText]}>
                Achat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterTab, activeFilter === 'rembourse' && styles.activeFilterTab]}
              onPress={() => setActiveFilter('rembourse')}
            >
              <Text style={[styles.filterTabText, activeFilter === 'rembourse' && styles.activeFilterTabText]}>
                Remboursé
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading state */}
        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#7C4DFF" />
            <Text style={styles.loadingText}>Chargement des achats...</Text>
          </View>
        ) : (
          <>
            {/* Liste des achats */}
            {filteredPurchases.length > 0 ? (
              <View style={styles.purchasesList}>
                {filteredPurchases.map((purchase) => (
                  <TouchableOpacity
                    key={purchase.id}
                    style={styles.purchaseItem}
                    onPress={() => handlePurchasePress(purchase)}
                  >
                    <View style={styles.purchaseInfo}>
                      <Text style={styles.formationTitle} numberOfLines={2}>
                        {purchase.formationTitle}
                      </Text>
                      <View style={styles.purchaseDetails}>
                        <Text style={styles.price}>{purchase.price.toFixed(2)}€</Text>
                        <Text style={styles.date}>
                          {formatDate(purchase.purchasedAt)} à {formatTime(purchase.purchasedAt)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.purchaseStatus}>
                      <View 
                        style={[
                          styles.statusBadge, 
                          { backgroundColor: getStatusColor(purchase.status) + '20' }
                        ]}
                      >
                        <Text 
                          style={[
                            styles.statusText, 
                            { color: getStatusColor(purchase.status) }
                          ]}
                        >
                          {getStatusLabel(purchase.status)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              /* État vide */
              <View style={styles.emptyState}>
                <SvgXml xml={FolderIcon} width={60} height={60} />
                <Text style={styles.emptyMessage}>
                  {activeFilter === 'tout' 
                    ? 'Aucun achat pour le moment'
                    : activeFilter === 'achat'
                    ? 'Aucun achat confirmé'
                    : 'Aucun remboursement'
                  }
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
      
      {/* Navbar globale */}
      <BottomNavbar />
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerControls: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 3,
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
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#333333',
    fontFamily: 'Nunito-ExtraBold',
  },
  pageTitleContainer: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7376FF',
    fontFamily: 'Nunito-ExtraBold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filtersSection: {
    marginBottom: 20,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#7376FF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Nunito-ExtraBold',
  },
  activeFilterTabText: {
    color: 'white',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Nunito-Regular',
  },
  purchasesList: {
    gap: 12,
    paddingBottom: 120,
  },
  purchaseItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  purchaseInfo: {
    flex: 1,
    marginRight: 12,
  },
  formationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Nunito-ExtraBold',
  },
  purchaseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7376FF',
    fontFamily: 'Nunito-ExtraBold',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Nunito-Regular',
  },
  purchaseStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Nunito-ExtraBold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyMessage: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Nunito-Regular',
  },
}); 