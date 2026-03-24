import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Task } from "@/features/tasks/types/task";
import { BottomSheet } from "@/shared/components/BottomSheet";
import { CATEGORY_COLORS } from "@/shared/constants/theme";

interface DayTasksSheetProps {
  date: string;
  tasks: Task[];
  visible: boolean;
  onClose: () => void;
  onTaskPress: (task: Task) => void;
}

export function DayTasksSheet({
  date,
  tasks,
  visible,
  onClose,
  onTaskPress,
}: DayTasksSheetProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.countText}>{tasks.length} task{tasks.length !== 1 ? "s" : ""}</Text>
        </View>

        <View style={styles.tasksList}>
          {tasks.length === 0 ? (
            <Text style={styles.emptyText}>No tasks for this day</Text>
          ) : (
            tasks.map((task) => (
              <Pressable
                key={task.id}
                style={styles.taskItem}
                onPress={() => onTaskPress(task)}
              >
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: task.category ? CATEGORY_COLORS[task.category] : "#ccc" },
                  ]}
                />
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  {task.description && (
                    <Text style={styles.taskDescription} numberOfLines={1}>
                      {task.description}
                    </Text>
                  )}
                </View>
                {task.completed && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>✓</Text>
                  </View>
                )}
              </Pressable>
            ))
          )}
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  countText: {
    fontSize: 14,
    color: "#666",
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 40,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: "#333",
  },
  taskDescription: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  completedBadge: {
    backgroundColor: "#27ae60",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  completedText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
