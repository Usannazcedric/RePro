import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

function TabBarBackground() {
  return <View style={styles.tabBarBackground} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2, 
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
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Formations',
          tabBarIcon: ({ color }) => <IconSymbol name="book.fill" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="success"
        options={{
          title: 'Succès',
          tabBarIcon: ({ color }) => <IconSymbol name="trophy.fill" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color }) => <IconSymbol name="gearshape.fill" size={24} color={color} />,
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
