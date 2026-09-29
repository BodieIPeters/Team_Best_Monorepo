import React from 'react';
import { StyleSheet, ImageBackground, View, Platform } from 'react-native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  // Gracefully handle image resolution across directory levels
  let backgroundImage;
  try {
    backgroundImage = require('../../assets/images/background.png');
  } catch (e) {
    // Fallback if image path does not exist in assets
    backgroundImage = null;
  }

  const renderContent = () => (
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
  );

  if (backgroundImage) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        resizeMode="cover"
      >
        {renderContent()}
      </ImageBackground>
    );
  }

  return <View style={styles.background}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f6f8',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});