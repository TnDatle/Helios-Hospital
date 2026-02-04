import { useState, useEffect } from "react";
import SnowEffect from "./SnowEffect";
import PetalEffect from "./PetalEffect";
import "../../styles/effect.css";

export default function SeasonalEffect() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("seasonalEffect");
    if (saved !== null) {
      setEnabled(saved === "true");
    }
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("seasonalEffect", next);
  };

  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  const isChristmas =
    (month === 12 && date >= 15) ||
    (month === 1 && date <= 5);

  const isTet =
    (month === 1 && date >= 15) ||
    (month === 2 && date <= 15);

  return (
    <>
      {/* Toggle iOS */}
      <div className="season-toggle">
        <span className="season-icon">
          {enabled ? "✨" : "❄️"}
        </span>

        <label className="ios-switch clean">
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggle}
          />
          <span className="slider" />
        </label>
      </div>

      {/* Hiệu ứng */}
      {enabled && isChristmas && <SnowEffect />}
      {enabled && isTet && <PetalEffect />}
    </>
  );
}
