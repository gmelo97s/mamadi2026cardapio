# Mamadi · Cardápio digital

Cardápio do **Bar Mamadi**, em frente à Praça Roosevelt (Rua João Guimarães Rosa, 241, São Paulo).
Feito para o celular, com cara de app. Comida de mãe, drink de diva.

No ar: https://mamadi2026cardapio.vercel.app

## A experiência

- **Abertura com a tampinha**: o logo virou uma tampinha de cerveja em 3D, com um abridor engatado. A pessoa puxa a etiqueta "puxa pra abrir o cardápio" (ou toca, ou desliza pra cima): a tampinha estoura girando, espirra espuma, a cerveja sobe e enche a tela e o cardápio aparece por baixo. O mascote original fica impresso no topo da tampinha, com a faixa nova só com "Mamadi". Tocar na tampinha do topo do app volta para a abertura.
- **Frases animadas na abertura**: "Comida de mãe...", "Litrão gelado", "Maior bar LGBT de SP" (em neon com as cores do orgulho) e "Viva a democracia!".
- **Página única e fluida** (como o Botanikafe): Promoções e Combos → cardápio inteiro com as categorias fixas no topo → informações da casa. No computador ocupa a tela toda, em colunas.
- **Modo noite (preto e laranja, padrão) e modo dia**, no botão do topo.
- **Menu inferior (celular)**: Início, Cardápio, Pesquisa, iFood e Instagram.
- **Promoções e Combos**: carrossel automático e rápido, no estilo dos cartazes de oferta pintados à mão. Os cartazes de dia certo (churrasco no sábado e no domingo, baião no domingo, executivo de quarta a sexta) só aparecem no dia e vão para a frente com "Hoje tem!".
- **Tags que pesquisam**: tocar em "vegano", "promo", "#queijo", "#maracujá"… (na lista ou na ficha) abre a busca com todos os itens daquela tag.
- **Ficha do item**: cabe inteira na tela, no celular e no computador, sem precisar rolar para ver as **3 sugestões de "Combina com"**, escolhidas à mão e com o motivo (ex.: Baião de Dois → Caipirinha Viva o Nordeste, "Tudo nordestino, tudo nosso").
- **Divas Pop**: a seção vira uma pista escura, com cada drink numa capa de disco nas cores da fruta. Na ficha, o vinil sai da capa e gira.
- **Comidinhas da Mamadi**: mostram o dia em que saem e se a cozinha está aberta agora (quarta a domingo, 12h às 19h, no horário de São Paulo).
- **Busca inteligente por voz e texto**: entende frases como "O que tem de mais barato do que na Borba?", "O que posso comprar até R$20?", "drink da Anitta", "o que combina com coxinha?", "tem coisa vegana?", "pra dividir com a galera", "sem álcool" ou "me surpreende". Também entende gíria (breja, cerva, rango), erro de digitação e correção na fala ("um litrão de original… na verdade amstel"). A voz usa o reconhecimento do próprio navegador (Chrome/Android, Safari/iPhone). Se a pessoa fica parada sem escolher, aparece "Posso te sugerir algo?".
- **Transições**: bolhas de cerveja que estouram onde a pessoa toca, e rodelas de limão e gelo que cruzam a tela ao entrar em "Beber". Com "reduzir movimento" ligado no celular, tudo fica parado.

## Onde mexer

| O quê | Arquivo |
|---|---|
| Itens, preços, descrições, sabores e tags | `src/data/menu.ts` (preços em centavos: R$ 29,90 = `R(29.9)`) |
| Cartazes do carrossel (promoções/novidades) | `src/data/cartaz.ts` |
| Sugestões "Combina com" | `src/data/pairings.ts` |
| Endereço, Instagram, iFood, horário | `src/data/casa.ts` |
| Horário da cozinha | `KITCHEN` em `src/data/menu.ts` |
| Cores e fontes | `src/styles/global.css` (`:root`) |

### Fotos dos itens (próxima etapa)

Cada item aceita `photo: "/fotos/coxinha.webp"`. Com foto, a imagem entra no lugar da ilustração, na lista e na ficha. É só colocar o arquivo em `public/fotos/`.

### Itens para confirmar com o bar

Alguns itens não estão nos PDFs de 06/11/2026 e vieram do cardápio anterior. Estão marcados com `confirmar: true` em `src/data/menu.ts`: **3 Litrão Brahma ou Skol (R$ 45)**, **3 Litrão Original (R$ 60)**, **3 Caipirinhas de limão (R$ 30)** e **Coxinha (4 unidades, R$ 18)**.

## Rodar e publicar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera dist/
```

A Vercel publica sozinha a cada push na `main`.

Atalhos de link: `/#/cardapio`, `/#/cardapio/porcoes`, `/#/item/coxinha`, `/#/busca` (abrem direto, sem a abertura).

## Arte da marca

- `design/brand/logo-original.png`: logo original enviado pelo bar.
- `scripts/extract-mascot.py`: recorta o mascote do logo (o disco laranja com o chapéu).
- `design/brand/cap-print.html` → `scripts/render-brand.mjs`: monta a arte do topo da tampinha (mascote + anéis + estrelas + faixa "Mamadi" + letreiro da borda).
- `design/render/poster.html` → `scripts/render-poster.mjs`: foto estática da tampinha 3D (primeira imagem da abertura, ícones do app).
- `design/render/og.html` → `scripts/render-og.mjs`: imagem de prévia do link (WhatsApp, Instagram).

Os scripts de render usam o Playwright e precisam do `npm run dev` rodando.
