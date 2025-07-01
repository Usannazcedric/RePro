import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RegisterStep4Props {
  onNext: (data: { raisons: string[] }) => void;
  onPrev: () => void;
  userData?: { raisons?: string[] };
}

export default function RegisterStep4({ onNext, onPrev, userData }: RegisterStep4Props) {
  const [selectedRaisons, setSelectedRaisons] = useState<string[]>(userData?.raisons || ['Obtenir une promotion']);

  const raisons = [
    { label: 'Obtenir une promotion', icon: '💡', value: 'promotion' },
    { label: 'Devenir entrepreneur', icon: '🚀', value: 'entrepreneur' },
    { label: 'Améliorer sa communication', icon: '📢', value: 'communication' },
    { label: 'Changer de carrière ou se reconvertir', icon: '💼', value: 'reconversion' },
    { label: 'Atteindre un objectif financier', icon: '💰', value: 'financier' },
    { label: 'Monter en compétences numériques', icon: '👨‍💻', value: 'numerique' }
  ];

  const toggleRaison = (value: string) => {
    setSelectedRaisons(prev => 
      prev.includes(value) 
        ? prev.filter(r => r !== value)
        : [...prev, value]
    );
  };

  const handleNext = () => {
    if (selectedRaisons.length > 0) {
      onNext({ raisons: selectedRaisons });
    } else {
      alert('Veuillez sélectionner au moins une raison');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={styles.progressStep} />
        <View style={styles.progressStep} />
      </View>

      <View style={styles.header}>
        <Text style={styles.appTitle}>SnapRead</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Quelles sont les raisons</Text>
          <Text style={styles.title}>de votre apprentissage ?</Text>
        </View>

        <View style={styles.raisonsContainer}>
          {raisons.map((raison) => (
            <TouchableOpacity
              key={raison.value}
              style={[
                styles.raisonButton,
                selectedRaisons.includes(raison.value) && styles.raisonButtonSelected
              ]}
              onPress={() => toggleRaison(raison.value)}
            >
              <View style={styles.raisonContent}>
                <Text style={styles.raisonIcon}>{raison.icon}</Text>
                <Text style={[
                  styles.raisonText,
                  selectedRaisons.includes(raison.value) && styles.raisonTextSelected
                ]}>
                  {raison.label}
                </Text>
              </View>
              <View style={[
                styles.checkbox,
                selectedRaisons.includes(raison.value) && styles.checkboxSelected
              ]}>
                {selectedRaisons.includes(raison.value) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
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
            style={[styles.nextButton, selectedRaisons.length === 0 && styles.nextButtonDisabled]} 
            onPress={handleNext}
            disabled={selectedRaisons.length === 0}
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
    paddingBottom: 40,
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
  raisonsContainer: {
    gap: 12,
  },
  raisonButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  raisonButtonSelected: {
    backgroundColor: '#e8e7ff',
    borderColor: '#7376FF',
  },
  raisonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  raisonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  raisonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  raisonTextSelected: {
    color: '#333',
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#7376FF',
    borderColor: '#7376FF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
