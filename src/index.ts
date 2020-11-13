import { UsersModel } from "./models/usersModel";
import {SearchInputController} from "./controllers/searchInputController";
import { SearchDatalistController } from "./controllers/searchDatalistController";
import { IUsersModel } from "./interfaces/IUsersModel";

async function createSearchComponent(): Promise<string> {
	const model: IUsersModel = new UsersModel();
	const searchDatalistController: SearchDatalistController = new SearchDatalistController("search-datalist", model);
	const searchInputController: SearchInputController = new SearchInputController("search-input", model);

	const datalist: HTMLElement = await searchDatalistController.initComponent(
		"search-datalist",
		searchInputController.getSelectedItem,
		searchInputController.dispatchEvent
	);
	const input: HTMLElement = await searchInputController.initComponent(
		"search-input",
		searchDatalistController.dispatchEvent
	);

	return `
		<div>
			${datalist.outerHTML}
			${input.outerHTML}
		</div>
	`;

}

async function init(): Promise<void> {
	const root: HTMLElement | null = document.getElementById("root");

	const html: string = await createSearchComponent();

	if(root) {
		root.innerHTML = html;
	}
}

init();
