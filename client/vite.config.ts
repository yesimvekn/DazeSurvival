import { existsSync, rmSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import pkg from "../package.json";

const DIRNAME = dirname(fileURLToPath(import.meta.url));
export default defineConfig(async({ command, mode }) => {
    const isDev = command === "serve" && mode === "development";
    const isSingleFile = mode === "single";

    process.env = {
        ...process.env,
        VITE_APP_VERSION: pkg.version,
        DEBUG_CLIENT: isDev.toString()
    };

    if (isDev && existsSync(resolve(DIRNAME, "./dist"))) {
        rmSync(resolve(DIRNAME, "./dist"), { recursive: true, force: true });
    }

    if (isSingleFile) return (await import("./vite/vite.single")).default;
    return (isDev ? await import("./vite/vite.dev") : await import("./vite/vite.prod")).default;
});
