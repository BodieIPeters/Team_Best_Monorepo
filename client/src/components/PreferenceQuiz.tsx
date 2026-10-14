/**
 * Preference quiz screen (SRS User Story 3).
 *
 * Layout follows the "Church Quiz" sketch in docs/UI_MODEL.md: numbered
 * questions, each with radio-button options, and a Submit button. The
 * questions themselves come from constants/quizQuestions.ts, so this
 * component never needs to change when the questions do.
 *
 * This component only collects answers. It does not decide what happens next:
 * it hands the answers to `onSubmit` (or calls `onSkip`), and the parent
 * screen (app/index.tsx) decides where to navigate.
 */
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QUIZ_QUESTIONS, QuizAnswers } from '@/constants/quizQuestions';

interface PreferenceQuizProps {
  /** Called with a complete set of answers when the student presses Submit. */
  onSubmit: (answers: QuizAnswers) => void;
  /** Called when the student chooses "Skip for now" (SRS User Story 2: try before committing). */
  onSkip: () => void;
}

export const PreferenceQuiz: React.FC<PreferenceQuizProps> = ({ onSubmit, onSkip }) => {
  // Partial because answers fill in one question at a time; a missing key = not answered yet.
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  // Submit is only enabled once every question has an answer ("No preference" counts).
  const allAnswered = QUIZ_QUESTIONS.every((q) => answers[q.id] !== undefined);

  const selectOption = (questionId: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    // The button is disabled until allAnswered, but guard anyway in case it is pressed early.
    if (allAnswered) {
      // Safe cast: allAnswered guarantees every QuizAnswers field is filled in.
      onSubmit(answers as QuizAnswers);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Church Quiz</Text>
      <Text style={styles.subtitle}>
        Answer three quick questions and we&apos;ll recommend churches that fit you.
      </Text>

      {QUIZ_QUESTIONS.map((question, index) => (
        <View key={question.id} style={styles.questionBlock} accessibilityRole="radiogroup">
          <Text style={styles.prompt}>
            Q{index + 1}) {question.prompt}
          </Text>
          {question.options.map((option) => {
            const selected = answers[question.id] === option.value;
            // testID format `option-<questionId>-<value>` is what the tests press, e.g. option-maxDistance-5.
            return (
              <TouchableOpacity
                key={option.value}
                style={styles.optionRow}
                onPress={() => selectOption(question.id, option.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                testID={`option-${question.id}-${option.value}`}
              >
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Grayed out and disabled until every question is answered; the hint below explains why. */}
      <TouchableOpacity
        style={[styles.submitBtn, !allAnswered && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={!allAnswered}
        accessibilityState={{ disabled: !allAnswered }}
        testID="btn-submit-quiz"
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
      {!allAnswered && (
        <Text style={styles.hint}>Answer all three questions to see your recommendations.</Text>
      )}

      <TouchableOpacity style={styles.skipBtn} onPress={onSkip} testID="btn-skip-quiz">
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 16 },
  questionBlock: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  prompt: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 8 },
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9ca3af',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: { borderColor: '#1e3a8a' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1e3a8a' },
  optionText: { fontSize: 14, color: '#374151' },
  optionTextSelected: { color: '#1e3a8a', fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#1e3a8a',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnDisabled: { backgroundColor: '#9ca3af' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  hint: { fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 6 },
  skipBtn: { alignItems: 'center', marginTop: 14, padding: 8 },
  skipText: { color: '#2563eb', fontWeight: '600', fontSize: 14 },
});
