# Daze Survival

A browser-based, 2D multiplayer battle royale. The project keeps the existing TypeScript/Bun game engine and is being rebranded and configured for self-hosting.

> **License and source notice:** This is a modified derivative of [HasangerGames/suroi](https://github.com/HasangerGames/suroi), distributed under the GNU GPL v3. The upstream license and required copyright/license notices are retained. The source and modifications are provided here in compliance with the GPL; this is not an endorsement or official release by the upstream project.

## Run locally

Requirements: [Bun](https://bun.sh/) and Git.

```sh
bun install
bun dev
```

Open <http://127.0.0.1:3000>. The local game server uses port `8000`; game-worker ports begin at `8001`.

To build the browser client and launch the production server:

```sh
bun install
bun build:client
bun start
```

The production server serves the built client and API on its main port, and runs game WebSocket workers on the following ports.

## One-file client export

To package the browser UI and its built assets into one HTML file, run:

```sh
bun build:client:single
```

The output is `client/dist-single/DazeSurvival.html`. It is a single portable HTML file with JavaScript, CSS, fonts, image atlases, and audio atlases embedded. Upload that HTML file to a static host to get a shareable web link. It still needs a running Daze Survival multiplayer server; the HTML file does not contain the game server.

When the HTML is served from the same public origin as the game server, it uses that server automatically. If the static host is separate, set a server base URL in the link, e.g. `https://your-static-host.example/DazeSurvival.html?server=https://your-game-host.example:8000`. Configure the server's allowed CORS origin for that static site, and make the consecutive game-worker WebSocket ports reachable. HTTPS pages require secure `wss://` worker sockets (normally set up through a TLS reverse proxy).

## Wispbyte deployment

This repository includes a Bun startup path suitable for a Wispbyte server/container that supports Bun. Upload or deploy the repository, then use:

- **Install/build command:** `bun install --frozen-lockfile && bun build:client`
- **Startup command:** `bun start`
- **Environment:** set `PORT` to the main allocated port; set `HOST=0.0.0.0` (the server also defaults to this bind address).
- **Ports:** allocate and expose the main port plus one consecutive port per configured game worker. With the provided `maxGames: 1`, allocate the main port and the next port. Worker game 0 listens on `PORT + 1`.
- **Client URL:** open the game at the main allocation. When hosting the single-file client separately, use the `?server=` URL parameter shown above.

The server reads `PORT` and `HOST` at startup. Do not commit credentials or development role passwords. The example configuration is intentionally free of privileged roles.

## Changes

The project is rebranded as Daze Survival, supports Wispbyte's assigned main port, serves its production client from the game server, and uses the existing multiplayer worker architecture. This does not create or provision a Wispbyte account/server; configure the allocation and deployment in the Wispbyte panel.
