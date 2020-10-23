import {getDataListTemplate, getDataListStyles} from "./templates/datalist";
import {getSelectedListTemplate, getSelectedListStyles} from "./templates/selectedlist";
import {IUserModelItem} from "../../interfaces/IUserModelItem";
import {ISearchComponentNames} from "../../interfaces/ISearchComponentNames";
import {icons} from "../../icons";
export class SearchComponent extends HTMLElement {
	public static component: HTMLElement;
	private shadow;
	private static templateConfig: ISearchComponentNames = {
		datalistId: "datalist",
		selectedListId: "selectedList",
		ctrlButtons: "controls-buttons"
	};

	constructor() {
		super();
		this.shadow = this.attachShadow({mode: "open"});
	}

	private connectedCallback(): void {
		this.render();
 	}

	private render(): void {
		const template: HTMLTemplateElement = document.createElement("template");

		template.innerHTML = `
			<style>
				@import url("https://pro.fontawesome.com/releases/v5.10.0/css/all.css");
				${getDataListStyles(SearchComponent.templateConfig)}
				${getSelectedListStyles(SearchComponent.templateConfig)}
			</style>
			${getSelectedListTemplate(SearchComponent.templateConfig)}
			${getDataListTemplate(SearchComponent.templateConfig)}
		`;

		this.shadowRoot?.appendChild(template.content.cloneNode(true));
	}

	public static init(): void {
		window.customElements.define("search-component", SearchComponent);
	}

	public static getTemplateConfig(): ISearchComponentNames {
		return SearchComponent.templateConfig;
	}

	public static getElement(node: HTMLElement | ShadowRoot, selector: string): (HTMLElement | null) & (HTMLInputElement | null) {
		return node.querySelector(selector) || null;
	}

	public static getDatalistItems(
		data: IUserModelItem[],
		isItemSelectedClbck: (id: string) => boolean,
		filter = ""
	): HTMLElement[] {
		const nodesArr: HTMLElement[] = [];

		data
			.filter(el => el.name.toLowerCase().includes(filter))
			.forEach((el: IUserModelItem) => {
				const listItem: HTMLElement = document.createElement("li");
				listItem.appendChild(document.createTextNode(el.name));
				listItem.setAttribute("data-id", el.id);

				if(isItemSelectedClbck(el.id)) {
					listItem.classList.add("selected");
				}

				nodesArr.push(listItem);
			});

		return nodesArr;
	}

	public static appendElements(node: HTMLElement | null, elements: HTMLElement[], update?: boolean): void {
		if(!node) {
			return;
		}

		if(!update) {
			node.innerHTML = "";
		}

		node.append(...elements);
	}

	public static getSelectedOption(datalist: HTMLElement | null, input: HTMLInputElement | null): HTMLElement | null {
		if(!datalist || !input) {
			return null;
		}

		const optionsArr: HTMLElement[] = [...datalist.getElementsByTagName("option")];
		const selectedOption: HTMLElement | undefined =
			optionsArr.find(el => el.getAttribute("value") === input.value);

		return selectedOption || null;
	}

	public static unselectListItems(listNode: HTMLElement | null, selectionClassname: string): void {
		if(!listNode) {
			return;
		}

		const selectedListItems: HTMLElement[] = [...listNode.querySelectorAll(`.${selectionClassname}`)] as HTMLElement[];

		selectedListItems.forEach(el => {
			el.classList.remove(selectionClassname);
		});
	}

	public static addSelectedListItem(selectedList: HTMLElement | null, config: {value: string, id: string}): void {
		if(!selectedList) {
			return;
		}

		const li: HTMLElement = document.createElement("li");

		const textSpan: HTMLElement = document.createElement("span");
		const closeSpan: HTMLElement = document.createElement("span");

		textSpan.appendChild(document.createTextNode(config.value));

		closeSpan.classList.add(...icons.close.split(" "));

		li.appendChild(textSpan);
		li.appendChild(closeSpan);

		li.setAttribute("data-id", config.id);

		selectedList.appendChild(li);
	}

	public static removeSelectedListItem(selectedList: HTMLElement | null, id: string): void {
		if(!selectedList) {
			return;
		}

		selectedList.querySelector(`li[data-id="${id}"]`)?.remove();
	}
	public static removeAllSelectedListItem(selectedList: HTMLElement | null): void {
		if(!selectedList) {
			return;
		}

		selectedList.querySelectorAll("li").forEach(el => {
			if(el.dataset.id !== "all") {
				el.remove();
			}
		});
	}

	public static hideFirstAllSelectedListItem(selectedList: HTMLElement | null): void {
		if(!selectedList) {
			return;
		}

		selectedList.querySelector("li[data-id='all']")?.classList.add("hidden");
	}
	public static showFirstAllSelectedListItem(selectedList: HTMLElement | null): void {
		if(!selectedList) {
			return;
		}

		selectedList.querySelector("li[data-id='all']")?.classList.remove("hidden");
	}
}

