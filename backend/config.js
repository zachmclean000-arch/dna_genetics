import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// Resolve configuration relative to the server, regardless of terminal directory.
dotenv.config({
  path: fileURLToPath(new URL("./.env", import.meta.url)),
  quiet: true,
});
