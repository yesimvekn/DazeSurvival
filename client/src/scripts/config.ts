import { type TeamMode } from "@common/constants";
import type { ModeName } from "@common/definitions/modes";

const pageProtocol = typeof window === "undefined" ? "http:" : window.location.protocol;
const pageHost = typeof window === "undefined" ? "127.0.0.1" : window.location.hostname;
const pagePort = typeof window === "undefined" ? "8000" : window.location.port;
const httpProtocol = pageProtocol === "https:" ? "https:" : "http:";
const wsProtocol = pageProtocol === "https:" ? "wss:" : "ws:";
const defaultPort = pagePort ? Number.parseInt(pagePort, 10) : pageProtocol === "https:" ? 443 : 80;

function getServerAddress(): { readonly mainAddress: string, readonly gameAddress: string, readonly offset: number } {
    const serverParameter = typeof window === "undefined"
        ? null
        : new URLSearchParams(window.location.search).get("server");
    if (!serverParameter) {
        return {
            mainAddress: `${httpProtocol}//${pageHost}${pagePort ? `:${pagePort}` : ""}`,
            gameAddress: `${wsProtocol}//${pageHost}:<gameID>`,
            offset: defaultPort + 1
        };
    }

    try {
        const server = new URL(serverParameter);
        if (server.protocol !== "http:" && server.protocol !== "https:") throw new Error("Use an http(s) server URL.");
        const secure = server.protocol === "https:";
        const mainPort = server.port ? Number.parseInt(server.port, 10) : secure ? 443 : 80;
        return {
            mainAddress: server.origin.replace(/\/$/, ""),
            gameAddress: `${secure ? "wss:" : "ws:"}//${server.hostname}:<gameID>`,
            offset: mainPort + 1
        };
    } catch (error) {
        console.error("Invalid Daze Survival server URL in ?server=", error);
        return {
            mainAddress: `${httpProtocol}//${pageHost}${pagePort ? `:${pagePort}` : ""}`,
            gameAddress: `${wsProtocol}//${pageHost}:<gameID>`,
            offset: defaultPort + 1
        };
    }
}

const serverAddress = getServerAddress();

export const Config = {
    regions: {
        daze: {
            name: "Daze Survival",
            ...serverAddress
        }
    },
    defaultRegion: "daze"
} satisfies ConfigType as ConfigType;

export interface ConfigType {
    readonly regions: Record<string, Region>
    readonly defaultRegion: string
}

export interface Region {
    readonly name: string
    readonly flag?: string
    readonly mainAddress: string
    readonly gameAddress: string
    readonly offset: number
}

export interface ServerInfo {
    readonly protocolVersion: number
    readonly playerCount: number
    readonly teamMode: TeamMode
    readonly teamModeSwitchTime: number
    readonly mode: ModeName
    readonly modeSwitchTime: number
}
