export type GameType = "word" | "draw" | "categories";

const NICKNAME_KEY = "khal_nelab_nickname";

export function saveNickname(name: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NICKNAME_KEY, name);
}

export function getNickname() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(NICKNAME_KEY) ?? "";
}

export function makeRoomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}