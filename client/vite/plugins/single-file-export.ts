import { readFile, readdir, rm, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import type { Plugin } from "vite";

const outputDirectory = resolve(import.meta.dir, "../../dist-single");
const mimeTypes: Record<string, string> = {
    ".avif": "image/avif",
    ".css": "text/css;charset=utf-8",
    ".gif": "image/gif",
    ".html": "text/html;charset=utf-8",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "text/javascript;charset=utf-8",
    ".json": "application/json;charset=utf-8",
    ".mp3": "audio/mpeg",
    ".otf": "font/otf",
    ".png": "image/png",
    ".svg": "image/svg+xml;charset=utf-8",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2"
};

async function listFiles(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(entries.map(entry => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? listFiles(path) : [path];
    }));
    return files.flat();
}

function asDataUri(file: string, content: Buffer): string {
    const mimeType = mimeTypes[extname(file).toLowerCase()] ?? "application/octet-stream";
    return `data:${mimeType};base64,${content.toString("base64")}`;
}

/** Converts the production game into a single portable HTML document. */
export function singleFileExport(): Plugin {
    return {
        name: "daze-single-file-export",
        apply: "build",
        async closeBundle() {
            const files = await listFiles(outputDirectory);
            const htmlFile = files.find(file => file.endsWith("index.html"));
            if (!htmlFile) throw new Error("Single-file export could not find the built index.html.");

            const javascriptFiles = files.filter(file => file.endsWith(".js") && !file.endsWith(".map"));
            if (javascriptFiles.length !== 1) {
                throw new Error(`Single-file export expected one bundled JavaScript file, found ${javascriptFiles.length}.`);
            }

            let html = await readFile(htmlFile, "utf8");
            let javascript = await readFile(javascriptFiles[0], "utf8");
            const cssFiles = files.filter(file => file.endsWith(".css"));
            let css = (await Promise.all(cssFiles.map(file => readFile(file, "utf8")))).join("\n");

            // Inline public files and generated spritesheets referenced from JS or CSS.
            for (const file of files) {
                if ([htmlFile, ...javascriptFiles, ...cssFiles].includes(file) || file.endsWith(".map")) continue;
                const content = await readFile(file);
                const dataUri = asDataUri(file, content);
                const assetPath = relative(outputDirectory, file).split("\\").join("/");
                for (const reference of [assetPath, `/${assetPath}`, `./${assetPath}`]) {
                    javascript = javascript.split(reference).join(dataUri);
                    css = css.split(reference).join(dataUri);
                    html = html.split(reference).join(dataUri);
                }
            }

            const scriptTags = [...html.matchAll(/<script\b[^>]*\bsrc=["'][^"']+["'][^>]*>\s*<\/script>/gi)];
            if (scriptTags.length !== 1) {
                throw new Error(`Single-file export expected one external entry script, found ${scriptTags.length}.`);
            }
            html = html.replace(scriptTags[0][0], `<script type="module">\n${javascript}\n</script>`);

            // The single-file build bundles CSS into one stylesheet; remove its link.
            html = html.replace(/<link\b(?=[^>]*\brel=["']stylesheet["'])[^>]*>/gi, "");
            if (css) html = html.replace("</head>", `<style>\n${css}\n</style>\n</head>`);

            // A standalone artifact should not point at external runtime files.
            html = html.replace(/<link\b[^>]*rel=["'](?:manifest|icon)["'][^>]*>/gi, "");
            const finalFile = join(outputDirectory, "DazeSurvival.html");
            await writeFile(finalFile, html);
            for (const file of files) {
                if (file !== finalFile) await rm(file, { force: true });
            }
            console.log(`Created single-file client: ${finalFile}`);
        }
    };
}
