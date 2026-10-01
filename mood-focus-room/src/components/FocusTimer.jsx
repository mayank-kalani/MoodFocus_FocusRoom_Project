import { Pause, Play, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";

function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function FocusTimer({ mood, config, seconds, running, soundOn, onToggle, onReset, onToggleSound }) {
  const progress = Math.max(0, Math.min(100, (seconds / (config.minutes * 60)) * 100));

  return (
    <section className="timer-card glass">
      <div className="card-head">
        <div><span className="label">CURRENT MODE</span><h2>{config.emoji} {mood}</h2></div>
        <button className="sound" onClick={onToggleSound} aria-label="Toggle ambient sound">
          {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>{soundOn ? "Ambient on" : "Quiet room"}</span>
        </button>
      </div>
      <div className="timer-ring" style={{ "--progress": `${progress}%` }}>
        <div className="timer-inner">
          <span>{running ? "FOCUSING" : seconds === 0 ? "COMPLETE" : "READY"}</span>
          <strong>{formatTime(seconds)}</strong>
          <small>{config.subtitle}</small>
        </div>
      </div>
      <div className="timer-controls">
        <button className="primary" onClick={onToggle}>{running ? <Pause size={18} /> : <Play size={18} />}{running ? "Pause focus" : "Start focus"}</button>
        <button className="secondary" onClick={onReset}><RotateCcw size={17} /> Reset</button>
      </div>
      <div className="quote"><Sparkles size={16} /><span>“{config.quote}”</span></div>
    </section>
  );
}
