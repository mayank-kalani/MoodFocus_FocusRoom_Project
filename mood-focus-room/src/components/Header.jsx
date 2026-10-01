import { Brain, Moon, Sun, TimerReset } from "lucide-react";

export function Header({ dark, onToggleTheme, onShowHistory }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark"><Brain size={21} /></div>
        <div><b>MoodFocus</b><span>your personal focus room</span></div>
      </div>
      <div className="top-actions">
        <button className="icon-btn" onClick={onShowHistory} title="Open mood history" aria-label="Open mood history"><TimerReset size={18} /></button>
        <button className="icon-btn" onClick={onToggleTheme} title="Toggle theme" aria-label="Toggle theme">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
