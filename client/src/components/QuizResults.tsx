/**
 * Quiz results screen (SRS User Story 4: "see a list of suggested churches").
 *
 * Layout follows the "Results" sketch in docs/UI_MODEL.md: a list of church
 * cards, then a "Return Home" button. (The sketch's FAQs/contact button is
 * left out until there is a page for it to open.)
 *
 * This component only DISPLAYS recommendations. Which churches to show is
 * decided by utils/recommendChurches.ts and passed in from app/index.tsx.
 * Church cards reuse components/ChurchCard.tsx, so saving a favorite or
 * leaving feedback works the same here as in the directory.
 *
 * The "Update Preferences" button (SRS User Story 15: retake the quiz) lets
 * the student go back and change their answers so the suggestions update.
 */
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Church } from '@/constants/mockChurches';
import { ChurchCard } from '@/components/ChurchCard';

interface QuizResultsProps {
  /** Churches to show, already chosen by recommendChurches(). */
  recommendations: Church[];
  /** From recommendChurches(): true = exact matches, false = closest matches. Controls the note text. */
  exactMatch: boolean;
  /** IDs of saved churches. Owned by app/index.tsx so saves carry over to the directory. */
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onAddFeedback: (id: string, feedback: string) => void;
  onReturnHome: () => void;
  /** Called when the student wants to retake/update the quiz (SRS User Story 15). */
  onRetakeQuiz: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  recommendations,
  exactMatch,
  favorites,
  onToggleFavorite,
  onAddFeedback,
  onReturnHome,
  onRetakeQuiz,
}) => {
  const hasResults = recommendations.length > 0;

  return (
    <View style={styles.container}>
      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Your Recommendations</Text>
            {hasResults && (
              <Text style={styles.note} testID="results-note">
                {exactMatch
                  ? 'These churches fit everything you told us.'
                  : 'No church fit all of your answers, so here are the closest matches.'}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty} testID="results-empty">
            No churches matched your answers. Return home to browse every church.
          </Text>
        }
        renderItem={({ item }) => (
          <ChurchCard
            church={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={onToggleFavorite}
            onAddFeedback={onAddFeedback}
          />
        )}
      />
      {/* Footer sits outside the FlatList so "Return Home" stays visible while scrolling. */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.retakeBtn}
          onPress={onRetakeQuiz}
          testID="btn-retake-quiz"
        >
          <Text style={styles.retakeText}>Update Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeBtn} onPress={onReturnHome} testID="btn-return-home">
          <Text style={styles.homeText}>Return Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  header: { paddingVertical: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e3a8a' },
  note: { fontSize: 13, color: '#4b5563', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 24, color: '#888', fontStyle: 'italic' },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
    gap: 8,
  },
  retakeBtn: {
    backgroundColor: '#1e3a8a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retakeText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  homeBtn: {
    borderWidth: 1,
    borderColor: '#1e3a8a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  homeText: { color: '#1e3a8a', fontWeight: 'bold', fontSize: 15 },
});
