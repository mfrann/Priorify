import { useMemo } from "react";
import type { Task } from "@/features/tasks/types/task";

export function useStreak(tasks: Task[]): number {
  return useMemo(() => {
    // Obtener fechas únicas de tareas completadas ordenadas
    const completedDates = tasks
      .filter(task => task.completed)
      .map(task => task.createdAt)
      .map(dateStr => {
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      })
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort();

    if (completedDates.length === 0) return 0;

    // Convertir a Date objects para comparar
    const dates = completedDates.map(dateStr => {
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month, day);
    });

    // Calcular streak desde hoy hacia atrás
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let checkDate = new Date(today);

    // Verificar si hoy tiene tarea completada, si no empezar desde ayer
    const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const hasTodayCompleted = completedDates.includes(todayStr);

    if (!hasTodayCompleted) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Contar días consecutivos hacia atrás
    while (true) {
      const checkStr = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
      
      if (completedDates.includes(checkStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [tasks]);
}
