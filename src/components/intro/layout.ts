/**
 * Tamanho e posição da tampinha na abertura (iguais no 3D, na imagem estática e na garrafa do olho).
 * Os mesmos números estão no CSS: --cap-d e --cap-y (intro.css e a tela de carregamento do index.html).
 */
export function capLayout(w: number, h: number) {
  const short = h < 740;
  const centerY = 0.27;
  const size = short ? Math.min(w * 0.42, h * 0.2, 230) : Math.min(w * 0.44, h * 0.195, 240);
  return { centerY, size };
}
