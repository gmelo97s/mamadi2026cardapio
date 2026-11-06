import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { domAnimation, LazyMotion, m, MotionConfig } from "motion/react";
import type { SectionId } from "./data/types";
import { itemById, sectionById } from "./data/menu";
import { AppBar } from "./components/chrome/AppBar";
import { BottomNav } from "./components/chrome/BottomNav";
import { FizzLayer, FlyLayer } from "./components/fx/Fx";
import { useFizz, useFlyover } from "./components/fx/useFx";
import { ItemSheet } from "./components/sheet/ItemSheet";
import { Home } from "./screens/Home";
import { MenuScreen } from "./screens/MenuScreen";
import { Casa } from "./screens/Casa";
import { hashFor, parseHash } from "./lib/route";
import { UIContext, type Origin, type Tab, type UI } from "./lib/ui";

const SearchOverlay = lazy(() => import("./components/search/SearchOverlay"));
const Intro = lazy(() => import("./components/intro/Intro"));

export default function App() {
  const initial = useMemo(() => parseHash(), []);
  const [introOpen, setIntroOpen] = useState(!initial.tab && !initial.item && !initial.search);
  const [tab, setTab] = useState<Tab>(initial.tab ?? "inicio");
  const [focus, setFocus] = useState<{ section?: SectionId; n: number }>({ section: initial.section, n: 0 });
  const [itemId, setItemId] = useState<string | null>(initial.item ?? null);
  const [search, setSearch] = useState<{ open: boolean; query?: string; voice?: boolean; origin?: Origin; n: number }>({ open: !!initial.search, n: 0 });
  const { bursts, fizz } = useFizz();
  const { sprites, fly } = useFlyover();
  const scrollMemo = useRef<Record<Tab, number>>({ inicio: 0, beber: 0, comer: 0, casa: 0 });
  const tabRef = useRef(tab);
  useLayoutEffect(() => {
    tabRef.current = tab;
  }, [tab]);

  // "voltar" do celular fecha a ficha ou a busca
  useEffect(() => {
    const onPop = () => {
      const r = parseHash();
      setItemId(r.item ?? null);
      setSearch((s) => (r.search ? (s.open ? s : { open: true, n: s.n + 1 }) : s.open ? { ...s, open: false } : s));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const goTab = useCallback<UI["goTab"]>((next, opts) => {
    const prev = tabRef.current;
    if (prev !== next) {
      scrollMemo.current[prev] = window.scrollY;
      setTab(next);
      if (next === "beber") fly();
    }
    setFocus((f) => ({ section: opts?.section, n: f.n + 1 }));
    if (opts?.origin) fizz(opts.origin, { count: 9 });
    history.replaceState(history.state, "", hashFor({ tab: next, section: opts?.section }));
  }, [fizz, fly]);

  const openItem = useCallback<UI["openItem"]>((id, origin) => {
    if (!itemById.has(id)) return;
    if (origin) fizz(origin, { count: 8, tone: itemById.get(id)!.section === "divas" ? "pink" : "beer" });
    setItemId((cur) => {
      if (cur) history.replaceState({ sheet: id }, "", hashFor({ item: id }));
      else history.pushState({ sheet: id }, "", hashFor({ item: id }));
      return id;
    });
  }, [fizz]);

  const closeItem = useCallback(() => {
    if (history.state?.sheet) history.back();
    else {
      setItemId(null);
      history.replaceState(null, "", hashFor({ tab: tabRef.current }));
    }
  }, []);

  const openSearch = useCallback<UI["openSearch"]>((opts) => {
    if (opts?.origin) fizz(opts.origin, { count: 10 });
    setIntroOpen(false);
    setSearch((s) => ({ open: true, query: opts?.query, voice: opts?.voice, origin: opts?.origin, n: s.n + 1 }));
    if (!history.state?.search) history.pushState({ search: true }, "", hashFor({ search: true }));
  }, [fizz]);

  const closeSearch = useCallback(() => {
    if (history.state?.search) history.back();
    else {
      setSearch((s) => ({ ...s, open: false }));
      history.replaceState(null, "", hashFor({ tab: tabRef.current }));
    }
  }, []);

  const openIntro = useCallback(() => {
    scrollMemo.current[tabRef.current] = window.scrollY;
    setIntroOpen(true);
  }, []);

  const ui = useMemo<UI>(
    () => ({ tab, introOpen, goTab, openItem, closeItem, openSearch, closeSearch, openIntro, fizz: (o: Origin, opts) => fizz(o, opts) }),
    [tab, introOpen, goTab, openItem, closeItem, openSearch, closeSearch, openIntro, fizz],
  );

  // rolagem: cada aba lembra onde parou; foco em seção rola até ela
  useLayoutEffect(() => {
    if (focus.section) return; // MenuScreen cuida
    window.scrollTo({ top: scrollMemo.current[tab] ?? 0, behavior: "instant" as ScrollBehavior });
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // trava a página por baixo da abertura
  useEffect(() => {
    document.body.classList.toggle("is-intro", introOpen);
  }, [introOpen]);

  const focusGroup = focus.section ? sectionById.get(focus.section)?.group : undefined;

  return (
    <UIContext.Provider value={ui}>
      <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="stage">
          <div className="app" aria-hidden={introOpen ? true : undefined}>
            <AppBar />
            <m.main
              key={tab}
              className="screen"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {tab === "inicio" && <Home />}
              {(tab === "beber" || tab === "comer") && (
                <MenuScreen group={tab} focus={focusGroup === tab ? focus.section : undefined} focusNonce={focus.n} />
              )}
              {tab === "casa" && <Casa />}
            </m.main>
            <BottomNav />
          </div>

          <ItemSheet itemId={itemId} onClose={closeItem} />

          <Suspense fallback={null}>
            {search.open && <SearchOverlay key={search.n} initialQuery={search.query} startVoice={search.voice} origin={search.origin} onClose={closeSearch} />}
          </Suspense>

          <Suspense fallback={null}>
            {introOpen && (
              <Intro
                onOpened={() => {
                  setIntroOpen(false);
                  requestAnimationFrame(() => window.scrollTo({ top: scrollMemo.current[tabRef.current] ?? 0, behavior: "instant" as ScrollBehavior }));
                }}
                onSearch={() => openSearch()}
              />
            )}
          </Suspense>

          <FlyLayer sprites={sprites} />
          <FizzLayer bursts={bursts} />
        </div>
      </MotionConfig>
      </LazyMotion>
    </UIContext.Provider>
  );
}
