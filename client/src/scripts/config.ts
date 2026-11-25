import { type TeamMode } from "@common/constants";
import type { ModeName } from "@common/definitions/modes";

// The site and game server share the main Wispbyte allocation. Game workers
// use consecutive ports after it (PORT + game ID + 1).
const pageProtocol = typeof window === "undefined" ? "http:" : window.location.protocol;
const pageHost = typeof window === "undefined" ? "127.0.0.1" : window.location.hostname;
const pagePort = typeof window === "undefined" ? "8000" : window.location.port;
const httpProtocol = pageProtocol === "https:" ? "https:" : "http:";
const wsProtocol = pageProtocol === "https:" ? "wss:" : "ws:";
const authority = `${pageHost}${pagePort ? `:${pagePort}` : ""}`;
const workerAuthority = `${pageHost}:<gameID>`;

export const Config = {
    regions: {
        daze: {
            name: "Daze Survival",
            mainAddress: `${httpProtocol}//${authority}`,
            gameAddress: `${wsProtocol}//${workerAuthority}`,
            offset: 1
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
