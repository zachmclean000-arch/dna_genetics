import {
  scryptSync,
  randomBytes,
  timingSafeEqual,
  createHash,
} from "node:crypto";
export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function checkPassword(password, hash) {
  const [salt, key] = hash.split(":");
  return timingSafeEqual(
    Buffer.from(key, "hex"),
    scryptSync(password, salt, 64),
  );
}
export const tokenHash = (token) =>
  createHash("sha256").update(token).digest("hex");
export const publicUser = ({ id, email, role }) => ({ id, email, role });
