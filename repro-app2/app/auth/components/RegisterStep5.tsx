import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RegisterStep5Props {
  onNext: (data: { rythme: string }) => void;
  onPrev: () => void;
  userData?: { rythme?: string };
}

export default function RegisterStep5({ onNext, onPrev, userData }: RegisterStep5Props) {
  const [selectedRythme, setSelectedRythme] = useState(userData?.rythme || 'tranquille');

  const rythmes = [
    { label: 'Tranquille', value: 'tranquille', duration: '15min / jours', color: '#4CAF50' },
    { label: 'Modéré', value: 'modere', duration: '30min / jours', color: '#FFC107' },
    { label: 'Rapide', value: 'rapide', duration: '45min / jours', color: '#FF9800' },
    { label: 'Intense', value: 'intense', duration: '1h+ / jours', color: '#F44336' }
  ];

  const handleNext = () => {
    onNext({ rythme: selectedRythme });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={[styles.progressStep, styles.progressStepActive]} />
        <View style={styles.progressStep} />
      </View>

      <View style={styles.header}>
        <Text style={styles.appTitle}>SnapRead</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choisissez votre rythme</Text>
          <Text style={styles.title}>de travail quotidien</Text>
        </View>

        <View style={styles.rythmesContainer}>
          {rythmes.map((rythme) => (
            <TouchableOpacity
              key={rythme.value}
              style={[
                styles.rythmeButton,
                selectedRythme === rythme.value && styles.rythmeButtonSelected
              ]}
              onPress={() => setSelectedRythme(rythme.value)}
            >
              <View style={styles.rythmeContent}>
                <View style={[styles.colorDot, { backgroundColor: rythme.color }]} />
                <Text style={[
                  styles.rythmeLabel,
                  selectedRythme === rythme.value && styles.rythmeLabelSelected
                ]}>
                  {rythme.label}
                </Text>
              </View>
              <Text style={[
                styles.rythmeDuration,
                selectedRythme === rythme.value && styles.rythmeDurationSelected
              ]}>
                {rythme.duration}
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
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
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
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    lineHeight: 32,
  },
  rythmesContainer: {
    gap: 16,
  },
  rythmeButton: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  rythmeButtonSelected: {
    backgroundColor: '#e8e7ff',
    borderColor: '#7376FF',
  },
  rythmeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 16,
  },
  rythmeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  rythmeLabelSelected: {
    color: '#333',
    fontWeight: 'bold',
  },
  rythmeDuration: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  rythmeDurationSelected: {
    color: '#666',
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
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
