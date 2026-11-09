import { createHash } from "crypto";

export const password_to_hash = (password: string) =>
  createHash("sha256").update(password).digest("hex");
