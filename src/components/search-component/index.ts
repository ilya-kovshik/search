import {getDataListTemplate, getDataListStyles} from "./templates/datalist";
import {getSelectedListTemplate, getSelectedListStyles} from "./templates/selectedlist";
import {IUserModelItem} from "../../interfaces/IUserModelItem";
import {ISearchComponentNames} from "../../interfaces/ISearchComponentNames";
import {icons} from "../../icons";
export class SearchComponent extends HTMLElement {
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

		this.addEventListeners();
	}

	public static init(): void {
		window.customElements.define("search-component", SearchComponent);
	}

	public static getTemplateConfig(): ISearchComponentNames {
		return SearchComponent.templateConfig;
	}

	private getDatalistItems(
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
	private addEventListeners(): void {
		this.addEventListener("removeSelectedListItem", (e: any) => {
			const id: string = e.detail.id;
			const selectedItem: HTMLElement = this.getSelectedList().querySelector(`li[data-id="${id}"]`) as HTMLElement;

			selectedItem.remove();
		});

		this.addEventListener("unselectDataListItem", (e: any) => {
			this.getDataListItem(e.detail.id)?.classList.remove("selected");
		});

		this.addEventListener("dataListItemClick", (e: any) => {
			const id: string = e.detail.id;
			const dataListItem: HTMLElement = this.getDataListItem(id);
			const selectedListItem: HTMLElement = this.getSelectedListItem(id);

			if(dataListItem.classList.contains("selected")) {
				dataListItem.classList.remove("selected");

				e.detail.modelUnselectItemClb(id);
				selectedListItem.remove();

				if(!e.detail.modelIsAnySelectionClb()) {
					this.getClearSelectionButton().classList.add("hidden");

					this.getSelectedList().querySelector("li[data-id='all']")?.classList.remove("hidden");
				}
				return;
			}

			dataListItem.classList.add("selected");
			e.detail.modelSelectItemClb(id);

			this.getClearSelectionButton().classList.remove("hidden");
			this.addSelectedListItem({id, value: dataListItem.textContent || ""});

			this.getSelectedList().querySelector("li[data-id='all']")?.classList.add("hidden");
		});

		this.addEventListener("searchInput", (e: any) => {
			const datalistInput: HTMLInputElement = this.getDataListInput();
			const dataList: HTMLElement = this.getDataList();
			const value: string = datalistInput.value;
			const data: IUserModelItem[] = e.detail.data;

            const listArr: HTMLElement[] =
				this.getDatalistItems(data, e.detail.isItemSelectedCalbck, value);


			this.clearDataList();
			dataList.append(...listArr);
			datalistInput.parentElement?.classList.add("active");

			this.getHideButton().classList.remove("hidden");
			this.getShowButton().classList.add("hidden");
		});

		this.addEventListener("showListButtonClick", (e: any) => {
			const datalistInput: HTMLInputElement = this.getDataListInput();
			const data: IUserModelItem[] = e.detail.data;
			const dataList: HTMLElement = this.getDataList();
            const listArr: HTMLElement[] =
				this.getDatalistItems(data, e.detail.isItemSelectedCalbck, datalistInput.value);

			this.clearDataList();
			dataList.append(...listArr);

			datalistInput.parentElement?.classList.add("active");

			this.toggleControllsButtonsVisibility();
		});

		this.addEventListener("hideButtonClick", () => {
			this.getDataListInput().parentElement?.classList.remove("active");

			this.toggleControllsButtonsVisibility();
		});

		this.addEventListener("clearSelectionButtonClick", () => {
			this.unselectDataListItems();
			this.clearSelectList();

			this.getSelectedList().querySelector("li[data-id='all']")?.classList.remove("hidden");
			this.getClearSelectionButton().classList.add("hidden");
		});
	}

	private getDataList(): HTMLElement {
		return this.shadow.querySelector(`#${SearchComponent.templateConfig.datalistId}__ul`) as HTMLElement;
	}
	private getDataListItem(id: string): HTMLElement {
		return this.getDataList().querySelector(`li[data-id="${id}"]`) as HTMLElement;
	}
	private getDataListInput(): HTMLInputElement {
		return this.shadow.querySelector(`#${SearchComponent.templateConfig.datalistId}__input`) as HTMLInputElement;
	}
	private getSelectedList(): HTMLElement {
		return this.shadow.querySelector(`#${SearchComponent.templateConfig.selectedListId}`) as HTMLElement;
	}
	private getSelectedListItem(id: string): HTMLElement {
		return this.getSelectedList().querySelector(`li[data-id="${id}"]`) as HTMLElement;
	}
	private getClearSelectionButton(): HTMLElement {
		return this.shadow.querySelector(`.${SearchComponent.templateConfig.ctrlButtons}__clear-selection`) as HTMLElement;
	}
	private addSelectedListItem(config: {id: string, value: string}): void {
		const selectedList: HTMLElement = this.getSelectedList();

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
	private clearDataList(): void {
		this.getDataList().innerHTML = "";
	}
	private getShowButton(): HTMLElement {
		return this.shadow.querySelector(`.${SearchComponent.templateConfig.ctrlButtons}__show`) as HTMLElement;
	}
	private getHideButton(): HTMLElement {
		return this.shadow.querySelector(`.${SearchComponent.templateConfig.ctrlButtons}__hide`) as HTMLElement;
	}
	private toggleControllsButtonsVisibility(): void {
		this.getShowButton()?.classList.toggle("hidden");
        this.getHideButton()?.classList.toggle("hidden");
	}
	private unselectDataListItems() {
		const listNode: HTMLElement = this.getDataList();

		if(!listNode) {
			return;
		}

		const selectedListItems: HTMLElement[] = [...listNode.querySelectorAll(`.selected`)] as HTMLElement[];

		selectedListItems.forEach(el => {
			el.classList.remove("selected");
		});
	}
	private clearSelectList() {
		const selectedList: HTMLElement = this.getSelectedList();

		selectedList.querySelectorAll("li").forEach(el => {
			if(el.dataset.id !== "all") {
				el.remove();
			}
		});
	}
}

