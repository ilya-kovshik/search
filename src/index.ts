import { SearchComponentController } from "./controllers/searchComponentController";
import { UsersModel } from "./models/usersModel";


async function createNewComponent(name: string, id: string): Promise<string> {
	const controller: SearchComponentController = new SearchComponentController(name, new UsersModel());

	return await controller.initSearchComponent(id);
}

async function init(): Promise<void> {
	const root: HTMLElement | null = document.getElementById("root");

	const html: string = await createNewComponent("search-component", "SC1");

	if(root) {
		root.innerHTML = html;
	}
}

init();
