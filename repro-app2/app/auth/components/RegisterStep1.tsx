import React, { useState } from 'react';
import { SafeAreaView ,View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface RegisterStep1Props {
    onNext: (data: { username: string; email: string; password: string }) => void;
}

export default function RegisterStep1({ onNext }: RegisterStep1Props) {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleNext = () => {
        if (username && email && password && confirmPassword) {
            if (password === confirmPassword) {
                onNext({ username, email, password });
            } else {
                alert('Passwords do not match');
            }
        } else {
            alert('Please fill in all fields');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Register - Step 1</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button title="Previous" onPress={() => router.back()} />
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
