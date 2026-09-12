import { transaction } from "../backend/store.js";
import { hashPassword } from "../backend/auth.js";
import { writeFileSync } from "node:fs";
if (process.env.DNA_GENETICS_DB_PATH !== ":memory:")
  throw Error("Test bootstrap requires isolated memory database.");
await transaction((s) =>
  s.users.push({
    id: crypto.randomUUID(),
    email: "admin@example.test",
    password: hashPassword("classroom-admin-password"),
    role: "admin",
  }),
);
await import("../backend/server.js");
writeFileSync(
  new URL("../backend/data/test-server.pid", import.meta.url),
  String(process.pid),
);
