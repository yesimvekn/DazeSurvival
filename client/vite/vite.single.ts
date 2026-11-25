import { mergeConfig, type UserConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import common from "./vite.common";
import { singleFileExport } from "./plugins/single-file-export";

const config: UserConfig = {
    build: {
        outDir: "dist-single",
        emptyOutDir: true,
        sourcemap: false,
        cssCodeSplit: false,
        rollupOptions: {
            input: "index.html",
            output: {
                inlineDynamicImports: true,
                manualChunks: undefined
            }
        }
    },
    define: {
        API_URL: JSON.stringify("/api"),
        DEBUG_CLIENT: false
    },
    plugins: [ViteMinifyPlugin(), singleFileExport()]
};

export default mergeConfig(common, config);
