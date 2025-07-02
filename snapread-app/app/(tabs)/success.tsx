import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import des badges SVG
import BadgeDesignIcon from '../../assets/images/badge-design.svg';
import BiologyBadgeIcon from '../../assets/images/biology-badge.svg';
import FigmaBadgeIcon from '../../assets/images/figma-badge.svg';
import MarketingBadgeIcon from '../../assets/images/marketing-badge.svg';
import PythonBadgeIcon from '../../assets/images/python-badge.svg';
import BottomNavbar from '../../components/BottomNavbar';

export default function SuccessScreen() {
  const badges = [
    {
      id: 1,
      component: BadgeDesignIcon,
      title: 'DESIGN THINKING',
      subtitle: 'Certifié par Snapread'
    },
    {
      id: 2,
      component: BiologyBadgeIcon,
      title: 'AP® Biology',
      subtitle: 'Certifié par Snapread'
    },
    {
      id: 3,
      component: FigmaBadgeIcon,
      title: 'Figma Basics',
      subtitle: 'Certifié par Snapread'
    },
    {
      id: 4,
      component: MarketingBadgeIcon,
      title: 'Marketing',
      subtitle: 'Introduction à'
    },
    {
      id: 5,
      component: BadgeDesignIcon,
      title: 'DESIGN THINKING',
      subtitle: 'Certifié par Snapread'
    },
    {
      id: 6,
      component: BiologyBadgeIcon,
      title: 'AP® Biology',
      subtitle: 'Certifié par Snapread'
    },
    {
      id: 7,
      component: FigmaBadgeIcon,
      title: 'Figma Basics',
      subtitle: 'Certifié par Snapread'
    },
    {
      id: 8,
      component: PythonBadgeIcon,
      title: 'Python',
      subtitle: 'Introduction à'
    }
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fb" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Mes Succès</Text>
          
          <View style={styles.badgesGrid}>
              {badges.map((badge) => {
                const BadgeComponent = badge.component;
                return (
                  <View key={badge.id} style={styles.badgeContainer}>
                    <BadgeComponent 
                      width={160} 
                      height={160} 
                    />
                  </View>
                );
              })}
            </View>
        </View>
        
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
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110, // Espace pour la navbar
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#7376FF',
    marginBottom: 20,
    textAlign: 'left',
  },
  badgesGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    alignContent: 'flex-start',
  },
  badgeContainer: {
    width: '47%',
    alignItems: 'center',
    marginBottom: 8,
  },
});
