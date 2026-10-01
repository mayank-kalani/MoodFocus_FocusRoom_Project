import { useEffect, useMemo, useState } from "react";
import { Download, Flame, Music2 } from "lucide-react";
import { Header } from "./components/Header";
import { MoodPicker } from "./components/MoodPicker";
import { FocusTimer } from "./components/FocusTimer";
import { TaskList } from "./components/TaskList";
import { InsightCard } from "./components/InsightCard";
import { MoodHistory } from "./components/MoodHistory";
import { IntentionCard } from "./components/IntentionCard";
import { MOODS } from "./data/moods";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./styles.css";

const initialTodos = [
  { id: 1, text: "Review today's priority", done: false },
  { id: 2, text: "Complete one focused session", done: false },
];

const smartTips = {
  Sleepy: ["Try a 30-second stretch before starting.", "Keep the room bright and start with a simple task.", "Drink water before opening your first tab.", "Use a short warm-up task to wake up your attention."],
  Stressed: ["Use box breathing for one minute before you begin.", "Write down distractions instead of acting on them.", "Choose the smallest useful step and ignore the rest for now.", "Relax your shoulders and make your first task specific."],
  Energetic: ["Batch your hardest work into this session.", "Keep your phone outside arm's reach.", "Set a bold outcome before your energy gets scattered.", "Use the first ten minutes for the task you usually avoid."],
  Distracted: ["Use full-screen mode and close every unrelated tab.", "Set one tiny outcome for this session.", "Put your phone face down and out of reach.", "Keep a quick distraction note instead of switching tasks."],
  Overwhelmed: ["Turn your biggest task into a five-minute first action.", "Make a three-item priority list and ignore the rest for now.", "Remove one decision by choosing the easiest next step.", "Write everything down, then work on only one item."],
};

function App() {
  const [mood, setMood] = useLocalStorage("mood", "Energetic");
  const [dark, setDark] = useLocalStorage("dark", true);
  const [todos, setTodos] = useLocalStorage("todos", initialTodos);
  const [history, setHistory] = useLocalStorage("moodHistory", []);
  const [sessions, setSessions] = useLocalStorage("sessions", 0);
  const [intention, setIntention] = useLocalStorage("intention", "");
  const [seconds, setSeconds] = useState(MOODS[mood].minutes * 60);
  const [running, setRunning] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [soundOn, setSoundOn] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [insight, setInsight] = useState("");
  const [tipIndex, setTipIndex] = useState(-1);
  const [editingIntention, setEditingIntention] = useState(false);
  const [intentionDraft, setIntentionDraft] = useState(intention);

  const config = MOODS[mood] || MOODS.Energetic;
  const completed = todos.filter((todo) => todo.done).length;
  const progress = todos.length ? Math.round((completed / todos.length) * 100) : 0;

  useEffect(() => {
    setSeconds(config.minutes * 60);
    setRunning(false);
    setInsight("");
    setTipIndex(-1);
  }, [mood]);

  useEffect(() => {
    if (showHistory) {
      document.getElementById("history")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showHistory, history.length]);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          finishSession();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const finishSession = () => {
    const date = new Date().toISOString().slice(0, 10);
    setSessions((value) => value + 1);
    setHistory((items) => [...items.slice(-9), { mood, date }]);
    try { navigator.vibrate?.([100, 50, 100]); } catch { /* vibration is optional */ }
  };

  const selectMood = (nextMood) => {
    setMood(nextMood);
    const date = new Date().toISOString().slice(0, 10);
    setHistory((items) => [...items.slice(-9), { mood: nextMood, date }]);
  };

  const addTodo = (event) => {
    event.preventDefault();
    const text = newTodo.trim();
    if (!text) return;
    setTodos((items) => [...items, { id: Date.now(), text, done: false }]);
    setNewTodo("");
  };

  const generateInsight = () => {
    const options = smartTips[mood];
    const nextIndex = (tipIndex + 1 + options.length) % options.length;
    setTipIndex(nextIndex);
    setInsight(options[nextIndex]);
  };

  const saveIntention = () => {
    setIntention(intentionDraft.trim());
    setEditingIntention(false);
  };

  const exportSummary = () => {
    const summary = `MoodFocus summary\nMood: ${mood}\nSessions completed: ${sessions}\nTasks: ${completed}/${todos.length}\nIntention: ${intention || "Not set"}`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([summary], { type: "text/plain" }));
    link.download = "moodfocus-summary.txt";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const streak = useMemo(() => Math.min(sessions, 7), [sessions]);

  return (
    <div className={`app ${dark ? "dark" : "light"}`} style={{ "--accent": config.accent, "--soft": config.soft }}>
      <div className="ambient" style={{ background: config.background }} />
      <Header dark={dark} onToggleTheme={() => setDark((value) => !value)} onShowHistory={() => setShowHistory((value) => !value)} />
      <main className="container">
        <section className="hero">
          <div>
            <div className="eyebrow"><span className="pulse" /> FOCUS ROOM · {config.vibe.toUpperCase()} MODE</div>
            <h1>How are you feeling<br /><em>right now?</em></h1>
            <p>Choose your mood and MoodFocus will shape a calmer, more useful work session around it.</p>
          </div>
          <div className="hero-stat"><Flame size={17} /><div><b>{streak}</b><span>session streak</span></div></div>
        </section>

        <MoodPicker moods={MOODS} selected={mood} onSelect={selectMood} />
        <IntentionCard intention={intention} editing={editingIntention} value={intentionDraft} onValueChange={setIntentionDraft} onStartEditing={() => { setIntentionDraft(intention); setEditingIntention(true); }} onSave={saveIntention} />

        <section className="dashboard">
          <FocusTimer mood={mood} config={config} seconds={seconds} running={running} soundOn={soundOn} onToggle={() => setRunning((value) => value === false && seconds === 0 ? true : !value)} onReset={() => { setRunning(false); setSeconds(config.minutes * 60); }} onToggleSound={() => setSoundOn((value) => !value)} />
          <aside className="side-stack">
            <TaskList todos={todos} newTodo={newTodo} progress={progress} onNewTodo={setNewTodo} onAdd={addTodo} onToggle={(id) => setTodos((items) => items.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo))} onDelete={(id) => setTodos((items) => items.filter((todo) => todo.id !== id))} onClearCompleted={() => setTodos((items) => items.filter((todo) => !todo.done))} />
            <InsightCard config={config} insight={insight} onGenerate={generateInsight} />
          </aside>
        </section>

        {showHistory && <MoodHistory history={history} onClose={() => setShowHistory(false)} />}
        <footer><span>MOODFOCUS</span><span>Built for students who want to study with intention.</span><button className="export-btn" onClick={exportSummary}><Download size={13} /> Export summary</button><span><Music2 size={13} /> {soundOn ? "Ambient mode" : "Quiet room"}</span></footer>
      </main>
    </div>
  );
}

export default App;
