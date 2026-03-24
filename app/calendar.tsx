import { DayAgenda } from "@/features/tasks/components/DayAgenda";
import { WeekView } from "@/features/tasks/components/WeekView";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import type { Task } from "@/features/tasks/types/task";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarScreen() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper para comparar fechas
  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  // Filtrar tareas del día seleccionado
  const dayTasks = tasks.filter((task) => {
    if (!task.deadline) return false;
    return isSameDay(new Date(task.deadline), selectedDate);
  });

  // Ordenar tareas por hora (si tienen deadline con hora)
  const sortedTasks = [...dayTasks].sort((a, b) => {
    if (!a.deadline || !b.deadline) return 0;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const handleTaskPress = (task: Task) => {
    console.log("Task pressed:", task.title);
    // TODO: navegar a detalle de tarea
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
      </View>

      <WeekView
        tasks={tasks}
        selectedDate={selectedDate}
        onDaySelect={setSelectedDate}
        onWeekChange={setSelectedDate}
      />

      <DayAgenda
        date={selectedDate}
        tasks={sortedTasks}
        onTaskPress={handleTaskPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 45,
    fontWeight: "800",
    color: "#333",
  },
});
