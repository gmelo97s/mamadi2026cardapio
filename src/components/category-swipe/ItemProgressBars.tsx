interface ItemProgressBarsProps {
  total: number;
  active: number;
}

export default function ItemProgressBars({ total, active }: ItemProgressBarsProps) {
  if (total <= 0) return null;

  return (
    <div
      className="item-progress-bars"
      role="tablist"
      aria-label={`Item ${active + 1} de ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          role="tab"
          aria-selected={i === active}
          className={`item-progress-bars__bar${i === active ? " is-active" : ""}`}
        />
      ))}
    </div>
  );
}
