import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { HomeIcon, FormationsIcon, SuccessIcon, SettingsIcon } from '@/components/TabIcons';

function TabBarBackground() {
  return <View style={styles.tabBarBackground} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7376FF', // Couleur active (purple)
        tabBarInactiveTintColor: '#C9CAFF', // Couleur inactive (gris-purple)
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
          fontWeight: '500',
        },
        tabBarItemStyle: {
          paddingTop: 2,
        },
        tabBarStyle: {
          position: 'absolute',
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
          elevation: 20, // Android
        },
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} size={24} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Formations',
          tabBarIcon: ({ focused }) => <FormationsIcon focused={focused} size={24} />,
        }}
      />
      <Tabs.Screen
        name="success"
        options={{
          title: 'Succès',
          tabBarIcon: ({ focused }) => <SuccessIcon focused={focused} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ focused }) => <SettingsIcon focused={focused} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />

    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBarBackground: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 96, // match avec tabBarStyle
  },
});
