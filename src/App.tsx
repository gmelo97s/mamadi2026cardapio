import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { itemById } from "./data/menu";
import { AppBar } from "./components/chrome/AppBar";
import { BottomNav } from "./components/chrome/BottomNav";
import { FizzLayer, FlyLayer } from "./components/fx/Fx";
import { useFizz, useFlyover } from "./components/fx/useFx";
import { ItemSheet } from "./components/sheet/ItemSheet";
import { Promos } from "./components/home/Cartazes";
import { Cardapio } from "./screens/Cardapio";
import { Footer } from "./screens/Footer";
import { hashFor, parseHash } from "./lib/route";
import { spotId, UIContext, type Origin, type Theme, type UI } from "./lib/ui";

const SearchOverlay = lazy(() => import("./components/search/SearchOverlay"));
const Intro = lazy(() => import("./components/intro/Intro"));

const THEME_KEY = "mamadi:tema";
function initialTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function scrollToSpot(id: string, smooth: boolean) {
  if (id === "topo") return window.scrollTo({ top: 0, behavior: smooth ? "smooth" : ("instant" as ScrollBehavior) });
  document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : ("instant" as ScrollBehavior), block: "start" });
}

export default function App() {
  const initial = useMemo(() => parseHash(), []);
  const [introOpen, setIntroOpen] = useState(!initial.menu && !initial.item && !initial.search);
  const [itemId, setItemId] = useState<string | null>(initial.item ?? null);
  const [search, setSearch] = useState<{ open: boolean; query?: string; voice?: boolean; origin?: Origin; n: number }>({ open: !!initial.search, n: 0 });
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const { bursts, fizz } = useFizz();
  const { sprites, fly } = useFlyover();
  const itemRef = useRef(itemId);
  useEffect(() => {
    itemRef.current = itemId;
  }, [itemId]);

  // link direto para uma categoria
  useEffect(() => {
    if (initial.section && !initial.item) requestAnimationFrame(() => scrollToSpot(`sec-${initial.section}`, false));
    else if (initial.menu) requestAnimationFrame(() => scrollToSpot("cardapio", false));
  }, [initial]);

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

  const goTo = useCallback<UI["goTo"]>(
    (spot, opts) => {
      if (opts?.origin) fizz(opts.origin, { count: 9 });
      if (spot === "cardapio") fly();
      scrollToSpot(spotId(spot), opts?.smooth ?? true);
    },
    [fizz, fly],
  );

  const openItem = useCallback<UI["openItem"]>(
    (id, origin) => {
      if (!itemById.has(id)) return;
      if (origin) fizz(origin, { count: 8, tone: itemById.get(id)!.section === "divas" ? "pink" : "beer" });
      if (itemRef.current) history.replaceState({ sheet: id }, "", hashFor({ item: id }));
      else history.pushState({ sheet: id }, "", hashFor({ item: id }));
      itemRef.current = id;
      setItemId(id);
    },
    [fizz],
  );

  const closeItem = useCallback(() => {
    if (history.state?.sheet) history.back();
    else {
      setItemId(null);
      history.replaceState(null, "", hashFor({}));
    }
  }, []);

  const openSearch = useCallback<UI["openSearch"]>(
    (opts) => {
      if (opts?.origin) fizz(opts.origin, { count: 10 });
      setIntroOpen(false);
      setSearch((s) => ({ open: true, query: opts?.query, voice: opts?.voice, origin: opts?.origin, n: s.n + 1 }));
      // tocar numa tag dentro da ficha: a busca toma o lugar da ficha no histórico
      if (itemRef.current) history.replaceState({ search: true }, "", hashFor({ search: true }));
      else if (!history.state?.search) history.pushState({ search: true }, "", hashFor({ search: true }));
      itemRef.current = null;
      setItemId(null);
    },
    [fizz],
  );

  const closeSearch = useCallback(() => {
    if (history.state?.search) history.back();
    else {
      setSearch((s) => ({ ...s, open: false }));
      history.replaceState(null, "", hashFor({}));
    }
  }, []);

  const openIntro = useCallback(() => setIntroOpen(true), []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#0e0a08" : "#fcf6ea");
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ok */
      }
      return next;
    });
  }, []);

  const ui = useMemo<UI>(
    () => ({ introOpen, goTo, openItem, closeItem, openSearch, closeSearch, openIntro, fizz, theme, toggleTheme }),
    [introOpen, goTo, openItem, closeItem, openSearch, closeSearch, openIntro, fizz, theme, toggleTheme],
  );

  // trava a página por baixo da abertura
  useEffect(() => {
    document.body.classList.toggle("is-intro", introOpen);
  }, [introOpen]);

  return (
    <UIContext.Provider value={ui}>
      <div className="stage">
        <div className="app" id="topo" aria-hidden={introOpen ? true : undefined}>
          <AppBar />
          <main className="page">
            <Promos />
            <Cardapio />
            <Footer />
          </main>
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
                window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
              }}
              onSearch={() => openSearch()}
            />
          )}
        </Suspense>

        <FlyLayer sprites={sprites} />
        <FizzLayer bursts={bursts} />
      </div>
    </UIContext.Provider>
  );
}
