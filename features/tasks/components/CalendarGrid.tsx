import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import type { Task } from "@/features/tasks/types/task";
import { CATEGORY_COLORS } from "@/shared/constants/theme";

interface CalendarGridProps {
  tasks: Task[];
  onDayPress: (date: string, tasks: Task[]) => void;
}

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

export function CalendarGrid({ tasks, onDayPress }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { year, month } = useMemo(() => {
    return {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth(),
    };
  }, [currentDate]);

  const calendarData = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Primer día de la semana (0 = domingo, ajustamos para lunes = 0)
    let startWeekday = firstDay.getDay() - 1;
    if (startWeekday < 0) startWeekday = 6;

    // Obtener tareas por día
    const tasksByDay: Record<number, Task[]> = {};
    const completedByDay: Record<number, number> = {};

    tasks.forEach(task => {
      if (task.deadline) {
        const taskDate = new Date(task.deadline);
        if (taskDate.getMonth() === month && taskDate.getFullYear() === year) {
          const day = taskDate.getDate();
          if (!tasksByDay[day]) tasksByDay[day] = [];
          tasksByDay[day].push(task);

          if (task.completed) {
            completedByDay[day] = (completedByDay[day] || 0) + 1;
          }
        }
      }
    });

    // Calcular intensidad del heatmap (0-4 niveles)
    const maxCompleted = Math.max(...Object.values(completedByDay), 1);
    const heatmapIntensity: Record<number, number> = {};
    Object.entries(completedByDay).forEach(([day, count]) => {
      const ratio = count / maxCompleted;
      if (ratio <= 0.25) heatmapIntensity[Number(day)] = 1;
      else if (ratio <= 0.5) heatmapIntensity[Number(day)] = 2;
      else if (ratio <= 0.75) heatmapIntensity[Number(day)] = 3;
      else heatmapIntensity[Number(day)] = 4;
    });

    return { firstDay, lastDay, daysInMonth, startWeekday, tasksByDay, heatmapIntensity };
  }, [year, month, tasks]);

  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generar celdas del calendario (incluye días vacíos)
  const days: (number | null)[] = [];
  for (let i = 0; i < calendarData.startWeekday; i++) {
    days.push(null);
  }
  for (let day = 1; day <= calendarData.daysInMonth; day++) {
    days.push(day);
  }

  // Calcular progreso del mes
  const totalCompleted = Object.values(calendarData.heatmapIntensity).length;
  const progress = (totalCompleted / calendarData.daysInMonth) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goToPrevMonth} style={styles.navButton}>
          <Text style={styles.navText}>‹</Text>
        </Pressable>
        <Text style={styles.monthTitle}>{monthName} {year}</Text>
        <Pressable onPress={goToNextMonth} style={styles.navButton}>
          <Text style={styles.navText}>›</Text>
        </Pressable>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}% month</Text>
      </View>

      {/* Weekdays header */}
      <View style={styles.weekdaysRow}>
        {WEEKDAYS.map((day, i) => (
          <View key={i} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {days.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }

            const dayTasks = calendarData.tasksByDay[day] || [];
            const intensity = calendarData.heatmapIntensity[day] || 0;
            const hasTasks = dayTasks.length > 0;

            return (
              <Pressable
                key={day}
                style={[
                  styles.dayCell,
                  intensity > 0 && styles.dayCellCompleted,
                ]}
                onPress={() => {
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  onDayPress(dateStr, dayTasks);
                }}
              >
                <Text style={[
                  styles.dayText,
                  hasTasks && styles.dayTextWithTasks,
                ]}>
                  {day}
                </Text>

                {/* Dots para categorías */}
                {dayTasks.length > 0 && (
                  <View style={styles.dotsContainer}>
                    {dayTasks.slice(0, 3).map((task, i) => (
                      <View
                        key={i}
                        style={[
                          styles.dot,
                          { backgroundColor: task.category ? CATEGORY_COLORS[task.category] : "#ccc" },
                        ]}
                      />
                    ))}
                  </View>
                )}

                {/* Heatmap overlay */}
                {intensity > 0 && (
                  <View style={[styles.heatmapOverlay, { opacity: 0.15 * intensity }]} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navButton: {
    padding: 8,
  },
  navText: {
    fontSize: 24,
    color: "#333",
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#27ae60",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
  weekdaysRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  weekdayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  dayCellCompleted: {
    backgroundColor: "#27ae60",
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  dayTextWithTasks: {
    fontWeight: "bold",
  },
  dotsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 4,
    gap: 2,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  heatmapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#27ae60",
    borderRadius: 8,
  },
});
