import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// One choice in a filter row. `key` only builds the chip's testID, so it must be unique in the row.
export interface FilterOption<T> {
  label: string;
  value: T;
  key: string;
}

interface FilterChipGroupProps<T> {
  title: string;
  options: FilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
  testIDPrefix: string;
}

// A titled row of filter chips for the church directory. Exactly one chip is selected.
// Takes the row title, its options, the selected value, and onSelect, which gets the
// pressed option's value. Each chip's testID is `${testIDPrefix}-${option.key}`.
export function FilterChipGroup<T>({
  title,
  options,
  selected,
  onSelect,
  testIDPrefix,
}: FilterChipGroupProps<T>) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {/* One scrolling row per group keeps the filters short, so the church list stays visible. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <TouchableOpacity
              key={option.key}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelect(option.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              testID={`${testIDPrefix}-${option.key}`}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  chipRow: { gap: 8, paddingRight: 16 },
  chip: {
    backgroundColor: "#e5e7eb",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipSelected: { backgroundColor: "#dbeafe", borderColor: "#1e3a8a" },
  chipText: { color: "#374151", fontSize: 13, fontWeight: "600" },
  chipTextSelected: { color: "#1e3a8a" },
});
