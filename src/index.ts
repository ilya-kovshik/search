import { SearchComponentController } from "./controllers/searchComponentController";
import { UsersModel } from "./models/usersModel";

import "./web-components";

async function init(): Promise<void> {
  const root: HTMLElement | null = document.getElementById("root");

  const searchComponent: any = new SearchComponentController(
    new UsersModel(),
    "name"
  );
  const searchComponent1: any = new SearchComponentController(
    new UsersModel(),
    "company.name"
  );

  if (root) {
    root.append(searchComponent, searchComponent1);
  }
}

init();
