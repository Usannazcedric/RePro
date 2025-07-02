import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
// @ts-ignore
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
    const [usernameFocused, setUsernameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

    const handleNext = () => {
        if (username && email && password && confirmPassword) {
            if (password === confirmPassword) {
                onNext({ username, email, password });
            } else {
                alert('Les mots de passe ne correspondent pas');
            }
        } else {
            alert('Veuillez remplir tous les champs');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.appTitle}>SnapRead</Text>
                <Text style={styles.title}>Bienvenue ! Créer votre compte pour vous lancer</Text>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nom d&apos;utilisateur</Text>
                    <TextInput
                        style={[styles.input, usernameFocused && styles.inputFocused]}
                        placeholder="Gab1"
                        value={username}
                        onChangeText={setUsername}
                        onFocus={() => setUsernameFocused(true)}
                        onBlur={() => setUsernameFocused(false)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, emailFocused && styles.inputFocused]}
                        placeholder=""
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputContainer, styles.halfWidth]}>
                        <Text style={styles.label}>Mot de passe</Text>
                        <TextInput
                            style={[styles.input, passwordFocused && styles.inputFocused]}
                            placeholder=""
                            value={password}
                            onChangeText={setPassword}
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            secureTextEntry
                        />
                    </View>
                    
                    <View style={[styles.inputContainer, styles.halfWidth]}>
                        <Text style={styles.label}>Confirmer</Text>
                        <TextInput
                            style={[styles.input, confirmPasswordFocused && styles.inputFocused]}
                            placeholder=""
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            onFocus={() => setConfirmPasswordFocused(true)}
                            onBlur={() => setConfirmPasswordFocused(false)}
                            secureTextEntry
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.createButton} onPress={handleNext}>
                    <Text style={styles.createButtonText}>Créer mon compte</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OU</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity style={styles.googleButton}>
                    <Image 
                        source={require('../../../assets/images/google.png')} 
                        style={styles.googleIcon}
                    />
                    <Text style={styles.googleButtonText}>Continuer avec Google</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/auth/LoginScreen')}>
                    <Text style={styles.loginLink}>Déjà un compte ? <Text style={styles.loginLinkBlue}>Se connecter</Text></Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 40,
        paddingTop: 60,
        paddingBottom: 30,
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
        lineHeight: 28,
    },
    appTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
        color: '#7476FF',
    },
    inputContainer: {
        marginBottom: 18,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 7,
        color: '#333',
    },
    input: {
        height: 48,
        borderWidth: 0,
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 15,
        backgroundColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
    },
    inputFocused: {
        borderWidth: 2,
        borderColor: '#7376FF',
        backgroundColor: '#fff',
        shadowColor: '#7376FF',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    createButton: {
        backgroundColor: '#7476FF',
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
        // marginBottom: 18,
    },
    createButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 18,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        marginHorizontal: 15,
        color: '#666',
        fontSize: 13,
    },
    googleButton: {
        height: 48,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e8e8e8',
        marginBottom: 18 + 18,
        gap: 12,
    },
    googleIcon: {
        width: 20,
        height: 20,
    },
    googleButtonText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    loginLink: {
        textAlign: 'center',
        fontSize: 13,
        color: '#666',
        marginBottom: 25,
    },
    loginLinkBlue: {
        color: '#7476FF',
        fontWeight: '500',
    },
});