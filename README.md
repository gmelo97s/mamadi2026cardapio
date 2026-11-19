# Mamadi · Cardápio digital

Cardápio do **Bar Mamadi**, em frente à Praça Roosevelt (Rua João Guimarães Rosa, 241, São Paulo).
Feito para o celular, com cara de app. Comida de mãe, drink de diva.

No ar: https://mamadi2026cardapio.vercel.app

## A experiência

- **Abertura com a tampinha**: o logo virou uma tampinha de cerveja em 3D, com um abridor engatado. A pessoa puxa a etiqueta "puxa pra abrir o cardápio" (ou toca, ou desliza pra cima): a tampinha estoura girando, espirra espuma, a cerveja sobe e enche a tela e o cardápio aparece por baixo. O mascote original fica impresso no topo da tampinha, com a faixa nova só com "Mamadi". Tocar na tampinha do topo do app volta para a abertura.
- **Puxar o abridor**: segurar e arrastar para baixo na tampinha ou na etiqueta puxa o abridor de verdade (vibra a cada terço) e, passando da metade, estoura a tampinha.
- **Frases animadas na abertura** (palavra por palavra, saindo do desfoque, com brilho passando): "Comida de mãe...", "Litrão gelado", "Maior bar LGBT de SP" (em neon com as cores do orgulho) e "Viva a democracia!".
- **Página única e fluida** (como o Botanikafe): Promoções e Combos → cardápio inteiro com as categorias fixas no topo → informações da casa. No computador ocupa a tela toda, em colunas.
- **Modo noite (preto e laranja, padrão) e modo dia**, no botão do topo.
- **Menu inferior (celular)**: Início, Cardápio, Pesquisa, iFood e Instagram.
- **Promoções e Combos**: cards no formato das Novidades do Botanikafe (foto, selo, nome, descrição, preço e "Ver"), girando em loop contínuo; dá para arrastar e desacelera com o mouse em cima. Os cartazes de dia certo (churrasco no sábado e no domingo, baião no domingo, executivo de quarta a sexta) só aparecem no dia e vão para a frente com "Hoje tem!".
- **Tags que pesquisam**: tocar em "vegano", "promo", "#queijo", "#maracujá"… (na lista ou na ficha) abre a busca com todos os itens daquela tag.
- **Ficha do item**: cabe inteira na tela, no celular e no computador, sem precisar rolar para ver as **3 sugestões de "Combina com"**, escolhidas à mão e com o motivo (ex.: Baião de Dois → Caipirinha Viva o Nordeste, "Tudo nordestino, tudo nosso").
- **Divas Pop**: a seção vira uma pista escura, com cada drink numa capa de disco nas cores da fruta. Na ficha, o vinil sai da capa e gira.
- **Comidinhas da Mamadi**: mostram o dia em que saem e se a cozinha está aberta agora (quarta a domingo, 12h às 19h, no horário de São Paulo).
- **Busca inteligente por voz e texto**: entende frases como "O que tem de mais barato do que na Borba?", "O que posso comprar até R$20?", "drink da Anitta", "o que combina com coxinha?", "tem coisa vegana?", "pra dividir com a galera", "sem álcool" ou "me surpreende". Também entende gíria (breja, cerva, rango), erro de digitação e correção na fala ("um litrão de original… na verdade amstel"). A voz usa o reconhecimento do próprio navegador (Chrome/Android, Safari/iPhone). Se a pessoa fica parada sem escolher, aparece "Posso te sugerir algo?".
- **Transições**: bolhas de cerveja que estouram onde a pessoa toca, e rodelas de limão e gelo que cruzam a tela ao entrar em "Beber". Com "reduzir movimento" ligado no celular, tudo fica parado.


## O muro da fachada no cardápio

