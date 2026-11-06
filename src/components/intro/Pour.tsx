import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import "./pour.css";

/*
 * A cerveja sobe e enche a tela (com colarinho de espuma e bolhas),
 * passa por cima de tudo e revela o cardápio por baixo.
 */
export function Pour({ onCovered, onDone }: { onCovered: () => void; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const cbs = useRef({ onCovered, onDone });
  useLayoutEffect(() => {
    cbs.current = { onCovered, onDone };
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const total = 1500;
    const anim = el.animate(
      [
        { transform: "translate3d(0, 100dvh, 0)", easing: "cubic-bezier(.3,.7,.35,1)" },
        { transform: "translate3d(0, -12dvh, 0)", offset: 0.44, easing: "linear" },
        { transform: "translate3d(0, -22dvh, 0)", offset: 0.56, easing: "cubic-bezier(.55,0,.6,.3)" },
        { transform: "translate3d(0, -175dvh, 0)" },
      ],
      { duration: total, fill: "forwards" },
    );
    const covered = window.setTimeout(() => cbs.current.onCovered(), total * 0.47);
    anim.onfinish = () => cbs.current.onDone();
    return () => {
      window.clearTimeout(covered);
      anim.cancel();
    };
  }, []);

  return (
    <div className="pour" aria-hidden="true">
      <div className="pour__liquid" ref={ref}>
        <svg className="pour__foam" viewBox="0 0 400 60" preserveAspectRatio="none">
          <path
            d="M0 60V34c14-10 22-14 34-8 8-14 26-18 38-6 10-12 30-14 40 0 12-12 30-10 38 2 14-12 32-12 42 2 10-10 28-12 38 0 12-10 30-8 38 4 10-12 30-14 42-2 12-10 26-8 34 2 12-8 22-6 34 4 2 0 2 0 22 2V60z"
            fill="#fff7e8"
          />
          <path d="M0 60V44c40 6 80-8 120 0s80 8 120-2 80-6 120 2 30 0 40-2V60z" fill="#ffe9c6" />
        </svg>
        <div className="pour__body">
          {Array.from({ length: 34 }, (_, i) => (
            <span
              key={i}
              className="pour__bubble"
              style={
                {
                  "--x": `${(i * 37) % 100}%`,
                  "--s": `${5 + ((i * 7) % 11)}px`,
                  "--d": `${(i % 9) * -0.17}s`,
                  "--t": `${1.1 + ((i * 13) % 9) / 10}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div className="pour__tail" />
      </div>
    </div>
  );
}
