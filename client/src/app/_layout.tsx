import React from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ImageBackground
      source={require('../../assets/images/background.png')} // Or { uri: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092' }
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Home' }} />
        </Stack>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});