- **A turma do muro**: os personagens pintados na fachada (arte de @dupont.br) foram recortados à mão das fotos e recriados em estilo pôster (cores chapadas, traço reforçado, borda de adesivo). Ficam em `public/muro/` (versão grande e `-mini`).
- **Cada um manda numa categoria** (`src/data/crew.ts`): Breja (litrão), Skate (copão), Rainha (caipis), DJ Fita (Divas), Pista (doses), Gole (prontos), Na Moral (porções), Burgão (lanches, desenhado em vetor) e Saúde (tábuas). Entram como num jogo de rua dos anos 2000, respiram e têm efeitos (espuma, som, gole, brilho). Tocar no personagem mostra a fala, as barrinhas de atributo e o pedido da casa.
- **Fundo de muro** (tema escuro): reboco, emendas das placas e as garrafinhas pintadas a spray flutuando em parallax (uma máscara só, `public/muro/garrafa.webp`, colorida pelo CSS).
- **Abertura**: a garrafa com olho do muro, redesenhada em vetor (`src/components/intro/garrafa-olho.svg`, gerada por script), com a tampinha 3D no gargalo. O olho pisca, passeia, segue o dedo, olha para a etiqueta quando você puxa e arregala quando a tampa estoura (com as bolhas do muro). A tela de carregamento desenha a mesma garrafa (plugin no `vite.config.ts`), então não pisca.
- **Rodapé**: a turma lado a lado (toque leva à categoria) e o crédito do artista.

## Sinuca valendo drink

Veio da sinuca do Outs Pub (mesma física, mira e regras), com a cara do Mamadi: pano verde-petróleo com o logo da casa, madeira preta, taco laranja e luzes laranja e rosa.

- 1 × 1 ou 2 × 2 no mesmo celular; cada lado escolhe um personagem do muro (tela de VS ao começar).
- Encaçapou, joga de novo; bola 8 vale 2; branca na caçapa é falta e as bolas da tacada vão para o outro lado.
- A cada 2 bolas de um lado, a roleta sorteia uma bebida do cardápio (litrão, copão, caipis, Divas, doses e prontos; as rodadas de 3 ficam de fora) e o outro lado paga. Teto: até R$ 20, até R$ 30 ou qualquer uma.
- "A conta" guarda os sorteios; dá para fechar o jogo, pedir e voltar com a partida guardada.
- Onde abre: cartaz "Sinuca valendo drink" na página inicial, link "Sinuca" no topo (computador), busca ("sinuca", "jogo"...) e o endereço `#/sinuca`.
- Regras em `src/components/sinuca/match.ts`; mesa e física em `src/pool3d/`.

## Onde mexer

| O quê | Arquivo |
|---|---|
| Itens, preços, descrições, sabores e tags | `src/data/menu.ts` (preços em centavos: R$ 29,90 = `R(29.9)`) |
| Cartazes do carrossel (promoções/novidades) | `src/data/cartaz.ts` |
| Sugestões "Combina com" | `src/data/pairings.ts` |
| Endereço, Instagram, iFood, horário | `src/data/casa.ts` |
| Horário da cozinha | `KITCHEN` em `src/data/menu.ts` |
| Cores e fontes | `src/styles/global.css` (`:root`) |

### Fotos dos itens

Por enquanto todos os itens usam as ilustrações. Para colocar foto num item: `photo: "/fotos/copao-vodka.webp"` em `src/data/menu.ts` e o arquivo em `public/fotos/`.

A foto aparece **inteira, sobre fundo preto** (sem corte) no card de promoção, na linha do cardápio, na ficha e nas sugestões. Para ficar bem enquadrada em todos esses lugares:

- quadrada (1:1), 1600 × 1600 px (mínimo 1200 × 1200);
- fundo preto infinito puro (#000000), sem textura nem degradê;
- produto centralizado ocupando cerca de 70% da altura (≈ 1120 px) e no máximo 80% da largura, com pelo menos 12% de folga em cima e embaixo (≈ 190 px) e 10% nas laterais: nada encostando nas bordas.

Tamanhos em que a foto aparece hoje: card de promoção 192×173 (iPhone SE) a 264×238 (computador); linha 58×58; sugestões 36×36 a 44×44; ficha no celular = largura da tela × 62 a 300 px de altura; ficha no computador 392×660.

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
