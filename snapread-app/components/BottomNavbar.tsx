import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
// @ts-ignore
import { useRouter, usePathname } from 'expo-router';
import { HomeIcon, FormationsIcon, SuccessIcon, SettingsIcon } from './TabIcons';
import { getFontFamily } from '../constants/Fonts';

export default function BottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      name: 'index',
      title: 'Accueil',
      icon: HomeIcon,
      route: '/(tabs)/',
    },
    {
      name: 'explore',
      title: 'Formations',
      icon: FormationsIcon,
      route: '/(tabs)/explore',
    },
    {
      name: 'success',
      title: 'Succès',
      icon: SuccessIcon,
      route: '/(tabs)/success',
    },
    {
      name: 'settings',
      title: 'Paramètres',
      icon: SettingsIcon,
      route: '/(tabs)/settings',
    },
  ];

  const isTabActive = (tabRoute: string) => {
    // Pour l'onglet Accueil
    if (tabRoute === '/(tabs)/') {
      return pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/';
    }
    
    // Pour l'onglet Formations - inclure toutes les pages liées aux formations
    if (tabRoute === '/(tabs)/explore') {
      return (
        pathname.includes('/explore') ||
        pathname.includes('/boutique') ||
        pathname.includes('/formation-detail') ||
        pathname.includes('/formation-content') ||
        pathname.includes('/course-content') ||
        pathname.includes('/quiz-content')
      );
    }
    
    // Pour l'onglet Paramètres - inclure la page purchase-history
    if (tabRoute === '/(tabs)/settings') {
      return (
        pathname.includes('/settings') ||
        pathname.includes('/purchase-history')
      );
    }
    
    // Pour les autres onglets, logique normale
    return pathname.includes(tabRoute);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBarBackground} />
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const focused = isTabActive(tab.route);
          
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => router.push(tab.route as any)}
            >
              <Icon focused={focused} size={24} />
              <Text 
                style={[
                  styles.tabLabel,
                  { color: focused ? '#7376FF' : '#C9CAFF' }
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 96,
  },
  tabBarBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 96,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 12,
    elevation: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 96,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
    fontFamily: getFontFamily('medium'),
  },
}); 