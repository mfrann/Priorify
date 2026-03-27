import { create } from 'zustand';
import type { Task } from '@/features/tasks/types/task';
import { StorageService } from '@/features/tasks/services/storage';
import { NotificationService } from '@/shared/services/notificationService';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  isInitialized: boolean;
  taskNotificationIds: Map<string, string>;

  getTaskById: (id: string) => Task | undefined;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: true,
  isInitialized: false,
  taskNotificationIds: new Map<string, string>(),

  getTaskById: (id: string) => {
    return get().tasks.find((task) => task.id === id);
  },

  initialize: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true });
    try {
      const tasks = await StorageService.getAllTasks();
      set({ tasks, isLoading: false, isInitialized: true });
    } catch (error) {
      console.error('TaskStore.loadTasks error:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  addTask: async (task: Task) => {
    const currentTasks = get().tasks;
    const currentNotificationIds = get().taskNotificationIds;
    set({ tasks: [...currentTasks, task] });
    
    const success = await StorageService.saveTask(task);
    if (!success) {
      set({ tasks: currentTasks });
      console.error('Failed to persist task');
      return;
    }

    // Schedule notification if task has deadline
    if (task.deadline) {
      const notificationId = await NotificationService.scheduleTaskReminder(task);
      if (notificationId) {
        const newNotificationIds = new Map(currentNotificationIds);
        newNotificationIds.set(task.id, notificationId);
        set({ taskNotificationIds: newNotificationIds });
      }
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    const currentTasks = get().tasks;
    const currentNotificationIds = get().taskNotificationIds;
    const taskIndex = currentTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) return;

    const updatedTask = { ...currentTasks[taskIndex], ...updates };
    const newTasks = [...currentTasks];
    newTasks[taskIndex] = updatedTask;
    set({ tasks: newTasks });

    const success = await StorageService.saveTask(updatedTask);
    if (!success) {
      set({ tasks: currentTasks });
      console.error('Failed to persist task update');
      return;
    }

    // Handle notification updates
    const existingNotificationId = currentNotificationIds.get(id);

    // If deadline was removed or task completed, cancel notification
    if (!updatedTask.deadline || updatedTask.completed) {
      if (existingNotificationId) {
        await NotificationService.cancelTaskReminder(existingNotificationId);
        const newNotificationIds = new Map(currentNotificationIds);
        newNotificationIds.delete(id);
        set({ taskNotificationIds: newNotificationIds });
      }
      return;
    }

    // If deadline was added/updated, schedule new notification
    const previousTask = currentTasks[taskIndex];
    const deadlineChanged = previousTask.deadline !== updates.deadline;

    if (deadlineChanged || !existingNotificationId) {
      // Cancel existing notification first
      if (existingNotificationId) {
        await NotificationService.cancelTaskReminder(existingNotificationId);
      }

      // Schedule new notification
      const notificationId = await NotificationService.scheduleTaskReminder(updatedTask);
      if (notificationId) {
        const newNotificationIds = new Map(currentNotificationIds);
        newNotificationIds.set(id, notificationId);
        set({ taskNotificationIds: newNotificationIds });
      }
    }
  },

  removeTask: async (id: string) => {
    const currentTasks = get().tasks;
    const currentNotificationIds = get().taskNotificationIds;
    const newTasks = currentTasks.filter((t) => t.id !== id);
    set({ tasks: newTasks });

    const success = await StorageService.removeTask(id);
    if (!success) {
      set({ tasks: currentTasks });
      console.error('Failed to remove task from storage');
      return;
    }

    // Cancel any scheduled notification for this task
    const notificationId = currentNotificationIds.get(id);
    if (notificationId) {
      await NotificationService.cancelTaskReminder(notificationId);
      const newNotificationIds = new Map(currentNotificationIds);
      newNotificationIds.delete(id);
      set({ taskNotificationIds: newNotificationIds });
    }
  },

  clearCompleted: async () => {
    const currentTasks = get().tasks;
    const currentNotificationIds = get().taskNotificationIds;
    const completedIds = currentTasks.filter((t) => t.completed).map((t) => t.id);
    
    if (completedIds.length === 0) return;

    // Optimistic update
    const newTasks = currentTasks.filter((t) => !t.completed);
    set({ tasks: newTasks });

    // Cancel notifications for completed tasks
    const notificationsToCancel = completedIds
      .map((id) => currentNotificationIds.get(id))
      .filter((id): id is string => id !== undefined);
    
    await Promise.all(
      notificationsToCancel.map((id) => NotificationService.cancelTaskReminder(id))
    );

    // Clear notification IDs for completed tasks
    const newNotificationIds = new Map(currentNotificationIds);
    completedIds.forEach((id) => newNotificationIds.delete(id));
    set({ taskNotificationIds: newNotificationIds });

    // Persist all deletions
    const results = await Promise.all(
      completedIds.map((id) => StorageService.removeTask(id)),
    );
    
    if (results.some((success) => !success)) {
      // Rollback if any failed
      set({ tasks: currentTasks });
      console.error('Some completed tasks failed to remove');
    }
  },

  toggleComplete: async (id: string) => {
    const currentTasks = get().tasks;
    const currentNotificationIds = get().taskNotificationIds;
    const task = currentTasks.find((t) => t.id === id);
    if (!task) return;

    // Optimistic update
    const newCompleted = !task.completed;
    const newTasks = currentTasks.map((t) =>
      t.id === id ? { ...t, completed: newCompleted } : t
    );
    set({ tasks: newTasks });

    // Persist and rollback on failure
    const success = await StorageService.saveTask({ ...task, completed: newCompleted });
    if (!success) {
      set({ tasks: currentTasks });
      console.error('Failed to persist toggleComplete');
      return;
    }

    // Cancel notification when task is completed
    if (newCompleted) {
      const notificationId = currentNotificationIds.get(id);
      if (notificationId) {
        await NotificationService.cancelTaskReminder(notificationId);
        const newNotificationIds = new Map(currentNotificationIds);
        newNotificationIds.delete(id);
        set({ taskNotificationIds: newNotificationIds });
      }
    }
  },
}));
