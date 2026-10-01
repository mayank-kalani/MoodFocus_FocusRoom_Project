import { MOODS } from "../data/moods";

export function MoodHistory({ history, onClose }) {
  return (
    <section className="history glass" id="history">
      <div className="history-head"><div><span className="label">RECENT CHECK-INS</span><h2>Mood history</h2></div><button className="history-close" onClick={onClose}>Hide</button></div>
      <div className="bars">
        {history.length ? history.map((entry, index) => (
          <div className="bar-wrap" key={`${entry.date}-${index}`} title={`${entry.mood} · ${entry.date}`}>
            <div className="bar" style={{ height: `${35 + (Object.keys(MOODS).indexOf(entry.mood) + 1) * 12}px`, background: MOODS[entry.mood].accent }} />
            <small>{MOODS[entry.mood].emoji}</small>
          </div>
        )) : <p className="empty">Select a mood to start building your history.</p>}
      </div>
    </section>
  );
}
