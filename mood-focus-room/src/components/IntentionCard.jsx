import { ArrowRight, PencilLine } from "lucide-react";

export function IntentionCard({ intention, editing, value, onValueChange, onStartEditing, onSave }) {
  return (
    <section className="intention-card">
      <div className="intention-icon"><PencilLine size={17} /></div>
      <div className="intention-copy">
        <span className="label">TODAY'S INTENTION</span>
        {editing ? <input autoFocus value={value} onChange={(event) => onValueChange(event.target.value)} onKeyDown={(event) => event.key === "Enter" && onSave()} placeholder="What would make today feel meaningful?" /> : <h3>{intention || "Choose one meaningful thing to move forward."}</h3>}
      </div>
      <button className="intention-action" onClick={editing ? onSave : onStartEditing} aria-label={editing ? "Save intention" : "Edit intention"}>{editing ? <ArrowRight size={18} /> : <PencilLine size={17} />}</button>
    </section>
  );
}
