import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

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