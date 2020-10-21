import { SearchComponentController } from "./controllers/searchComponentController";
import { UsersModel } from "./models/usersModel";

async function init(): Promise<void> {
	const root: HTMLElement | null = document.getElementById("root");
	const searchComponentController: SearchComponentController =
		new SearchComponentController("search-component", new UsersModel());

	const html: string = await searchComponentController.initSearchComponent();

	if(root) {
		root.innerHTML = html;
	}
}

init();
