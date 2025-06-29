import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface RegisterStep2Props {
    onNext: (data: { age: string; genre: string }) => void;
    onPrev: () => void;
    userData?: { age?: string; genre?: string };
}

export default function RegisterStep2({ onNext, onPrev, userData }: RegisterStep2Props) {
    const [age, setAge] = useState(userData?.age || '');
    const [genre, setGenre] = useState(userData?.genre || '');

    const handleNext = () => {
        if (age && genre) {
            onNext({ age, genre });
        } else {
            alert('Veuillez remplir tous les champs');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Register - Step 2</Text>
            <TextInput
                style={styles.input}
                placeholder="Age"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Genre (ex: Femme, Homme, Non-binaire...)"
                value={genre}
                onChangeText={setGenre}
            />
            <View style={styles.buttonContainer}>
                <Button title="Previous" onPress={onPrev} />
                <Button title="Next" onPress={handleNext} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        marginTop: 50,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
});
