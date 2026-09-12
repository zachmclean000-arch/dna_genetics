import { transaction } from "./store.js";
import { hashPassword } from "./auth.js";
const email = process.env.ADMIN_EMAIL?.toLowerCase(),
  password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 12)
  throw Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters).");
await transaction((s) => {
  if (s.users.some((u) => u.email === email))
    throw Error("Account already exists.");
  s.users.push({
    id: crypto.randomUUID(),
    email,
    password: hashPassword(password),
    role: "admin",
  });
});
console.log("Administrator created.");
process.exit(0);
