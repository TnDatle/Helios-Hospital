import "../../styles/effect.css";

export default function PetalEffect() {
  return (
    <div className="effect-layer">
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="petal"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${10 + Math.random() * 12}s`,
            fontSize: `${14 + Math.random() * 10}px`
          }}
        >
          🌸
        </span>
      ))}
    </div>
  );
}
