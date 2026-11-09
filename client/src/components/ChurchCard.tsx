import React, { useState } from 'react';
import {
  Share,
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
  onEditFeedback?: (id: string, index: number, newFeedback: string) => void;
  onDeleteFeedback?: (id: string, index: number) => void;
}

export const ChurchCard: React.FC<ChurchCardProps> = ({
  church,
  isFavorite,
  onToggleFavorite,
  onAddFeedback,
  onEditFeedback,
  onDeleteFeedback,
}) => {
  const [feedbackInput, setFeedbackInput] = useState('');
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  const [editingIndex, setEditingIndex] = useState<number | null>(null); // which comment is being edited
  const [editInput, setEditInput] = useState('');

  const handleFeedbackSubmit = () => {
    if (feedbackInput.trim()) {
      onAddFeedback(church.id, feedbackInput.trim());
      setFeedbackInput('');
      setShowFeedbackInput(false);
    }
  };

  
  const startEditing = (index: number, text: string) => {
    setEditingIndex(index);
    setEditInput(text);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditInput('');
  };

  const handleEditSave = () => {
    if (editingIndex !== null && editInput.trim()) {
      onEditFeedback?.(church.id, editingIndex, editInput.trim());
      cancelEditing();
    }
  };

  const handleDelete = (index: number) => {
    onDeleteFeedback?.(church.id, index);
    cancelEditing();
  };

  const handleShare = async () => {
    const message = `${church.name} — ${church.denomination} • ${church.worshipStyle}\n` +
      `${church.address}, ${church.city}, ${church.state} ${church.zipcode}\n` +
      `Service times: ${church.serviceTimes}\n` +
      `${church.description}`;

    try {
      await Share.share({ message });
    } catch (error) {
      // User dismissed the share sheet; nothing to do.
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
        <View style={styles.headerActions}>
          <TouchableOpacity
            testID={`share-button-${church.id}`}
            style={styles.shareBtn}
            onPress={handleShare}
          >
            <Text style={styles.shareText}>↗ Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID={`favorite-button-${church.id}`}
            style={[styles.favoriteBtn, isFavorite && styles.favoriteBtnActive]}
            onPress={() => onToggleFavorite(church.id)}
          >
            <Text style={styles.favoriteText}>{isFavorite ? '★ Saved' : '☆ Save'}</Text>
          </TouchableOpacity>
        </View>
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
                   church.userFeedback.map((fb, idx) =>
            editingIndex === idx ? (
              <View key={idx} style={styles.feedbackInputRow}>
                <TextInput
                  style={styles.feedbackInput}
                  value={editInput}
                  onChangeText={setEditInput}
                  testID={`edit-input-${church.id}`}
                />
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={handleEditSave}
                  testID={`save-edit-${church.id}`}
                >
                  <Text style={styles.addBtnText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={cancelEditing}
                  testID={`cancel-edit-${church.id}`}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View key={idx} style={styles.feedbackRow}>
                <Text style={styles.feedbackText}>• {fb}</Text>
                {onEditFeedback && (
                  <TouchableOpacity
                    onPress={() => startEditing(idx, fb)}
                    testID={`edit-feedback-${church.id}-${idx}`}
                  >
                    <Text style={styles.feedbackActionText}>Edit</Text>
                  </TouchableOpacity>
                )}
                {onDeleteFeedback && (
                  <TouchableOpacity
                    onPress={() => handleDelete(idx)}
                    testID={`delete-feedback-${church.id}-${idx}`}
                  >
                    <Text style={styles.feedbackDeleteText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          ) 
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
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  denomination: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  shareBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  shareText: { fontSize: 12, fontWeight: 'bold', color: '#4338ca' },
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

  feedbackRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  feedbackText: { flex: 1, fontSize: 12, color: '#4b5563' },
  feedbackActionText: { fontSize: 12, color: '#2563eb', fontWeight: '600', marginLeft: 8 },
  feedbackDeleteText: { fontSize: 12, color: '#dc2626', fontWeight: '600', marginLeft: 8 },
  cancelBtn: { paddingHorizontal: 10, paddingVertical: 6, marginLeft: 6 },
  cancelBtnText: { color: '#6b7280', fontSize: 12, fontWeight: 'bold' },
});