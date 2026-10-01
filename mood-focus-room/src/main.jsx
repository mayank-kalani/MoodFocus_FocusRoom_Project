import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Moon, Sun, Play, Pause, RotateCcw, Check, Plus, Trash2,
  Volume2, VolumeX, Sparkles, Clock3, Brain, Target, Flame,
  Coffee, Music2, ChevronRight
} from "lucide-react";
import "./styles.css";

const MOODS = {
  Sleepy: {
    emoji: "😴", label: "Sleepy", subtitle: "Wake your brain gently",
    accent: "#6d5dfc", soft: "#edeaff", bg: "linear-gradient(135deg,#11152b 0%,#20285b 50%,#34236d 100%)",
    timer: 25, quote: "Start small. Momentum will wake you up.",
    tip: "Drink some water, sit upright, and begin with just one easy task.",
    vibe: "calm",
  },
  Stressed: {
    emoji: "😣", label: "Stressed", subtitle: "Slow down. One thing at a time.",
    accent: "#ff6b6b", soft: "#ffe9e9", bg: "linear-gradient(135deg,#28151a 0%,#5b2631 50%,#7a3c45 100%)",
    timer: 15, quote: "You do not need to finish everything. Just finish the next step.",
    tip: "Take 3 slow breaths, write the single most important task, and start there.",
    vibe: "warm",
  },
  Energetic: {
    emoji: "⚡", label: "Energetic", subtitle: "Use the momentum",
    accent: "#ffb020", soft: "#fff4d8", bg: "linear-gradient(135deg,#21160a 0%,#5a3210 48%,#873f16 100%)",
    timer: 45, quote: "Your energy is an advantage. Point it at one clear goal.",
    tip: "Choose a challenging task while your energy is high and remove notifications.",
    vibe: "bright",
  },
  Distracted: {
    emoji: "🌀", label: "Distracted", subtitle: "Reduce noise. Increase clarity.",
    accent: "#21c7a8", soft: "#defbf4", bg: "linear-gradient(135deg,#081e21 0%,#104247 50%,#146056 100%)",
    timer: 20, quote: "Focus is not about never drifting. It is about returning.",
    tip: "Put your phone away, close extra tabs, and commit to only 20 minutes.",
    vibe: "fresh",
  },
  Overwhelmed: {
    emoji: "😵‍💫", label: "Overwhelmed", subtitle: "Make the mountain smaller",
    accent: "#b879ff", soft: "#f1e5ff", bg: "linear-gradient(135deg,#1a1028 0%,#40205e 50%,#5e2876 100%)",
    timer: 10, quote: "Clarity comes after the first small action.",
    tip: "Brain-dump everything, then pick the easiest useful action to start.",
    vibe: "dreamy",
  }
};

const initialTodos = [
  { id: 1, text: "Review today's priority", done: false },
  { id: 2, text: "Complete one focused session", done: false },
];

