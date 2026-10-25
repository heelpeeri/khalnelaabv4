const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const ID_BYTES = 8;
const SIGNATURE_BYTES = 8;
const PAYLOAD_BYTES = 1 + ID_BYTES + 2;
const CODE_BYTES = PAYLOAD_BYTES + SIGNATURE_BYTES;
const DAY_MS = 24 * 60 * 60 * 1000;
const EPOCH_MS = Date.UTC(2024, 0, 1);

export type LicenseType = "purchase" | "gift";

export type LicenseSecrets = {
  purchase?: string;
  gift?: string;
};

export type LicenseCheck =
  { valid: true; type: LicenseType; expiresAt: Date | null } | { valid: false };

const TYPE_BYTE: Record<LicenseType, number> = {
  purchase: 1,
  gift: 2,
};

const encoder = new TextEncoder();

function toBase32(bytes: Uint8Array) {
  let bits = 0;
  let value = 0;
  let output = "";

  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

function fromBase32(text: string) {
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (const char of text) {
    const index = ALPHABET.indexOf(char);

    if (index === -1) {
      return null;
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  if (bits >= 5 || (value & ((1 << bits) - 1)) !== 0) {
    return null;
  }

  return new Uint8Array(output);
}

export function normalizeCode(input: string) {
  return input
    .toUpperCase()
    .replace(/[\s-]/g, "")
    .replace(/^KN/, "")
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1")
    .replace(/U/g, "V");
}

function formatCode(raw: string) {
  return `KN-${raw.match(/.{1,4}/g)?.join("-") ?? raw}`;
}

async function sign(secret: string, data: Uint8Array) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, data as BufferSource);

  return new Uint8Array(signature).slice(0, SIGNATURE_BYTES);
}

function secretFor(type: LicenseType, secrets: LicenseSecrets) {
  return type === "purchase" ? secrets.purchase : secrets.gift;
}

function sameBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;

  let diff = 0;

  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }

  return diff === 0;
}

export async function derivePurchaseId(secret: string, paymentId: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`payment:${paymentId}`),
  );

  return new Uint8Array(digest).slice(0, ID_BYTES);
}

export function randomId() {
  return crypto.getRandomValues(new Uint8Array(ID_BYTES));
}

export async function createLicenseCode({
  type,
  id,
  secret,
  validDays,
  now = Date.now(),
}: {
  type: LicenseType;
  id: Uint8Array;
  secret: string;
  validDays?: number;
  now?: number;
}) {
  if (id.length !== ID_BYTES) {
    throw new Error("Invalid license id");
  }

  const expiryDay =
    validDays && validDays > 0
      ? Math.min(65535, Math.ceil((now - EPOCH_MS) / DAY_MS) + validDays)
      : 0;

  const payload = new Uint8Array(PAYLOAD_BYTES);
  payload[0] = TYPE_BYTE[type];
  payload.set(id, 1);
  payload[1 + ID_BYTES] = expiryDay >>> 8;
  payload[2 + ID_BYTES] = expiryDay & 255;

  const code = new Uint8Array(CODE_BYTES);
  code.set(payload, 0);
  code.set(await sign(secret, payload), PAYLOAD_BYTES);

  return formatCode(toBase32(code));
}

export async function verifyLicenseCode(
  input: string,
  secrets: LicenseSecrets,
  now = Date.now(),
): Promise<LicenseCheck> {
  const bytes = fromBase32(normalizeCode(input));

  if (!bytes || bytes.length !== CODE_BYTES) {
    return { valid: false };
  }

  const payload = bytes.slice(0, PAYLOAD_BYTES);
  const signature = bytes.slice(PAYLOAD_BYTES);

  const type = (Object.keys(TYPE_BYTE) as LicenseType[]).find(
    (key) => TYPE_BYTE[key] === payload[0],
  );

  if (!type) {
    return { valid: false };
  }

  const secret = secretFor(type, secrets);

  if (!secret) {
    return { valid: false };
  }

  if (!sameBytes(await sign(secret, payload), signature)) {
    return { valid: false };
  }

  const expiryDay = (payload[1 + ID_BYTES] << 8) | payload[2 + ID_BYTES];
  const expiresAt =
    expiryDay === 0 ? null : new Date(EPOCH_MS + expiryDay * DAY_MS);

  if (expiresAt && expiresAt.getTime() < now) {
    return { valid: false };
  }

  return { valid: true, type, expiresAt };
}

export function getLicenseSecrets(): LicenseSecrets {
  return {
    purchase: process.env.LICENSE_SECRET || undefined,
    gift: process.env.GIFT_SECRET || undefined,
  };
}
