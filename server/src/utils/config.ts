import { existsSync, readFileSync, writeFileSync } from "fs";
import type { ConfigSchema } from "./config.d";

let configExists = existsSync("config.json");
if (!configExists && existsSync("config.example.json")) {
    writeFileSync("config.json", readFileSync("config.example.json", "utf8"));
    configExists = true;
}

const fileConfig = await import("../../config.json") as ConfigSchema;
const port = Number.parseInt(process.env.PORT ?? "", 10);

// Wispbyte/Pterodactyl-style allocations are supplied through PORT. The bind
// address must be public-facing inside the container, not loopback-only.
export const Config: ConfigSchema = {
    ...fileConfig,
    hostname: process.env.HOST ?? process.env.SERVER_HOST ?? "0.0.0.0",
    port: Number.isFinite(port) ? port : fileConfig.port
};
