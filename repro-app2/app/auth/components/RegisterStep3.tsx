import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RegisterStep3Props {
  onNext: (data: { themes: string[] }) => void;
  onPrev: () => void;
  userData?: { themes?: string[] };
}

export default function RegisterStep3({ onNext, onPrev, userData }: RegisterStep3Props) {
  const [selectedThemes, setSelectedThemes] = useState<string[]>(userData?.themes || ['Code', 'Design', 'Entrepreneuriat']);

  const themes = [
    'Code', 'Design', 'Entrepreneuriat',
    'Communication', 'Marketing digital', 'Développement personnel',
    'Carrière', 'Finance', 'Langues',
    'Sciences', 'Créativité', 'Innovation'
  ];

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const handleNext = () => {
    if (selectedThemes.length > 0) {
      onNext({ themes: selectedThemes });
    } else {
      alert('Veuillez sélectionner au moins un thème');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
      </View>

      <View style={styles.header}>
        <Text style={styles.appTitle}>SnapRead</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choisissez les thèmes</Text>
          <Text style={styles.title}>que vous souhaitez apprendre</Text>
          <Text style={styles.subtitle}>Les choix ne limiteront pas votre expérience</Text>
        </View>

        <View style={styles.themesGrid}>
          {themes.map((theme) => (
            <TouchableOpacity
              key={theme}
              style={[
                styles.themeButton,
                selectedThemes.includes(theme) && styles.themeButtonSelected
              ]}
              onPress={() => toggleTheme(theme)}
            >
              <Text style={[
                styles.themeButtonText,
                selectedThemes.includes(theme) && styles.themeButtonTextSelected
              ]}>
                {theme}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onPrev}>
            <Text style={styles.backButtonText}>Précédent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.nextButton, selectedThemes.length === 0 && styles.nextButtonDisabled]} 
            onPress={handleNext}
            disabled={selectedThemes.length === 0}
          >
            <Text style={styles.nextButtonText}>Continuer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  progressBar: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingTop: 20,
    gap: 8,
  },
  progressStep: {
    flex: 1,
    height: 13,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  progressStepActive: {
    backgroundColor: '#7376FF',
    shadowColor: '#7376FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    paddingTop: 70,
    paddingBottom: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#7476FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 8,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeButton: {
    width: '30%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  themeButtonSelected: {
    backgroundColor: '#7376FF',
    borderColor: '#7376FF',
    borderRadius: 12,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  themeButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  backButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  nextButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#7376FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
