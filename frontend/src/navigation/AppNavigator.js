import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import ShowScreen from '../screens/ShowScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ShowTimeScreen from '../screens/ShowTimeScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Θέατρα' }} />
      <Stack.Screen name="Shows" component={ShowScreen} options={{ title: 'Παραστάσεις' }} />
      <Stack.Screen name="Showtimes" component={ShowTimeScreen} options={{ title: 'Ώρες παράστασης' }} />
      <Stack.Screen name="Seats" component={SeatSelectionScreen} options={{ title: 'Επιλογή θέσης' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Οι κρατήσεις μου' }} />

      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{
          title: 'Επιβεβαίωση',
          gestureEnabled: false,
          headerBackVisible: false,
        }}
        
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primaryLight} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },

  
});