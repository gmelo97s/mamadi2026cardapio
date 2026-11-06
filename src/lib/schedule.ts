import { KITCHEN } from "../data/menu";

const DAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

/** Dia da semana e hora em São Paulo, qualquer que seja o fuso do aparelho. */
export function nowSP(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { weekday, hour: Number(get("hour")), minute: Number(get("minute")) };
}

export type Period = "manha" | "tarde" | "noite" | "madrugada";
export function period(hour: number): Period {
  if (hour >= 5 && hour < 12) return "manha";
  if (hour >= 12 && hour < 18) return "tarde";
  if (hour >= 18 || hour < 1) return "noite";
  return "madrugada";
}

export function greeting(hour: number) {
  const p = period(hour);
  if (p === "manha") return "Bom dia";
  if (p === "tarde") return "Boa tarde";
  return "Boa noite";
}

export interface KitchenStatus {
  open: boolean;
  /** frase curta para o selo */
  label: string;
  /** frase completa */
  detail: string;
}

/** Comidinhas caseiras: quarta a domingo, 12h às 19h. */
export function kitchenStatus(d = new Date()): KitchenStatus {
  const { weekday, hour } = nowSP(d);
  const servesToday = KITCHEN.days.includes(weekday);
  if (servesToday && hour >= KITCHEN.open && hour < KITCHEN.close) {
    return { open: true, label: `Comidinhas até ${KITCHEN.close}h`, detail: `A cozinha da Mamadi está servindo até as ${KITCHEN.close}h.` };
  }
  if (servesToday && hour < KITCHEN.open) {
    return { open: false, label: `Comidinhas a partir das ${KITCHEN.open}h`, detail: `Hoje as comidinhas saem a partir das ${KITCHEN.open}h.` };
  }
  // próximo dia de cozinha
  let next = (weekday + 1) % 7;
  while (!KITCHEN.days.includes(next)) next = (next + 1) % 7;
  const when = next === (weekday + 1) % 7 ? "amanhã" : DAYS[next];
  return {
    open: false,
    label: `Comidinhas ${when}, ${KITCHEN.open}h`,
    detail: `As comidinhas caseiras saem de quarta a domingo, das ${KITCHEN.open}h às ${KITCHEN.close}h. Próxima: ${when}.`,
  };
}

/** Especiais do dia: churrasco no sábado e domingo, baião no domingo. */
export function todaySpecials(d = new Date()) {
  const { weekday } = nowSP(d);
  const ids: string[] = [];
  if (weekday === 6 || weekday === 0) ids.push("churrasco-da-mamadi");
  if (weekday === 0) ids.push("baiao-de-dois");
  return { weekday, dayName: DAYS[weekday], ids };
}

export function isAvailableToday(tags: string[] | undefined, d = new Date()) {
  const { weekday } = nowSP(d);
  if (tags?.includes("domingo")) return weekday === 0;
  if (tags?.includes("fds")) return weekday === 6 || weekday === 0;
  return true;
}
