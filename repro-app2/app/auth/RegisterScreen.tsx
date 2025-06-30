import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import RegisterStep1 from './components/RegisterStep1';
import RegisterStep2 from './components/RegisterStep2';
import RegisterStep3 from './components/RegisterStep3';
import RegisterStep4 from './components/RegisterStep4';
import RegisterStep5 from './components/RegisterStep5';
import RegisterSubmit from './components/RegisterSubmit';

interface UserData {
    username?: string;
    email?: string;
    genre?: string;
    age?: string;
    theme?: string;
    raison?: string;
    rythme?: string;
    password?: string;
}

const RegisterScreen = () => {
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState<UserData>({});

    const nextStep = (data?: any) => {
        if (data) {
            setUserData(prev => ({ ...prev, ...data }));
        }
        setStep((prevStep) => prevStep + 1);
    };

    const prevStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = () => {
        // Ici tu peux envoyer userData à ton backend ou à Supabase
        console.log('Données soumises :', userData);
        // Redirection ou message de succès à ajouter ici
    };

    return (
        <View style={styles.container}>
            {step === 1 && <RegisterStep1 onNext={nextStep} />}
            {step === 2 && <RegisterStep2 onNext={nextStep} onPrev={prevStep} userData={userData} />}
            {step === 3 && <RegisterStep3 onNext={nextStep} onPrev={prevStep} userData={userData} />}
            {step === 4 && <RegisterStep4 onNext={nextStep} onPrev={prevStep} userData={userData} />}
            {step === 5 && <RegisterStep5 onNext={nextStep} onPrev={prevStep} userData={userData} />}
            {step === 6 && <RegisterSubmit userData={userData} onPrev={prevStep} onSubmit={handleSubmit} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default RegisterScreen;