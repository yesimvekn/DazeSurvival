import "../../node_modules/@fortawesome/fontawesome-free/css/brands.css";
import "../../node_modules/@fortawesome/fontawesome-free/css/fontawesome.css";
import "../../node_modules/@fortawesome/fontawesome-free/css/solid.css";
import { Game } from "./scripts/game";
import "./scss/pages/client.scss";

// Replace the inherited menu identity without changing the existing game UI.
document.title = "Daze Survival — 2D Battle Royale";
document.querySelector('meta[name="title"]')?.setAttribute("content", document.title);
document.querySelector('meta[name="description"]')?.setAttribute("content", "Drop in, gear up, and survive in Daze Survival.");
document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
document.querySelector('meta[property="og:site_name"]')?.setAttribute("content", "Daze Survival");
const gameLogo = document.querySelector<HTMLImageElement>("#splash-logo img");
if (gameLogo) {
    gameLogo.src = "./img/logos/daze_survival.svg";
    gameLogo.alt = "Daze Survival";
}
// Hide upstream social/news panels until Daze's own community links and news exist.
document.querySelector("#splash-socials")?.setAttribute("hidden", "");
document.querySelector("#splash-news")?.setAttribute("hidden", "");

void Game.init();
