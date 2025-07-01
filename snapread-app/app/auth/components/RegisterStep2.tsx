import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RegisterStep2Props {
    onNext: (data: { age: string; genre: string }) => void;
    onPrev: () => void;
    userData?: { age?: string; genre?: string };
}

export default function RegisterStep2({ onNext, onPrev, userData }: RegisterStep2Props) {
    const [selectedAge, setSelectedAge] = useState(userData?.age || '25-34');
    const [selectedGenre, setSelectedGenre] = useState(userData?.genre || 'homme');

    const handleNext = () => {
        if (selectedAge && selectedGenre) {
            onNext({ age: selectedAge, genre: selectedGenre });
        } else {
            alert('Veuillez sélectionner votre tranche d\'âge et votre genre');
        }
    };

    const ageRanges = [
        { label: 'Âge 18-24', value: '18-24' },
        { label: 'Âge 25-34', value: '25-34' },
        { label: 'Âge 35-44', value: '35-44' },
        { label: 'Âge 45+', value: '45+' }
    ];

    const genres = [
        { label: 'Homme', value: 'homme', icon: '👨' },
        { label: 'Femme', value: 'femme', icon: '👩' },
        { label: 'Autre', value: 'autre', icon: '👤' }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressBar}>
                <View style={[styles.progressStep, styles.progressStepActive]} />
                <View style={styles.progressStep} />
                <View style={styles.progressStep} />
                <View style={styles.progressStep} />
                <View style={styles.progressStep} />
            </View>

            <View style={styles.header}>
                <Text style={styles.appTitle}>SnapRead</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Devenez la personne</Text>
                    <Text style={styles.title}>la plus intéressante de la pièce</Text>
                    <Text style={styles.subtitle}> </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tranche d&apos;âge</Text>
                    <View style={styles.ageGrid}>
                        {ageRanges.map((ageRange) => (
                            <TouchableOpacity
                                key={ageRange.value}
                                style={[
                                    styles.ageButton,
                                    selectedAge === ageRange.value && styles.ageButtonSelected
                                ]}
                                onPress={() => setSelectedAge(ageRange.value)}
                            >
                                <Text style={[
                                    styles.ageButtonText,
                                    selectedAge === ageRange.value && styles.ageButtonTextSelected
                                ]}>
                                    {ageRange.label} →
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Genre</Text>
                    <View style={styles.genreContainer}>
                        {genres.map((genre) => (
                            <TouchableOpacity
                                key={genre.value}
                                style={[
                                    styles.genreButton,
                                    selectedGenre === genre.value && styles.genreButtonSelected
                                ]}
                                onPress={() => setSelectedGenre(genre.value)}
                            >
                                <Text style={styles.genreIcon}>{genre.icon}</Text>
                                <Text style={[
                                    styles.genreButtonText,
                                    selectedGenre === genre.value && styles.genreButtonTextSelected
                                ]}>
                                    {genre.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={onPrev}>
                        <Text style={styles.backButtonText}>Précedent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.nextButton, (!selectedAge || !selectedGenre) && styles.nextButtonDisabled]} 
                        onPress={handleNext}
                        disabled={!selectedAge || !selectedGenre}
                    >
                        <Text style={styles.nextButtonText}>Suivant</Text>
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        lineHeight: 30,
    },
    titleContainer: {
        marginBottom: 30,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#6366f1',
        marginTop: 8,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    ageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    ageButton: {
        width: '47%',
        height: 80,
        backgroundColor: '#f0f0ff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    ageButtonSelected: {
        backgroundColor: '#7376FF',
        borderColor: '#7376FF',
    },
    ageButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#7376FF',
    },
    ageButtonTextSelected: {
        color: '#fff',
    },
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    genreButton: {
        width: '30%',
        height: 60,
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    genreButtonSelected: {
        backgroundColor: '#fff',
        borderColor: '#7376FF',
    },
    genreIcon: {
        fontSize: 24,
    },
    genreButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    genreButtonTextSelected: {
        color: '#7376FF',
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