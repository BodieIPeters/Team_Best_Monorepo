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

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [churches, setChurches] = useState<Church[]>(MOCK_CHURCHES);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const handleAuth = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setSearchQuery('');
    setShowOnlyFavorites(false);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleAddFeedback = (id: string, newFeedback: string) => {
    setChurches((prevChurches) =>
      prevChurches.map((church) =>
        church.id === id
          ? { ...church, userFeedback: [...church.userFeedback, newFeedback] }
          : church
      )
    );
  };

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

  // PAGE 2: CHURCH DIRECTORY, SEARCH, & FAVORITES (User Stories 2 & 3)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

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