import type { Task } from "@/features/tasks/types/task";
import { CATEGORY_COLORS } from "@/shared/constants/theme";
import { CircleCheck } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface DayAgendaProps {
  date: Date;
  tasks: Task[];
  onTaskPress: (task: Task) => void;
}

interface TaskItemProps {
  task: Task;
  onPress: (task: Task) => void;
}

const TaskItem = ({ task, onPress }: TaskItemProps) => (
  <Pressable style={styles.taskItem} onPress={() => onPress(task)}>
    <View
      style={[
        styles.categoryDot,
        {
          backgroundColor: task.category
            ? CATEGORY_COLORS[task.category]
            : "#ccc",
        },
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
      <View style={styles.checkmark}>
        <CircleCheck size={22} color="#27ae60" />
      </View>
    )}
  </Pressable>
);

export function DayAgenda({ date, tasks, onTaskPress }: DayAgendaProps) {
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.dateHeader}>{formattedDate}</Text>

      {/* Lista de tareas */}
      <ScrollView style={styles.tasksList}>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks for this day</Text>
        ) : (
          tasks.map((task) => (
            <TaskItem key={task.id} task={task} onPress={onTaskPress} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    marginTop: 20,
  },
  tasksList: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
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
    paddingVertical: 14,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryDot: {
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
  checkmark: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
