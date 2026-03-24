# Future Features

## Swipe Navigation for Status Tabs

### Description
Implement swipe gestures on the bubble canvas to navigate between status tabs (All/Active/Done).

### Current Behavior
- Swipe left/right on the bubble canvas changes tabs
- However, it conflicts with the native swipe-back gesture on iOS/Android (edge swipe for navigation)

### Technical Solution
Use `simultaneousWithExternalGesture` to allow both gestures to work together, or:

Ignore gestures that start near screen edges (first 20px) to preserve the native navigation gesture:

```typescript
const panGesture = Gesture.Pan()
  .onStart((event) => {
    // Ignore if starts at screen edge
    if (event.x < 20 || event.x > screenWidth - 20) {
      return;
    }
  })
  .activeOffsetX([-10, 10])
  .onEnd((event) => {
    // Handle tab change
  });
```

### Status
- [ ] Not implemented
- [x] Basic swipe logic in place
- [ ] Fix edge gesture conflict

---

## Calendar Improvements

### 1. Streak Counter 🔥

#### Description
Display current streak (consecutive days with completed tasks) on the calendar screen.

#### Implementation
```tsx
// Already have useStreak hook
// Add to calendar header:
<View style={styles.streakContainer}>
  <Text>🔥</Text>
  <Text>{streak} days</Text>
</View>
```

#### Status
- [ ] Not implemented
- [x] useStreak hook exists

---

### 2. Month Stats

#### Description
Show statistics below the week view:
- Total tasks completed this month
- Best day (most tasks completed)
- Average tasks per day

#### UI
```
┌─────────────────────────────────┐
│  ◀  March 2025  🔥 15 days  ▶ │
│                                 │
│  L   M   X   J   V   S   D    │
│  ●●   ●   ●●   ●   ●●   ○   ○ │
├─────────────────────────────────┤
│  📊 March Stats                │
│  Completed: 42                 │
│  Best day: Tuesday (8)        │
└─────────────────────────────────┘
```

#### Status
- [ ] Not implemented

---

### 3. Quick Month Selector

#### Description
Dropdown or modal to quickly jump to any month.

#### UI
```
◀  March 2025  ▼  ▶
       ↓
┌─────────────────┐
│  January 2025   │
│  February 2025   │
│  March 2025  ← current
│  April 2025      │
│  May 2025        │
└─────────────────┘
```

#### Status
- [ ] Not implemented

---

### 4. Full Week Agenda

#### Description
Below the week view, show a scrollable agenda of all days in the week.

#### UI
```
┌─────────────────────────────────┐
│  ◀  Week 12  ▶                 │
│  L   M   X   J   V   S   D    │
│  ●●   ●   ●●   ●   ●●   ○   ○  │
├─────────────────────────────────┤
│  ── Monday 17 ──────────────   │
│  ● 10:00  Team meeting          │
│  ● 14:00  Call client          │
│  ── Tuesday 18 ────────────   │
│  ● 09:00  Gym                  │
└─────────────────────────────────┘
```

#### Status
- [ ] Not implemented

---

### 5. Week Strip (Completed ✅)

Already implemented:
- Week navigation (◀ ▶)
- Day dots by category
- Selected day highlighting
- Today indicator
- Week number badge
- Month/year display

---

## Save Feedback

### Description
When a task is saved, there's no visual confirmation. Users might not realize the action completed.

### Current Behavior
- Form closes immediately after saving
- No toast, haptic, or animation to confirm

### Proposed Solution
Add visual feedback after save:

```typescript
// Option 1: Haptic feedback
import * as Haptics from 'expo-haptics';
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Option 2: Toast notification
Toast.show({
  message: 'Task saved!',
  type: 'success',
  duration: 2000,
});

// Option 3: Subtle animation on the saved bubble
```

### Status
- [ ] Not implemented

---

## Settings Export

### Description
Export tasks to a JSON file for backup.

### Current Behavior
- Shows an alert with task count
- No actual file export

### Proposed Solution
Use `expo-file-system` and `expo-sharing`:

```typescript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const exportTasks = async () => {
  const json = JSON.stringify(tasks, null, 2);
  const uri = FileSystem.documentDirectory + 'priorify-backup.json';
  await FileSystem.writeAsStringAsync(uri, json);
  await Sharing.shareAsync(uri);
};
```

### Status
- [ ] Not implemented
