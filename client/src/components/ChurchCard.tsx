import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Church } from '@/constants/mockChurches';

interface Props {
  church: Church;
}

export const ChurchCard: React.FC<Props> = ({ church }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{church.name}</Text>
      <Text style={styles.denomination}>{church.denomination}</Text>
      <Text style={styles.details}>
        📍 {church.address}, {church.city}, {church.state} {church.zipcode}
      </Text>
      <Text style={styles.details}>
        🕒 Services: {church.serviceTimes}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  denomination: { fontSize: 14, fontWeight: '600', color: '#4b5563', marginVertical: 4 },
  details: { fontSize: 13, color: '#555', marginTop: 2 },
});