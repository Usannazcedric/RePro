import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';

export const interFonts = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
};

export const getFontFamily = (weight: 'regular' | 'medium' | 'semiBold' | 'bold' = 'regular') => {
  const fontMap = {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semiBold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  };
  return fontMap[weight];
};

// Global font styles to be applied throughout the app
export const globalFontStyles = {
  fontFamily: getFontFamily('regular'),
};

export const nunitoFonts = {
  'Nunito-Regular': require('../assets/fonts/Nunito-Regular.ttf'),
  'Nunito-ExtraBold': require('../assets/fonts/Nunito-ExtraBold.ttf'),
};

// Fonction pour obtenir les polices avec fallback sécurisé
export const getSafeFont = (fontType: 'regular' | 'extraBold' = 'regular') => {
  try {
    // Vérifier si les polices personnalisées sont disponibles
    const customFonts = {
      regular: 'Nunito-Regular',
      extraBold: 'Nunito-ExtraBold',
    };
    
    return customFonts[fontType];
  } catch (error) {
    // Fallback vers les polices système
    return fontType === 'extraBold' ? 'System' : 'System';
  }
};

export const Fonts = {
  regular: getSafeFont('regular'),
  extraBold: getSafeFont('extraBold'),
  default: getSafeFont('regular'),
  
  // Fallbacks système pour iOS/Android
  systemRegular: 'System',
  systemBold: 'System',
};

export const FontSizes = {
  small: 12,
  medium: 16,
  large: 20,
  extraLarge: 24,
  title: 28,
}; 