const ROUND_STATE_KEY = "khal-nelab-round";

type StoredRound<T> = {
  game: string;
  roundKey: number;
  data: T;
};

export function readRoundState<T>(
  game: string,
  roundKey: number
): T | null {
  try {
    const raw = sessionStorage.getItem(ROUND_STATE_KEY);

    if (!raw) return null;

    const stored = JSON.parse(raw) as StoredRound<T>;

    return stored.game === game && stored.roundKey === roundKey
      ? stored.data
      : null;
  } catch {
    return null;
  }
}

export function writeRoundState<T>(
  game: string,
  roundKey: number,
  data: T
) {
  try {
    sessionStorage.setItem(
      ROUND_STATE_KEY,
      JSON.stringify({ game, roundKey, data })
    );
  } catch {}
}

export function clearRoundState() {
  try {
    sessionStorage.removeItem(ROUND_STATE_KEY);
  } catch {}
}
