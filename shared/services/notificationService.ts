import * as Notifications from "expo-notifications";
import type { Task } from "@/features/tasks/types/task";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NOTIFICATION_CHANNEL_ID = "task-reminders";

/**
 * NotificationService - Handles local push notifications for task reminders
 * 
 * Responsibilities:
 * - Request notification permissions
 * - Schedule reminders for tasks with deadlines (1 hour before)
 * - Cancel scheduled notifications when tasks are completed or deleted
 */
export const NotificationService = {
  /**
   * Request notification permissions from the user
   * @returns true if permissions granted, false otherwise
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      if (existingStatus === "granted") {
        return true;
      }

      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("NotificationService.requestPermissions error:", error);
      return false;
    }
  },

  /**
   * Schedule a notification reminder for a task
   * Schedules notification 1 hour before the deadline
   * @param task - The task with a deadline
   * @returns The notification identifier, or null if scheduling failed
   */
  async scheduleTaskReminder(task: Task): Promise<string | null> {
    if (!task.deadline) {
      console.log(
        `NotificationService.scheduleTaskReminder: Task ${task.id} has no deadline`
      );
      return null;
    }

    try {
      const deadlineDate = new Date(task.deadline);
      const now = new Date();

      // Calculate notification time: 1 hour before deadline
      const triggerDate = new Date(deadlineDate.getTime() - 60 * 60 * 1000);

      // Don't schedule if the trigger time has already passed
      if (triggerDate <= now) {
        console.log(
          `NotificationService.scheduleTaskReminder: Trigger time has passed for task ${task.id}`
        );
        return null;
      }

      // Create content for the notification
      const content: Notifications.NotificationContentInput = {
        title: "⏰ Task Reminder",
        body: `"${task.title}" is due in 1 hour!`,
        data: { taskId: task.id, type: "task-reminder" },
        sound: "default",
      };

      // Schedule the notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });

      console.log(
        `NotificationService.scheduleTaskReminder: Scheduled ${notificationId} for task ${task.id}`
      );
      return notificationId;
    } catch (error) {
      console.error(
        `NotificationService.scheduleTaskReminder error for task ${task.id}:`,
        error
      );
      return null;
    }
  },

  /**
   * Cancel a specific scheduled notification
   * @param notificationId - The notification identifier to cancel
   */
  async cancelTaskReminder(notificationId: string): Promise<void> {
    if (!notificationId) return;

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log(
        `NotificationService.cancelTaskReminder: Cancelled ${notificationId}`
      );
    } catch (error) {
      console.error(
        `NotificationService.cancelTaskReminder error for ${notificationId}:`,
        error
      );
    }
  },

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllReminders(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("NotificationService.cancelAllReminders: Cancelled all");
    } catch (error) {
      console.error("NotificationService.cancelAllReminders error:", error);
    }
  },

  /**
   * Get all scheduled notifications
   * @returns Array of scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error(
        "NotificationService.getScheduledNotifications error:",
        error
      );
      return [];
    }
  },
};
