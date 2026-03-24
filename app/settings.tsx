import { useTaskStore } from "@/features/tasks/store/taskStore";
import { COLORS } from "@/shared/constants/theme";
import {
  Bell,
  ChevronRight,
  Download,
  Info,
  Moon,
  Trash2,
} from "lucide-react-native";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { tasks, clearCompleted } = useTaskStore();

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.completed).length;
  const completionRate =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const handleExportData = () => {
    const data = JSON.stringify(tasks, null, 2);
    Alert.alert(
      "Export Data",
      `Tasks exported:\n\nTotal: ${totalTasks}\nDone: ${doneTasks}\n\nData ready to copy (${data.length} bytes)`,
      [{ text: "OK" }],
    );
    // TODO: Implement actual file export with expo-file-system
  };

  const handleClearCompleted = () => {
    const done = tasks.filter((t) => t.completed);
    if (done.length === 0) {
      Alert.alert("No done tasks", "There are no completed tasks to clear.");
      return;
    }

    Alert.alert(
      "Clear Completed",
      `Remove ${done.length} done task${done.length > 1 ? "s" : ""}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            clearCompleted();
          },
        },
      ],
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
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalTasks}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{doneTasks}</Text>
              <Text style={styles.statLabel}>Done</Text>
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
              <Bell size={20} color={COLORS.textPrimary} />
              <View style={styles.itemText}>
                <Text style={styles.itemLabel}>Notifications</Text>
                <Text style={styles.itemSubtitle}>Task reminders</Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: COLORS.tabInactive, true: COLORS.successLight }}
              thumbColor={COLORS.textInverse}
            />
          </View>

          <View style={styles.divider} />

          <View style={[styles.itemRow, styles.disabledRow]}>
            <View style={styles.itemLeft}>
              <Moon size={20} color={COLORS.textDisabled} />
              <View style={styles.itemText}>
                <Text style={styles.disabledLabel}>Dark Mode</Text>
                <Text style={styles.disabledSubtitle}>Coming soon</Text>
              </View>
            </View>
            <Switch
              value={false}
              disabled
              trackColor={{ false: COLORS.tabInactive, true: COLORS.successLight }}
              thumbColor={COLORS.textInverse}
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Pressable style={styles.itemRow} onPress={handleExportData}>
            <View style={styles.itemLeft}>
              <Download size={20} color={COLORS.textPrimary} />
              <View style={styles.itemText}>
                <Text style={styles.itemLabel}>Export Data</Text>
                <Text style={styles.itemSubtitle}>Save as JSON</Text>
              </View>
            </View>
            <ChevronRight size={20} color={COLORS.textDisabled} />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.itemRow} onPress={handleClearCompleted}>
            <View style={styles.itemLeft}>
              <Trash2 size={20} color={COLORS.destructive} />
              <View style={styles.itemText}>
                <Text style={[styles.itemLabel, styles.destructiveText]}>
                  Clear Completed
                </Text>
                <Text style={styles.itemSubtitle}>Remove done tasks</Text>
              </View>
            </View>
            <ChevronRight size={20} color={COLORS.textDisabled} />
          </Pressable>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.itemRow}>
            <View style={styles.itemLeft}>
              <Info size={20} color={COLORS.textPrimary} />
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
    backgroundColor: COLORS.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 45,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
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
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsHint: {
    fontSize: 13,
    color: COLORS.textDisabled,
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
    color: COLORS.textPrimary,
  },
  itemSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  destructiveText: {
    color: COLORS.destructive,
  },
  disabledRow: {
    opacity: 0.5,
  },
  disabledLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.textDisabled,
  },
  disabledSubtitle: {
    fontSize: 13,
    color: COLORS.textDisabled,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginLeft: 48,
  },
});
