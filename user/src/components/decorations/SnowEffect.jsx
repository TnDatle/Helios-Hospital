import "../../styles/effect.css";

export default function SnowEffect() {
  return (
    <div className="effect-layer">
      {Array.from({ length: 35 }).map((_, i) => (
        <span
          key={i}
          className="snow"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 10}s`,
            fontSize: `${10 + Math.random() * 12}px`
          }}
        >
          ❄
        </span>
      ))}
    </div>
  );
}
