# MoodFocus Focus Room

MoodFocus is a mood-aware study companion built with React, Vite, HTML, and CSS. It helps a student choose a current mood, set a manageable focus session, and turn that intention into one clear next action.

## Project structure

```text
src/
  App.jsx                  # Shared state and page composition
  main.jsx                 # React entrypoint
  styles.css               # Responsive visual system
  data/
    moods.js               # Mood configuration and adaptive content
  hooks/
    useLocalStorage.js     # Small persistence hook
  components/
    Header.jsx             # Brand, history, and theme actions
    MoodPicker.jsx         # Mood selection cards
    FocusTimer.jsx         # Countdown ring and timer controls
    TaskList.jsx            # Task creation, completion, and cleanup
    InsightCard.jsx         # Mood-specific guidance
    MoodHistory.jsx         # Recent mood check-in chart
    IntentionCard.jsx       # Editable daily intention
```

## Included functionality

- Five mood states with different timer lengths, colors, copy, quotes, and guidance.
- Focus timer with start, pause, reset, completion progress, and optional vibration feedback.
- Persistent mood, theme, tasks, mood history, session count, and daily intention using `localStorage`.
- Task progress bar, task completion/deletion, and a clear-completed action.
- Personalized tip generation based on mood and recent activity.
- Recent mood history panel with an at-a-glance bar chart.
- Light and dark themes with responsive layouts for desktop, tablet, and mobile.
- Export summary action that downloads current focus progress as a text file.
- Accessible labels on icon-only actions and keyboard-friendly task/intention inputs.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Design notes

The interface uses a calm, high-contrast focus-room aesthetic: expressive display typography, mood-specific accent colors, translucent panels, and a restrained layout that keeps the timer and next task visually dominant. Components receive data and callbacks from `App.jsx`, while `moods.js` keeps content decisions out of the view layer.
