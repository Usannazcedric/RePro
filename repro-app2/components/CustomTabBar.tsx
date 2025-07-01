import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '../hooks/useColorScheme';

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  const tabs = [
    {
      name: 'index',
      title: 'Accueil',
      icon: 'house.fill',
      route: '/(tabs)/',
    },
    {
      name: 'explore',
      title: 'Formations',
      icon: 'book.fill',
      route: '/boutique',
    },
    {
      name: 'success',
      title: 'Succès',
      icon: 'trophy.fill',
      route: '/(tabs)/success',
    },
    {
      name: 'settings',
      title: 'Paramètres',
      icon: 'gearshape.fill',
      route: '/(tabs)/settings',
    },
  ];

  const isActive = (route: string) => {
    return pathname === route || (route === '/(tabs)/' && pathname === '/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = isActive(tab.route);
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => {
                console.log('🔥 TAB CLICKED:', tab.title, tab.route);
                router.push(tab.route as any);
              }}
            >
              <IconSymbol
                name={tab.icon as any}
                size={24}
                color={active ? Colors[colorScheme ?? 'light'].tint : '#B0B0B0'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: active ? Colors[colorScheme ?? 'light'].tint : '#B0B0B0',
                  },
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
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 96,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 12,
    elevation: 20,
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
  },
}); 