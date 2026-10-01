import { Check } from "lucide-react";

export function MoodPicker({ moods, selected, onSelect }) {
  return (
    <section className="moods" aria-label="Choose your current mood">
      {Object.entries(moods).map(([name, mood]) => (
        <button key={name} className={`mood-card ${selected === name ? "active" : ""}`} onClick={() => onSelect(name)}>
          <span className="mood-emoji">{mood.emoji}</span>
          <span><b>{name}</b><small>{mood.minutes} min reset</small></span>
          {selected === name && <span className="selected"><Check size={14} /></span>}
        </button>
      ))}
    </section>
  );
}
