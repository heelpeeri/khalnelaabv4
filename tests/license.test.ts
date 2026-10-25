import { describe, expect, it } from "vitest";
import {
  createLicenseCode,
  derivePurchaseId,
  normalizeCode,
  randomId,
  verifyLicenseCode,
} from "@/lib/license";

const secrets = { purchase: "purchase-secret", gift: "gift-secret" };
const DAY = 24 * 60 * 60 * 1000;

describe("license codes", () => {
  it("creates a readable code that verifies", async () => {
    const code = await createLicenseCode({
      type: "purchase",
      id: randomId(),
      secret: secrets.purchase,
    });

    expect(code).toMatch(/^KN-[0-9A-Z]{4}(-[0-9A-Z]{1,4})+$/);
    expect(await verifyLicenseCode(code, secrets)).toEqual({
      valid: true,
      type: "purchase",
      expiresAt: null,
    });
  });

  it("accepts lowercase, spaces and look-alike letters", async () => {
    const code = await createLicenseCode({
      type: "purchase",
      id: randomId(),
      secret: secrets.purchase,
    });
    const messy = ` ${code.toLowerCase().replace(/-/g, " ")} `;

    expect((await verifyLicenseCode(messy, secrets)).valid).toBe(true);
    expect(normalizeCode("kn-o1il-u")).toBe("0111V");
  });

  it("rejects tampered or random codes", async () => {
    for (let round = 0; round < 50; round += 1) {
      const code = await createLicenseCode({
        type: "purchase",
        id: randomId(),
        secret: secrets.purchase,
      });

      for (const char of "0123456789ABCDEFGHJKMNPQRSTVWXYZ") {
        if (char === code.at(-1)) continue;

        expect(
          (await verifyLicenseCode(code.slice(0, -1) + char, secrets)).valid,
        ).toBe(false);
      }
    }

    expect((await verifyLicenseCode("KN-1234-5678", secrets)).valid).toBe(
      false,
    );
    expect((await verifyLicenseCode("", secrets)).valid).toBe(false);
  });

  it("rejects codes signed with a different secret", async () => {
    const code = await createLicenseCode({
      type: "purchase",
      id: randomId(),
      secret: "old-secret",
    });

    expect((await verifyLicenseCode(code, secrets)).valid).toBe(false);
  });

  it("keeps gift codes separate so they can be revoked", async () => {
    const gift = await createLicenseCode({
      type: "gift",
      id: randomId(),
      secret: secrets.gift,
    });

    expect((await verifyLicenseCode(gift, secrets)).valid).toBe(true);
    expect(
      (await verifyLicenseCode(gift, { purchase: secrets.purchase })).valid,
    ).toBe(false);
    expect(
      (await verifyLicenseCode(gift, { ...secrets, gift: "rotated" })).valid,
    ).toBe(false);
  });

  it("expires codes made with a duration", async () => {
    const now = Date.UTC(2026, 9, 1);
    const code = await createLicenseCode({
      type: "gift",
      id: randomId(),
      secret: secrets.gift,
      validDays: 7,
      now,
    });

    const early = await verifyLicenseCode(code, secrets, now + 3 * DAY);
    expect(early.valid).toBe(true);
    expect((await verifyLicenseCode(code, secrets, now + 10 * DAY)).valid).toBe(
      false,
    );
  });

  it("gives the same code for the same payment", async () => {
    const make = async () =>
      createLicenseCode({
        type: "purchase",
        id: await derivePurchaseId(secrets.purchase, "pay_123456789"),
        secret: secrets.purchase,
      });

    expect(await make()).toBe(await make());
  });
});
