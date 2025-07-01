import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: 'Redirection' 
        }} 
      />
      <Stack.Screen 
        name="RegisterScreen" 
        options={{ 
          headerShown: false,
          title: 'Inscription' 
        }} 
      />
      <Stack.Screen 
        name="LoginScreen" 
        options={{ 
          headerShown: false,
          title: 'Connexion' 
        }} 
      />
    </Stack>
  );
}
