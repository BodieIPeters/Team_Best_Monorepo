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
  };

  const filteredChurches = MOCK_CHURCHES.filter((church) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      church.name.toLowerCase().includes(query) ||
      church.zipcode.includes(query)
    );
  });

  // PAGE 1: LANDING & LOGIN / REGISTER
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
            >
              <Text style={!isRegistering ? styles.activeTabText : styles.tabText}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, isRegistering && styles.activeTab]}
              onPress={() => setIsRegistering(true)}
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
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>
              {isRegistering ? 'Register & Continue' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // PAGE 2: CHURCH DIRECTORY & SEARCH
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
        />
      </View>

      <FlatList
        data={filteredChurches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No churches found matching "{searchQuery}".
          </Text>
        }
        renderItem={({ item }: { item: Church }) => <ChurchCard church={item} />}
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
  tabContainer: { flexDirection: 'row', marginVertical: 16, borderBottomWidth: 1, borderColor: '#ddd' },
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
  button: { backgroundColor: '#1e3a8a', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  welcomeText: { fontSize: 16, fontWeight: '600', color: '#333' },
  logoutBtn: { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
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
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  emptyText: { textAlign: 'center', marginTop: 24, color: '#888', fontStyle: 'italic' },
});