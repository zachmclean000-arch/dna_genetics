import { readFileSync, unlinkSync } from "node:fs";
export default function teardown() {
  const file = new URL("../backend/data/test-server.pid", import.meta.url);
  try {
    const pid = Number(readFileSync(file, "utf8"));
    if (Number.isInteger(pid) && pid > 0) process.kill(pid);
    unlinkSync(file);
  } catch (error) {
    if (!["ENOENT", "ESRCH"].includes(error.code)) throw error;
  }
}
