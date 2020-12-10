import { SearchComponentController } from "./controllers/searchComponentController";

import "./web-components";

async function init(): Promise<void> {
  const root: HTMLElement | null = document.getElementById("root");

  const searchComponent: any = new SearchComponentController();
  const searchComponent1: any = new SearchComponentController();

  if (root) {
    root.append(searchComponent, searchComponent1);
  }
}

init();
