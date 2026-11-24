import crypto from "crypto";

const KEY_PREFIX = "lsmm_";

/**
 * Generates a cryptographically secure API key along with its SHA-256 hash
 * and displayable prefix. Only the hash and prefix are stored in the database.
 */
export function generateApiKey(): {
  plaintext: string;
  hash: string;
  prefix: string;
} {
  const random = crypto.randomBytes(24).toString("hex"); // 48 hex chars
  const plaintext = `${KEY_PREFIX}${random}`;
  const hash = hashApiKey(plaintext);
  const prefix = plaintext.slice(0, 12); // e.g. "lsmm_a1b2c3d"
  return { plaintext, hash, prefix };
}

/**
 * Computes the SHA-256 hex digest of an API key for database lookup.
 */
export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key.trim()).digest("hex");
}
