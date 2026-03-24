import type { Task } from "@/features/tasks/types/task";
import { CATEGORY_COLORS } from "@/shared/constants/theme";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface WeekViewProps {
  tasks: Task[];
  selectedDate: Date;
  onDaySelect: (date: Date) => void;
  onWeekChange: (date: Date) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function WeekView({
  tasks,
  selectedDate,
  onDaySelect,
  onWeekChange,
}: WeekViewProps) {
  // Obtener la semana actual (lunes a domingo)
  const weekDays = useMemo(() => {
    const start = new Date(selectedDate);
    const day = start.getDay();
    // Ajustar para que lunes sea el primer día
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [selectedDate]);

  // Helper para comparar fechas
  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  // Obtener tareas de un día
  const getTasksForDay = (day: Date) =>
    tasks.filter((task) => {
      if (!task.deadline) return false;
      return isSameDay(new Date(task.deadline), day);
    });

  // Número de semana
  const getWeekNumber = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const weekNumber = getWeekNumber(selectedDate);

  // Mes y año
  const monthName = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Navegación
  const goToPrevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    onWeekChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    onWeekChange(newDate);
  };

  const goToToday = () => {
    onWeekChange(new Date());
    onDaySelect(new Date());
  };

  return (
    <View style={styles.container}>
      {/* Header con semana */}
      <View style={styles.header}>
        <Pressable onPress={goToPrevWeek} style={styles.navButton}>
          <Text style={styles.navText}>‹</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.monthText}>{monthName}</Text>
        </View>

        <Pressable onPress={goToNextWeek} style={styles.navButton}>
          <Text style={styles.navText}>›</Text>
        </Pressable>
      </View>

      {/* Días de la semana */}
      <View style={styles.daysRow}>
        {weekDays.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);
          const dayTasks = getTasksForDay(day);
          const hasTasks = dayTasks.length > 0;

          return (
            <Pressable
              key={index}
              style={[
                styles.dayCell,
                isSelected && styles.dayCellSelected,
                isToday && !isSelected && styles.dayCellToday,
              ]}
              onPress={() => onDaySelect(day)}
            >
              <Text
                style={[styles.dayName, isSelected && styles.dayNameSelected]}
              >
                {WEEKDAYS[index]}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.dayNumberSelected,
                  isToday && !isSelected && styles.dayNumberToday,
                ]}
              >
                {day.getDate()}
              </Text>

              {/* Dots */}
              {hasTasks && (
                <View style={styles.dotsContainer}>
                  {dayTasks.slice(0, 3).map((task, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        {
                          backgroundColor: task.category
                            ? CATEGORY_COLORS[task.category]
                            : "#ccc",
                        },
                      ]}
                    />
                  ))}
                  {dayTasks.length > 3 && (
                    <Text style={styles.moreText}>+{dayTasks.length - 3}</Text>
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerCenter: {
    alignItems: "center",
  },
  monthText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  navButton: {
    padding: 8,
  },
  navText: {
    fontSize: 24,
    color: "#333",
  },
  weekBadge: {
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
  },
  weekText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dayCell: {
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    minWidth: 44,
  },
  dayCellSelected: {
    backgroundColor: "#333",
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: "#27ae60",
  },
  dayName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#999",
    marginBottom: 4,
  },
  dayNameSelected: {
    color: "#fff",
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  dayNumberSelected: {
    color: "#fff",
  },
  dayNumberToday: {
    color: "#27ae60",
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 6,
    gap: 3,
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moreText: {
    fontSize: 8,
    color: "#999",
  },
});
