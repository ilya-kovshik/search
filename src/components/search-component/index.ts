import {getDataListTemplate} from "./templates/datalist";

export class SearchComponent extends HTMLElement {
	public static component: HTMLElement;
	private shadow;
	private templateConfig: {datalistId: string, datalistWrapperClassName: string} = {
		datalistId: "datalist",
		datalistWrapperClassName: "datalist-wrapper"
	};

	constructor() {
		super();
		console.log("super");
		this.shadow = this.attachShadow({mode: "open"});
	}

	private connectedCallback(): void {
		this.render();
 	}

	private render(): void {
		console.log();
		this.shadow.innerHTML = `
			${getDataListTemplate(this.templateConfig)}
		`;
	}

	public static init(): void {
		window.customElements.define("search-component", SearchComponent);
	}
}

