import React from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { QuizAnswers } from "@/constants/quizQuestions";
import { AccountDetail, describePreferences } from "@/utils/accountInfo";

export interface AccountScreenProps {
  username: string;
  quizAnswers: QuizAnswers | null; // null if the student skipped the quiz
  notificationsOn: boolean;
  onNotificationsChange: (on: boolean) => void;
  onReturnHome: () => void;
  onLogout: () => void;
}

// Account page showing the signed-in student's username, quiz answers and notification setting.
// onNotificationsChange gets the new value when the switch is flipped; onReturnHome and
// onLogout run when those buttons are pressed.
export function AccountScreen({
  username,
  quizAnswers,
  notificationsOn,
  onNotificationsChange,
  onReturnHome,
  onLogout,
}: AccountScreenProps) {
  return (
    <View style={styles.container} testID="account-screen">
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Account</Text>
        <DetailSection heading="Login" details={[{ label: "Username", value: username.trim() }]} />
        <DetailSection heading="Quiz Answers" details={describePreferences(quizAnswers)} />

        <View style={styles.card}>
          <Text style={styles.heading}>Notification Preferences</Text>
          <View style={styles.row} testID="account-row-Notifications">
            <Text style={styles.label}>Notifications</Text>
            <View style={styles.switchGroup}>
              <Text style={styles.value}>{notificationsOn ? "On" : "Off"}</Text>
              <Switch
                value={notificationsOn}
                onValueChange={onNotificationsChange}
                accessibilityLabel="Notifications"
                testID="switch-notifications"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeBtn} onPress={onReturnHome} testID="btn-account-home">
          <Text style={styles.homeText}>Return Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} testID="btn-account-logout">
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// One titled card of label/value rows.
function DetailSection({ heading, details }: { heading: string; details: AccountDetail[] }) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{heading}</Text>
      {details.map((detail) => (
        <View key={detail.label} style={styles.row} testID={`account-row-${detail.label}`}>
          <Text style={styles.label}>{detail.label}</Text>
          <Text style={styles.value}>{detail.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "bold", color: "#1e3a8a" },
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  heading: { fontSize: 16, fontWeight: "bold", color: "#1e3a8a", marginBottom: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  label: { color: "#6b7280", fontWeight: "600" },
  value: { color: "#111827", flexShrink: 1, textAlign: "right", marginLeft: 12 },
  switchGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#fff",
    gap: 8,
  },
  homeBtn: {
    borderWidth: 1,
    borderColor: "#1e3a8a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  homeText: { color: "#1e3a8a", fontWeight: "bold", fontSize: 15 },
  logoutBtn: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
