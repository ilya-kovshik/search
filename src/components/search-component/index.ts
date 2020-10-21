import {getDataListTemplate} from "./templates/datalist";
import {IUserModelItem} from "../../interfaces/IUserModelItem";

export class SearchComponent extends HTMLElement {
	public static component: HTMLElement;
	private shadow;
	private static templateConfig: {datalistId: string, datalistWrapperClassName: string} = {
		datalistId: "datalist",
		datalistWrapperClassName: "datalist-wrapper"
	};

	constructor() {
		super();
		this.shadow = this.attachShadow({mode: "open"});
	}

	private connectedCallback(): void {
		this.render();
 	}

	private render(): void {
		console.log();
		this.shadow.innerHTML = `
			${getDataListTemplate(SearchComponent.templateConfig)}
		`;
	}

	public static init(): void {
		window.customElements.define("search-component", SearchComponent);
	}

	public static getTemplateConfig(): {datalistId: string, datalistWrapperClassName: string} {
		return SearchComponent.templateConfig;
	}

	public static getElement(node: HTMLElement | ShadowRoot, selector: string): HTMLElement | null {
		return node.querySelector(selector) || null;
	}

	public static getDatalistOptions(data: IUserModelItem[]): HTMLElement[] {
		const nodesArr: HTMLElement[] = [];

		data.forEach((el: IUserModelItem) => {
			const option: HTMLElement = document.createElement("option");
			option.setAttribute("value", el.name);

			nodesArr.push(option);
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
}

