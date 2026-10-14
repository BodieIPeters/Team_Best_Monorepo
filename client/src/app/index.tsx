
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert
} from "react-native";

import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  type Item
} from "../api/items";

export default function HomeScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Retrieve data from server
  async function loadItems() {
    try {
      setLoading(true);
      setError("");

      const data = await getItems();
      setItems(data);
    } catch (err) {
      setError("Unable to connect to the server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  // Add item
  async function handleAddItem() {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    try {
      const newItem = await createItem({
        name,
        description
      });

      setItems((current) => [...current, newItem]);

      setName("");
      setDescription("");
    } catch (err) {
      Alert.alert("Error", "Could not add item");
    }
  }

  // Update item
  async function handleUpdateItem(item: Item) {
    try {
      const updated = await updateItem(item.id, {
        name: `${item.name} Updated`,
        description: item.description
      });

      setItems((current) =>
        current.map((existing) =>
          existing.id === item.id ? updated : existing
        )
      );
    } catch (err) {
      Alert.alert("Error", "Could not update item");
    }
  }

  // Delete item
  async function handleDeleteItem(id: number) {
    try {
      await deleteItem(id);

      setItems((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (err) {
      Alert.alert("Error", "Could not delete item");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        SC2 REST API Client
      </Text>

      <Text style={styles.subtitle}>
        Items retrieved from the Express server
      </Text>

      {/* Add new item */}
      <TextInput
        style={styles.input}
        placeholder="Item name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddItem}
      >
        <Text style={styles.buttonText}>
          Add Item
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" />
      )}

      {error !== "" && (
        <Text style={styles.error}>{error}</Text>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.itemName}>
              {item.name}
            </Text>

            <Text>{item.description}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => handleUpdateItem(item)}
              >
                <Text style={styles.buttonText}>
                  Update
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(item.id)}
              >
                <Text style={styles.buttonText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#FFFFFF"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  addButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#F3F4F6",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10
  },
  updateButton: {
    backgroundColor: "#059669",
    padding: 10,
    borderRadius: 6
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    padding: 10,
    borderRadius: 6
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold"
  },
  error: {
    color: "red",
    marginBottom: 10
  }
});
