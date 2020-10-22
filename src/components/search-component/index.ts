import {getDataListTemplate, getDataListStyles} from "./templates/datalist";
import {IUserModelItem} from "../../interfaces/IUserModelItem";
export class SearchComponent extends HTMLElement {
	public static component: HTMLElement;
	private shadow;
	private static templateConfig: {datalistId: string, ctrlButtons: string} = {
		datalistId: "datalist",
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
				${getDataListStyles(SearchComponent.templateConfig)}
			</style>
			${getDataListTemplate(SearchComponent.templateConfig)}
		`;

		this.shadowRoot?.appendChild(template.content.cloneNode(true));
	}

	public static init(): void {
		window.customElements.define("search-component", SearchComponent);
	}

	public static getTemplateConfig(): {datalistId: string, ctrlButtons: string} {
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
}

