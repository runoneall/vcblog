import { createHash, timingSafeEqual } from "crypto";

export const password_to_hash = (password: string) =>
  createHash("sha256").update(password).digest("hex");

export const hash_eq_hash = (hash1: string, hash2: string) =>
  timingSafeEqual(Buffer.from(hash1), Buffer.from(hash2));

export const password_eq_hash = (password: string, hash: string) =>
  hash_eq_hash(password_to_hash(password), hash);
