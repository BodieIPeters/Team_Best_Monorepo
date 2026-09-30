import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Church } from '@/constants/mockChurches';

interface ChurchCardProps {
  church: Church;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddFeedback: (id: string, feedback: string) => void;
}

export const ChurchCard: React.FC<ChurchCardProps> = ({
  church,
  isFavorite,
  onToggleFavorite,
  onAddFeedback,
}) => {
  const [feedbackInput, setFeedbackInput] = useState('');
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  const handleFeedbackSubmit = () => {
    if (feedbackInput.trim()) {
      onAddFeedback(church.id, feedbackInput.trim());
      setFeedbackInput('');
      setShowFeedbackInput(false);
    }
  };

  return (
    <View style={styles.card} testID={`church-card-${church.id}`}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{church.name}</Text>
          <Text style={styles.denomination}>
            {church.denomination} • {church.worshipStyle}
          </Text>
        </View>
        <TouchableOpacity
          testID={`favorite-button-${church.id}`}
          style={[styles.favoriteBtn, isFavorite && styles.favoriteBtnActive]}
          onPress={() => onToggleFavorite(church.id)}
        >
          <Text style={styles.favoriteText}>{isFavorite ? '★ Saved' : '☆ Save'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{church.description}</Text>

      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>
          📍 {church.address}, {church.zipcode} ({church.distanceMiles} mi)
        </Text>
        <Text style={styles.detailText}>⏰ {church.serviceTimes}</Text>
      </View>

      {/* User Feedback Section */}
      <View style={styles.feedbackSection}>
        <Text style={styles.feedbackTitle}>User Notes & Feedback:</Text>
        {church.userFeedback.length === 0 ? (
          <Text style={styles.emptyFeedback}>No user feedback yet.</Text>
        ) : (
          church.userFeedback.map((fb, idx) => (
            <Text key={idx} style={styles.feedbackItem}>
              • {fb}
            </Text>
          ))
        )}

        {showFeedbackInput ? (
          <View style={styles.feedbackInputRow}>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Write feedback..."
              value={feedbackInput}
              onChangeText={setFeedbackInput}
              testID={`feedback-input-${church.id}`}
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleFeedbackSubmit}
              testID={`submit-feedback-${church.id}`}
            >
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.toggleFeedbackBtn}
            onPress={() => setShowFeedbackInput(true)}
            testID={`toggle-feedback-${church.id}`}
          >
            <Text style={styles.toggleFeedbackText}>+ Leave Feedback</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: { flex: 1, paddingRight: 8 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  denomination: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  favoriteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  favoriteBtnActive: { backgroundColor: '#fef3c7', borderColor: '#f59e0b' },
  favoriteText: { fontSize: 12, fontWeight: 'bold', color: '#d97706' },
  description: { fontSize: 13, color: '#4b5563', marginBottom: 10 },
  detailsRow: {
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  detailText: { fontSize: 12, color: '#374151', marginVertical: 2 },
  feedbackSection: { borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 8 },
  feedbackTitle: { fontSize: 12, fontWeight: 'bold', color: '#4b5563', marginBottom: 4 },
  emptyFeedback: { fontSize: 12, color: '#9ca3af', fontStyle: 'italic' },
  feedbackItem: { fontSize: 12, color: '#4b5563', marginVertical: 2 },
  feedbackInputRow: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  feedbackInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    backgroundColor: '#fff',
  },
  addBtn: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  toggleFeedbackBtn: { marginTop: 6 },
  toggleFeedbackText: { fontSize: 12, color: '#2563eb', fontWeight: '600' },
});