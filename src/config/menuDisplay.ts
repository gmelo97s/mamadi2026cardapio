/**
 * Modo de exibição do cardápio.
 *
 * Todas as fotos dos itens estavam na conta Cloudinary `du8l3x4rh`, que está
 * desativada — qualquer imagem de lá responde 401 ("cloud_name is disabled").
 * Sem banco de fotos próprio, o cardápio roda em modo texto: nome, descrição e
 * preço, sem imagem e sem placeholder.
 *
 * Para voltar com as fotos: rehospedar as imagens (Cloudinary reativado ou
 * arquivos em `public/menu-items/`) e trocar SHOW_ITEM_PHOTOS para true — o
 * deck "Deslizar" volta junto.
 */
export const SHOW_ITEM_PHOTOS: boolean = false;

/** Deck "Deslizar" (card estilo Tinder) — depende de foto em tela cheia. */
export const SHOW_SWIPE_DECK: boolean = SHOW_ITEM_PHOTOS;
