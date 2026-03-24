import { StyleSheet, Text, View, Pressable, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BarChart3,
  Bell,
  Moon,
  Download,
  Trash2,
  Info,
  ChevronRight,
  Check,
} from "lucide-react-native";
import { useTaskStore } from "@/features/tasks/store/taskStore";

export default function SettingsScreen() {
  const { tasks, clearCompleted } = useTaskStore();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleExportData = () => {
    const data = JSON.stringify(tasks, null, 2);
    Alert.alert(
      "Export Data",
      `Tasks exported:\n\nTotal: ${totalTasks}\nCompleted: ${completedTasks}\n\nData ready to copy (${data.length} bytes)`,
      [{ text: "OK" }]
    );
    // TODO: Implement actual file export with expo-file-system
  };

  const handleClearCompleted = () => {
    const completed = tasks.filter((t) => t.completed);
    if (completed.length === 0) {
      Alert.alert("No completed tasks", "There are no completed tasks to clear.");
      return;
    }

    Alert.alert(
      "Clear Completed",
      `Remove ${completed.length} completed task${completed.length > 1 ? "s" : ""}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            clearCompleted();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Statistics Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BarChart3 size={18} color="#666" />
            <Text style={styles.sectionTitle}>Statistics</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalTasks}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedTasks}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Rate</Text>
            </View>
          </View>
          <Text style={styles.statsHint}>View your progress</Text>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Bell size={20} color="#333" />
              <View style={styles.itemText}>
                <Text style={styles.itemLabel}>Notifications</Text>
                <Text style={styles.itemSubtitle}>Task reminders</Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: "#ddd", true: "#a8d4e6" }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Moon size={20} color="#333" />
              <View style={styles.itemText}>
                <Text style={styles.itemLabel}>Dark Mode</Text>
                <Text style={styles.itemSubtitle}>Coming soon</Text>
              </View>
            </View>
            <Switch
              value={false}
              disabled
              trackColor={{ false: "#ddd", true: "#a8d4e6" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Pressable style={styles.itemRow} onPress={handleExportData}>
            <View style={styles.itemLeft}>
              <Download size={20} color="#333" />
              <View style={styles.itemText}>
                <Text style={styles.itemLabel}>Export Data</Text>
                <Text style={styles.itemSubtitle}>Save as JSON</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#ccc" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.itemRow}
            onPress={handleClearCompleted}
          >
            <View style={styles.itemLeft}>
              <Trash2 size={20} color="#e74c3c" />
              <View style={styles.itemText}>
                <Text style={[styles.itemLabel, styles.destructiveText]}>
                  Clear Completed
                </Text>
                <Text style={styles.itemSubtitle}>Remove done tasks</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#ccc" />
          </Pressable>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Info size={20} color="#333" />
              <View style={styles.itemText}>
                <Text style={styles.itemLabel}>About</Text>
                <Text style={styles.itemSubtitle}>Version 1.0</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 45,
    fontWeight: "800",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  statsHint: {
    fontSize: 13,
    color: "#999",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemText: {
    marginLeft: 12,
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  itemSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  destructiveText: {
    color: "#e74c3c",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 48,
  },
});
