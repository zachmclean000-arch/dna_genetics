import { transaction } from "./store.js";
import { hashPassword } from "./auth.js";
const email = process.env.ADMIN_EMAIL?.toLowerCase(),
  password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 8)
  throw Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 8 characters).");
await transaction((s) => {
  const existing =
    s.users.find((user) => user.email === email) ||
    s.users.find((user) => user.role === "admin");
  if (existing) {
    existing.email = email;
    existing.password = hashPassword(password);
    existing.role = "admin";
  } else {
    s.users.push({
      id: crypto.randomUUID(),
      email,
      password: hashPassword(password),
      role: "admin",
    });
  }
});
console.log("Administrator account is ready.");
process.exit(0);
