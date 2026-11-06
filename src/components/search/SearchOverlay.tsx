import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { m } from "motion/react";
import { EXAMPLES, search, type SearchOutput } from "../../lib/search";
import { useVoice, voiceSupported } from "../../lib/voice";
import { haptic, prefersReducedMotion, type Origin } from "../../lib/ui";
import { IcLupa, IcMic, IcRelogio, IcX } from "../chrome/icons";
import { ItemRow } from "../menu/ItemRow";
import { useTyping } from "./useTyping";
import "./search.css";

const RECENT_KEY = "mamadi:buscas";
function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]").slice(0, 5);
  } catch {
    return [];
  }
}
function saveRecent(q: string) {
  const t = q.trim();
  if (t.length < 3) return;
  try {
    const list = [t, ...loadRecent().filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    /* ok */
  }
}

interface Props {
  initialQuery?: string;
  startVoice?: boolean;
  origin?: Origin;
  onClose: () => void;
}

export default function SearchOverlay({ initialQuery = "", startVoice = false, origin, onClose }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [disabled, setDisabled] = useState<Set<string>>(new Set());
  const [spin, setSpin] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recent] = useState(loadRecent);
  const canVoice = voiceSupported();
  const typing = useTyping(EXAMPLES, !query);

  const voice = useVoice((text, final) => {
    setQuery(text);
    setDisabled(new Set());
    if (final) {
      haptic(12);
      saveRecent(text);
    }
  });
  const listening = voice.state === "listening";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const out: SearchOutput | null = useMemo(() => (query.trim() ? search(query, disabled) : null), [query, disabled, spin]);

  useEffect(() => {
    document.body.classList.add("is-locked");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    if (startVoice && canVoice) voice.start();
    else window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 120);
    return () => {
      document.body.classList.remove("is-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setQ = (q: string) => {
    setQuery(q);
    setDisabled(new Set());
    saveRecent(q);
  };

  const o = origin ?? { x: window.innerWidth / 2, y: window.innerHeight - 40 };
  const reduced = prefersReducedMotion();

  return (
    <m.div
      className="search"
      role="dialog"
      aria-modal="true"
      aria-label="Buscar no cardápio"
      initial={reduced ? { opacity: 0 } : { clipPath: `circle(0px at ${o.x}px ${o.y}px)` }}
      animate={reduced ? { opacity: 1 } : { clipPath: `circle(150% at ${o.x}px ${o.y}px)` }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="search__inner">
        <form
          className="search__bar"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            saveRecent(query);
            inputRef.current?.blur();
          }}
        >
          <label className="search__field">
            <IcLupa className="search__lupa" />
            <input
              ref={inputRef}
              className="search__input"
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setDisabled(new Set());
              }}
              aria-label="O que você quer?"
            />
            {!query && (
              <span className="search__ph" aria-hidden="true">
                {listening ? "Pode falar…" : (
                  <>
                    Busque: <span className="search__typed">{typing}</span>
                    <span className="search__caret" />
                  </>
                )}
              </span>
            )}
            {query && (
              <button
                type="button"
                className="search__clear"
                aria-label="Limpar busca"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
              >
                <IcX />
              </button>
            )}
          </label>
          {canVoice && (
            <button
              type="button"
              className={`search__mic${listening ? " is-on" : ""}`}
              aria-pressed={listening}
              aria-label={listening ? "Parar de ouvir" : "Buscar por voz"}
              onClick={() => {
                haptic(10);
                if (listening) voice.stop();
                else {
                  inputRef.current?.blur();
                  voice.start();
                }
              }}
            >
              <IcMic />
            </button>
          )}
          <button type="button" className="search__close" onClick={onClose}>
            Fechar
          </button>
        </form>

        <div className="search__body">
          {listening && <Listening text={query} onStop={voice.stop} />}

          {!listening && voice.state === "denied" && (
            <p className="search__notice">Para buscar por voz, libere o microfone para este site nas configurações do navegador. Ou digite ali em cima.</p>
          )}
          {!listening && voice.state === "nomatch" && !query && <p className="search__notice">Não ouvi nada. Toca no microfone e fala de novo, pertinho do celular.</p>}

          {!listening && !out && (
            <div className="search__empty">
              {canVoice && (
                <button className="voice-cta" onClick={() => voice.start()}>
                  <span className="voice-cta__disc">
                    <IcMic />
                  </span>
                  <span>
                    <strong>Toca e fala o que você quer</strong>
                    <span className="hand">“um litrão até 20 conto”, “o que combina com a batata?”</span>
                  </span>
                </button>
              )}
              <p className="search__label">Experimenta</p>
              <div className="search__chips">
                {EXAMPLES.map((ex) => (
                  <button key={ex} className="s-chip" onClick={() => setQ(ex)}>
                    {ex}
                  </button>
                ))}
              </div>
              {recent.length > 0 && (
                <>
                  <p className="search__label">Buscas recentes</p>
                  <div className="search__chips">
                    {recent.map((r) => (
                      <button key={r} className="s-chip s-chip--recent" onClick={() => setQ(r)}>
                        <IcRelogio /> {r}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {!listening && out && (
            <div className="search__results">
              {out.chips.length > 0 && (
                <div className="intent" aria-label="O que eu entendi">
                  <span className="intent__label hand">entendi:</span>
                  {out.chips.map((c) =>
                    c.k === "note" ? (
                      <span key={c.label} className={`intent__chip intent__chip--${c.k}`}>
                        {c.label}
                      </span>
                    ) : (
                      <button
                        key={c.label}
                        className={`intent__chip intent__chip--${c.k}`}
                        onClick={() => setDisabled((d) => new Set(d).add(c.k === "pair" ? "pair" : c.label))}
                        aria-label={`Remover filtro ${c.label}`}
                      >
                        {c.label} <IcX />
                      </button>
                    ),
                  )}
                </div>
              )}

              {out.allergy && (
                <p className="search__notice search__notice--warn">
                  O cardápio não traz informação de alérgenos (glúten, lactose…). Antes de pedir, confirme com a equipe.
                </p>
              )}

              {out.surprise && (
                <div className="surprise">
                  <p className="hand surprise__t">A Mamadi escolheu pra você:</p>
                  <button className="s-chip s-chip--spin" onClick={() => setSpin((n) => n + 1)}>
                    Outra sugestão
                  </button>
                </div>
              )}

              {out.relaxed && out.results.length > 0 && <p className="search__notice">Não achei exatamente isso. Olha o que chega mais perto:</p>}

              {out.results.length === 0 && out.allergy ? null : out.results.length > 0 ? (
                <ul className="rows search__list">
                  {out.results.map((r, i) => (
                    <li key={r.item.id} className="search__res" style={{ "--i": i } as CSSProperties}>
                      {r.why && (out.pairFor || out.surprise) && <span className="search__why hand">{r.why}</span>}
                      <ul className="rows">
                        <ItemRow item={r.item} />
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="search__none">
                  <p className="letreiro search__none-t">Hmm…</p>
                  <p>
                    Não achei nada com “{query}”.
                    {out.suggestion && (
                      <>
                        {" "}
                        Você quis dizer{" "}
                        <button className="link" onClick={() => setQ(out.suggestion!)}>
                          {out.suggestion}
                        </button>
                        ?
                      </>
                    )}
                  </p>
                  <p className="search__tips">Tenta “litrão”, “caipirinha”, “porção”, “lanche” ou o nome de uma diva.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </m.div>
  );
}

function Listening({ text, onStop }: { text: string; onStop: () => void }) {
  return (
    <div className="listen" aria-live="polite">
      <button className="listen__disc" onClick={onStop} aria-label="Parar de ouvir">
        <span className="listen__ring" />
        <span className="listen__ring listen__ring--2" />
        <span className="listen__bubbles" aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} style={{ "--i": i } as CSSProperties} />
          ))}
        </span>
        <IcMic />
      </button>
      <p className="listen__state hand">Ouvindo…</p>
      <p className="listen__text">{text || "Fala o que você quer: um drink, uma porção, um preço…"}</p>
    </div>
  );
}
