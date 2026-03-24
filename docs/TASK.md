# Pending Tasks

This file tracks technical tasks and TODOs for the project.

## Settings Screen

- [ ] **Implement export to JSON file**
  - Use `expo-file-system` to write JSON
  - Use `expo-sharing` to share/save file
  - Status: Alert shows data but no file export

- [ ] **Persist notifications toggle**
  - Store preference in AsyncStorage
  - Use Zustand middleware or separate store
  - Status: Toggle exists but always returns true

## Home Screen

- [ ] **Add haptic feedback on task save**
  - Install `expo-haptics`
  - Trigger on successful task create/update
  - Status: No feedback currently

- [ ] **Add toast notification on task save**
  - Show "Task saved" toast
  - Can be done with custom component or library
  - Status: No toast currently

## Calendar Screen

- [ ] **Integrate useStreak hook**
  - Show streak counter in calendar header
  - Already have `useStreak` hook not integrated

- [ ] **Add month stats section**
  - Total completed this month
  - Best day stat
  - Average per day

- [ ] **Navigate to task detail from DayAgenda**
  - `onTaskPress` handler exists but does nothing
  - Should open TaskDetailCard or similar

## Technical Debt

- [ ] **Remove unused imports in components**
  - Check for dead code periodically

- [ ] **Add Error Boundaries**
  - React error handling for production

- [ ] **Add loading states**
  - Skeleton screens while data loads

## Testing

- [ ] **Add unit tests for store logic**
- [ ] **Add component tests for critical UI**
- [ ] **Add E2E tests for user flows**

## Documentation

- [ ] **Update README with setup instructions**
- [ ] **Add screenshots to docs**
- [ ] **Document component API**

---

## Completed Tasks

- [x] Empty state in BubbleCanvas
- [x] Fix "Clear Completed" bug
- [x] Fix calendar background mismatch
- [x] Remove unused components (CalendarGrid, DayTasksSheet, StreakCounter)
- [x] Add WeekView component
- [x] Add DayAgenda component
- [x] Add Settings screen
- [x] FAB position adjustment
- [x] "Today" button in Calendar
- [x] Consistent padding (20px)
- [x] Consistent terminology ("Done" vs "Completed")
- [x] Disabled row styling for Dark Mode
- [x] Short weekday labels for i18n
