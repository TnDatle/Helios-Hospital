import { useState, useEffect } from "react";
import SnowEffect from "./SnowEffect";
import PetalEffect from "./PetalEffect";

export default function SeasonalEffect() {
  const [enabled, setEnabled] = useState(true);

  // load trạng thái đã lưu
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
      {/* Nút bật / tắt */}
      <button
        onClick={toggle}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          padding: "8px 12px",
          borderRadius: "20px",
          border: "none",
          cursor: "pointer",
          background: "#2563eb",
          color: "#fff",
          fontSize: 13
        }}
      >
        {enabled ? "Tắt hiệu ứng ✖" : "Bật hiệu ứng ✨"}
      </button>

      {/* Hiệu ứng */}
      {enabled && isChristmas && <SnowEffect />}
      {enabled && isTet && <PetalEffect />}
    </>
  );
}
