import React from "react";
import { SkillRadar } from "./hrShared";

/* Keep the existing plotting/data model. Numbered axes avoid clipped labels;
   the full skill names and values remain readable in a native-text key. */
export default function DemoSkillRadar({ skills = [], values = {}, targetValues, label }) {
  const plotted = skills.slice(0, 8);
  const valueFor = skill => {
    const value = Number(values[skill.id] ?? values[skill.name] ?? skill.proficiency ?? skill.level ?? 0);
    return Number.isFinite(value) ? Math.max(0, Math.min(5, value)) : 0;
  };
  return <div className="hr-demo-radar">
    <SkillRadar
      skills={plotted.map((skill, index) => ({ ...skill, name: String(index + 1).padStart(2, "0") }))}
      values={Object.fromEntries(plotted.map(skill => [skill.id, valueFor(skill)]))}
      targetValues={targetValues}
      label={label}
    />
    {plotted.length > 0 && <dl className="hr-demo-radar-key" aria-label="Declared skill proficiencies">
      {plotted.map((skill, index) => <div key={skill.id || skill.name}>
        <dt><span>{String(index + 1).padStart(2, "0")}</span>{skill.name || skill.id}</dt>
        <dd>{Math.round(valueFor(skill) * 10) / 10}<span> / 5</span></dd>
      </div>)}
    </dl>}
  </div>;
}