function App() {
  const [mood, setMood] = useState(localStorage.getItem("mood") || "Energetic");
  const [dark, setDark] = useState(localStorage.getItem("dark") !== "false");
  const [seconds, setSeconds] = useState(MOODS[mood].timer * 60);
  const [running, setRunning] = useState(false);
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem("todos") || "null") || initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const [soundOn, setSoundOn] = useState(false);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("moodHistory") || "[]"));
  const [sessions, setSessions] = useState(() => Number(localStorage.getItem("sessions") || 0));
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("streak") || 0));
  const [showHistory, setShowHistory] = useState(false);
  const [aiTip, setAiTip] = useState("");

  const config = MOODS[mood];

  useEffect(() => localStorage.setItem("mood", mood), [mood]);
  useEffect(() => localStorage.setItem("dark", dark), [dark]);
  useEffect(() => localStorage.setItem("todos", JSON.stringify(todos)), [todos]);
  useEffect(() => localStorage.setItem("moodHistory", JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem("sessions", sessions), [sessions]);
  useEffect(() => localStorage.setItem("streak", streak), [streak]);

  useEffect(() => {
    setSeconds(config.timer * 60);
    setRunning(false);
    setAiTip("");
  }, [mood]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          completeSession();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const completeSession = () => {
    const today = new Date().toISOString().slice(0, 10);
    setSessions(s => s + 1);
    setStreak(s => s + 1);
    setHistory(h => [...h.slice(-9), { mood, date: today }]);
    try { navigator.vibrate?.([100, 50, 100]); } catch {}
    alert("🎉 Focus session complete! Great work.");
  };

  const selectMood = (name) => {
    setMood(name);
    const today = new Date().toISOString().slice(0, 10);
    setHistory(h => [...h.slice(-9), { mood: name, date: today }]);
  };

  const resetTimer = () => {
    setRunning(false);
    setSeconds(config.timer * 60);
  };

  const addTodo = (e) => {
    e?.preventDefault();
    const text = newTodo.trim();
    if (!text) return;
    setTodos(t => [...t, { id: Date.now(), text, done: false }]);
    setNewTodo("");
  };

  const completed = todos.filter(t => t.done).length;
  const progress = todos.length ? Math.round(completed / todos.length * 100) : 0;

  const format = (s) => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  const smartTip = useMemo(() => {
    const tips = {
      Sleepy: ["Try a 30-second stretch before starting.", "Keep the room bright and start with a simple task."],
      Stressed: ["Use box breathing for one minute before you begin.", "Write down distractions instead of acting on them."],
      Energetic: ["Batch your hardest work into this session.", "Keep your phone outside arm's reach."],
      Distracted: ["Use full-screen mode and close every unrelated tab.", "Set one tiny outcome for this session."],
      Overwhelmed: ["Turn your biggest task into a 5-minute first action.", "Make a three-item priority list and ignore the rest for now."]
    };
    return tips[mood][sessions % tips[mood].length];
  }, [mood, sessions]);

  return (
    <div className={`app ${dark ? "dark" : "light"}`} style={{"--accent": config.accent, "--soft": config.soft}}>
      <div className="ambient" style={{background: config.bg}} />
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><Brain size={22}/></div>
          <div><b>MoodFocus</b><span>your personal focus room</span></div>
        </div>
        <div className="top-actions">
          <button className="icon-btn" onClick={() => setShowHistory(v => !v)} title="Mood history"><Clock3 size={18}/></button>
          <button className="icon-btn" onClick={() => setDark(v => !v)} title="Toggle theme">
            {dark ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <div className="eyebrow"><span className="pulse"></span> FOCUS ROOM • {config.vibe.toUpperCase()} MODE</div>
            <h1>How are you feeling<br/><em>right now?</em></h1>
            <p>Choose your mood. We'll shape the room around the way your brain needs to work.</p>
          </div>
          <div className="hero-stat">
            <Flame size={17}/>
            <div><b>{streak}</b><span>focus sessions</span></div>
          </div>
        </section>

        <section className="moods">
          {Object.entries(MOODS).map(([name, m]) => (
            <button key={name} className={`mood-card ${mood === name ? "active" : ""}`} onClick={() => selectMood(name)}>
              <span className="mood-emoji">{m.emoji}</span>
              <span><b>{name}</b><small>{m.timer} min</small></span>
              {mood === name && <span className="selected"><Check size={14}/></span>}
            </button>
          ))}
        </section>

        <section className="dashboard">
          <div className="timer-card glass">
            <div className="card-head">
              <div><span className="label">CURRENT MODE</span><h2>{config.emoji} {mood}</h2></div>
              <button className="sound" onClick={() => setSoundOn(v => !v)}>{soundOn ? <Volume2/> : <VolumeX/>}<span>{soundOn ? "Ambient on" : "Sound off"}</span></button>
            </div>

            <div className="timer-ring" style={{"--progress": `${(seconds/(config.timer*60))*100}%`}}>
              <div className="timer-inner">
                <span>{running ? "FOCUSING" : seconds === 0 ? "DONE" : "READY"}</span>
                <strong>{format(seconds)}</strong>
                <small>{config.subtitle}</small>
              </div>
            </div>

            <div className="timer-controls">
              <button className="primary" onClick={() => setRunning(v => !v)}>
                {running ? <Pause size={18}/> : <Play size={18}/>} {running ? "Pause" : "Start focus"}
              </button>
              <button className="secondary" onClick={resetTimer}><RotateCcw size={17}/> Reset</button>
            </div>

            <div className="quote"><Sparkles size={16}/><span>“{config.quote}”</span></div>
          </div>

          <aside className="side-stack">
            <div className="mini-card glass">
              <div className="mini-title"><Target size={17}/> <b>Today's focus</b><span>{progress}%</span></div>
              <div className="progress"><i style={{width: `${progress}%`}}></i></div>
              <form onSubmit={addTodo} className="todo-add">
                <input value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="Add a task..." />
                <button><Plus size={18}/></button>
              </form>
              <div className="todos">
                {todos.map(t => <div className={`todo ${t.done ? "done":""}`} key={t.id}>
                  <button className="check" onClick={() => setTodos(x => x.map(a => a.id === t.id ? {...a,done:!a.done}:a))}>{t.done && <Check size={13}/>}</button>
                  <span>{t.text}</span>
                  <button className="delete" onClick={() => setTodos(x => x.filter(a => a.id !== t.id))}><Trash2 size={14}/></button>
                </div>)}
              </div>
            </div>

            <div className="mini-card tip-card" style={{background: config.bg}}>
              <div className="tip-top"><Sparkles size={17}/><span>PERSONALIZED TIP</span></div>
              <h3>{aiTip || smartTip}</h3>
              <p>Based on your current mood and focus history.</p>
              <button onClick={() => setAiTip(config.tip)} className="tip-btn">Generate smarter tip <ChevronRight size={15}/></button>
            </div>
          </aside>
        </section>

        {showHistory && (
          <section className="history glass">
            <div className="history-head"><div><span className="label">TODAY</span><h2>Mood history</h2></div><span>{history.length} check-ins</span></div>
            <div className="bars">
              {history.length ? history.map((h,i) => <div className="bar-wrap" key={i} title={`${h.mood} • ${h.date}`}>
                <div className="bar" style={{height: `${35 + (Object.keys(MOODS).indexOf(h.mood)+1)*12}px`, background: MOODS[h.mood].accent}}></div>
                <small>{MOODS[h.mood].emoji}</small>
              </div>) : <p className="empty">Select moods to build your history.</p>}
            </div>
          </section>
        )}

        <footer>
          <span>MOODFOCUS</span><span>Built for students who want to study with intention.</span>
          <span><Music2 size={13}/> {soundOn ? "Ambient mode" : "Quiet room"}</span>
        </footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
