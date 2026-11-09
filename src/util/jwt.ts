import { randomBytes } from "crypto";

export const random_jwt_secret = () => randomBytes(32).toHex();
