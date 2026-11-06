/** Preços sempre em centavos (R$ 29,90 = 2990). */
export type Cents = number;

export type Group = "beber" | "comer";

export type SectionId =
  | "cervejas"
  | "copao"
  | "drinks"
  | "divas"
  | "doses"
  | "prontos"
  | "sem-alcool"
  | "pratos"
  | "porcoes"
  | "lanches"
  | "tabuas";

/** Chaves das ilustrações em src/components/art/Art.tsx */
export type ArtKey =
  | "litrao"
  | "garrafa"
  | "longneck"
  | "lata"
  | "copao"
  | "caipirinha"
  | "longdrink"
  | "dose"
  | "vinho"
  | "gelo"
  | "agua"
  | "suco"
  | "limaosal"
  | "pastel"
  | "batata"
  | "mandioca"
  | "calabresa"
  | "espeto"
  | "couvert"
  | "pao"
  | "coxinha"
  | "lanche"
  | "burger"
  | "tabua"
  | "prato"
  | "baiao"
  | "berinjela"
  | "molho"
  | "queijo"
  | "abacaxi"
  | "vinil";

export type Tag =
  | "novo"
  | "promo"
  | "vegano"
  | "serve2"
  | "fds"
  | "domingo"
  | "sem-alcool"
  | "compartilhar"
  | "da-casa";

export interface Variant {
  label: string;
  price: Cents;
}

export interface OptionGroup {
  label: string;
  values: string[];
}

export interface DivaInfo {
  artist: string;
  /** frase do "COMO É" do cardápio */
  hook: string;
  /** cores da capa do single (fruta do drink) */
  colors: [string, string];
}

export interface Item {
  id: string;
  name: string;
  section: SectionId;
  desc?: string;
  /** preço único */
  price?: Cents;
  /** preços por tamanho/porção (meia e inteira, copo 150 ml e 550 ml…) */
  variants?: Variant[];
  /** o preço vale para esta quantidade ("2 copões", "garrafa", "4 unidades"…) */
  unit?: string;
  options?: OptionGroup[];
  tags?: Tag[];
  art: ArtKey;
  /** cor principal da arte (rótulo da garrafa, bebida no copo…) */
  color?: string;
  diva?: DivaInfo;
  /** palavras extras para a busca */
  keywords?: string[];
  /** foto do item (próxima etapa); sem foto, aparece a ilustração */
  photo?: string;
  /**
   * Item que não está nos PDFs de 06/11/2026 e veio do cardápio anterior
   * (promoções de litrão/caipirinha e coxinha). Confirmar preço com o bar.
   */
  confirmar?: boolean;
}

export interface Section {
  id: SectionId;
  group: Group;
  title: string;
  /** rótulo curto do chip */
  short: string;
  /** anotação à mão abaixo do título */
  note: string;
  art: ArtKey;
  /** subtítulos dentro da seção (ex.: "600 ml") — ids dos itens que abrem cada bloco */
  blocks?: { title: string; from: string }[];
}
