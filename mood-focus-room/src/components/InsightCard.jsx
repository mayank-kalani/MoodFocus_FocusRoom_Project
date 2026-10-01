import { ChevronRight, Sparkles } from "lucide-react";

export function InsightCard({ config, insight, onGenerate }) {
  return (
    <section className="mini-card tip-card" style={{ background: config.background }}>
      <div className="tip-top"><Sparkles size={17} /><span>PERSONALIZED TIP</span></div>
      <h3>{insight || config.tip}</h3>
      <p>Small adjustments make your current energy easier to work with.</p>
      <button onClick={onGenerate} className="tip-btn">Generate another tip <ChevronRight size={15} /></button>
    </section>
  );
}
