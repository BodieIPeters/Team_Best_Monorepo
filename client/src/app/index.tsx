/**
 * Home route ("/") for Church Match. This one component drives the whole
 * signed-in flow by switching what it renders based on state:
 *
 *   not signed in -> Sign In / Register card
 *   signed in     -> 'quiz'      : PreferenceQuiz        (SRS User Story 3)
 *                    'results'   : QuizResults           (SRS User Story 4)
 *                    'directory' : searchable church list with favorites + feedback
 *
 * Flow: sign in -> quiz -> (Submit) results -> (Return Home) directory.
 *       "Skip for now" on the quiz goes straight to the directory.
 *
 * NOTE: there is no backend yet. Churches come from constants/mockChurches.ts,
 * sign-in accepts any non-empty username, and favorites, feedback and quiz
 * answers live only in React state, so they reset when the app reloads.
 */
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MOCK_CHURCHES, Church } from '@/constants/mockChurches';
import { ChurchCard } from '@/components/ChurchCard';
import { PreferenceQuiz } from '@/components/PreferenceQuiz';
import { QuizResults } from '@/components/QuizResults';
import { QuizAnswers } from '@/constants/quizQuestions';
import { recommendChurches } from '@/utils/recommendChurches';

/** Which page a signed-in student is on. Sign-in (and every re-sign-in) starts at 'quiz'. */
type Screen = 'quiz' | 'results' | 'directory';

export default function HomeScreen() {
  // --- Sign-in state ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // which auth tab is active
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // not checked yet: no backend

  // --- Church data, shared by the results and directory screens ---
  // Held in state (not read straight from MOCK_CHURCHES) so new feedback can be added to it.
  const [churches, setChurches] = useState<Church[]>(MOCK_CHURCHES);
  const [favorites, setFavorites] = useState<string[]>([]); // IDs of saved churches

  // --- Directory filters ---
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // --- Quiz flow ---
  const [screen, setScreen] = useState<Screen>('quiz');
  // null until the quiz is submitted; skipping the quiz leaves it null.
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);

  /** Signs the student in (placeholder: any non-empty username works) and opens the quiz. */
  const handleAuth = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
      setScreen('quiz');
    }
  };

  /**
   * Signs out and clears this student's session, so the next person on a
   * shared device starts fresh at the quiz (SRS User Story 24).
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setSearchQuery('');
    setShowOnlyFavorites(false);
    setScreen('quiz');
    setQuizAnswers(null);
  };

  /** Saves the submitted quiz answers and shows the results screen. */
  const handleQuizSubmit = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setScreen('results');
  };

  /** Saves a church if it isn't saved yet, or removes it if it is (SRS User Stories 13 & 14). */
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  /** Appends a feedback comment to one church (SRS User Story 18). */
  const handleAddFeedback = (id: string, newFeedback: string) => {
    setChurches((prevChurches) =>
      prevChurches.map((church) =>
        church.id === id
          ? { ...church, userFeedback: [...church.userFeedback, newFeedback] }
          : church
      )
    );
  };

  /**
   * Churches shown in the directory: must match the search box (by name or ZIP)
   * and, if "Filter Favorites" is on, be saved. An empty search matches everything.
   */
  const filteredChurches = churches.filter((church) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      church.name.toLowerCase().includes(query) || church.zipcode.includes(query);
    const matchesFavorite = showOnlyFavorites ? favorites.includes(church.id) : true;
    return matchesSearch && matchesFavorite;
  });

  // PAGE 1: LANDING & LOGIN / REGISTER (User Story 1)
  if (!isLoggedIn) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.authCard}>
          <Text style={styles.title}>Find Your Community</Text>
          <Text style={styles.subtitle}>
            Connect with local churches across Grand Rapids, MI.
          </Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, !isRegistering && styles.activeTab]}
              onPress={() => setIsRegistering(false)}
              testID="tab-signin"
            >
              <Text style={!isRegistering ? styles.activeTabText : styles.tabText}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, isRegistering && styles.activeTab]}
              onPress={() => setIsRegistering(true)}
              testID="tab-register"
            >
              <Text style={isRegistering ? styles.activeTabText : styles.tabText}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            testID="input-username"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            testID="input-password"
          />

          <TouchableOpacity style={styles.button} onPress={handleAuth} testID="btn-auth">
            <Text style={styles.buttonText}>
              {isRegistering ? 'Register & Continue' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Welcome + Log Out bar, shared by all three signed-in screens.
  const headerBar = (
    <View style={styles.headerBar}>
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );

  // PREFERENCE QUIZ (SRS User Story 3)
  if (screen === 'quiz') {
    return (
      <SafeAreaView style={styles.container}>
        {headerBar}
        <PreferenceQuiz
          onSubmit={handleQuizSubmit}
          onSkip={() => setScreen('directory')}
        />
      </SafeAreaView>
    );
  }

  // RECOMMENDED CHURCHES (SRS User Story 4).
  // Recomputed from the live `churches` state so feedback left here appears right away.
  // Without quizAnswers (shouldn't happen) this falls through to the directory.
  if (screen === 'results' && quizAnswers) {
    const { churches: recommendations, exactMatch } = recommendChurches(churches, quizAnswers);
    return (
      <SafeAreaView style={styles.container}>
        {headerBar}
        <QuizResults
          recommendations={recommendations}
          exactMatch={exactMatch}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onAddFeedback={handleAddFeedback}
          onReturnHome={() => setScreen('directory')}
        />
      </SafeAreaView>
    );
  }

  // PAGE 2: CHURCH DIRECTORY, SEARCH, & FAVORITES (User Stories 2 & 3)
  return (
    <SafeAreaView style={styles.container}>
      {headerBar}

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by church name or ZIP code..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          testID="input-search"
        />

        <TouchableOpacity
          style={[styles.filterBtn, showOnlyFavorites && styles.filterBtnActive]}
          onPress={() => setShowOnlyFavorites((prev) => !prev)}
          testID="btn-toggle-favorites"
        >
          <Text
            style={[styles.filterBtnText, showOnlyFavorites && styles.filterBtnTextActive]}
          >
            {showOnlyFavorites ? 'Showing Favorites ★' : 'Filter Favorites'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredChurches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No churches found matching your criteria.
          </Text>
        }
        renderItem={({ item }: { item: Church }) => (
          <ChurchCard
            church={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFavorite={toggleFavorite}
            onAddFeedback={handleAddFeedback}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  authCard: {
    margin: 20,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 'auto',
    marginBottom: 'auto',
    elevation: 3,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginVertical: 8 },
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderColor: '#1e3a8a' },
  tabText: { color: '#666', fontWeight: '600' },
  activeTabText: { color: '#1e3a8a', fontWeight: 'bold' },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1e3a8a',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  welcomeText: { fontSize: 16, fontWeight: '600', color: '#333' },
  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  searchContainer: { padding: 16 },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
  },
  filterBtn: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
    alignSelf: 'flex-start',
  },
  filterBtnActive: { backgroundColor: '#fef3c7', borderWidth: 1, borderColor: '#f59e0b' },
  filterBtnText: { color: '#374151', fontSize: 13, fontWeight: '600' },
  filterBtnTextActive: { color: '#d97706' },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  emptyText: { textAlign: 'center', marginTop: 24, color: '#888', fontStyle: 'italic' },
});