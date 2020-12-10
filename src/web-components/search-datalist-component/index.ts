import { SearchDatalistController } from "../../controllers/searchDatalistController";
import { icons } from "../../icons";
import { ISearchComponentNames } from "../../interfaces/ISearchComponentNames";
import {
  getSelectedListStyles,
  getSelectedListTemplate
} from "./templates/selectedlist";

export class SearchDatalistComponent extends HTMLElement {
  private static isComponentInit = false;
  public shadow;
  public static shadow: any;
  private static templateConfig: ISearchComponentNames = {
    datalistId: "datalist",
    selectedListId: "selectedList",
    ctrlButtons: "controls-buttons"
  };
  public static getNode: () => HTMLElement;
  public static dispatchEvent: (event: Event) => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    SearchDatalistComponent.getNode = () => this;

    SearchDatalistComponent.dispatchEvent = (ev: Event) => {
      this.dispatchEvent(ev);
    };
  }

  private connectedCallback(): void {
    this.render();

    SearchDatalistComponent.shadow = this;
  }

  private render(): void {
    const template: HTMLTemplateElement = document.createElement("template");

    template.innerHTML = `
			<style>
				@import url("https://pro.fontawesome.com/releases/v5.10.0/css/all.css");
				${getSelectedListStyles(SearchDatalistComponent.templateConfig)}
			</style>
			${getSelectedListTemplate(SearchDatalistComponent.templateConfig)}
		`;

    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    this.addEventListeners();

    SearchDatalistController.addEventListeners(this);
  }

  private addEventListeners(): void {
    this.addEventListener("dataListClick", (e: any) => {
      const target: HTMLElement = e.detail.target;

      if (target.tagName.toLowerCase() === "li" && target.dataset.id) {
        const id: string = e.detail.id;
        const dataListItem: HTMLElement = e.detail.getSelectedItem(id);
        const selectedListItem: HTMLElement = this.getSelectedListItem(id);

        if (dataListItem.classList.contains("selected")) {
          selectedListItem.remove();
          e.detail.modelUnselectItemClb(id);

          if (!e.detail.modelIsAnySelectionClb()) {
            this.getSelectedList()
              .querySelector("li[data-id='all']")
              ?.classList.remove("hidden");
          }
          return;
        }

        e.detail.modelSelectItemClb(id);
        this.addSelectedListItem({ id, value: dataListItem.textContent || "" });
        this.getSelectedList()
          .querySelector("li[data-id='all']")
          ?.classList.add("hidden");
      }
    });

    this.addEventListener("clearSelectionButtonClick", () => {
      this.clearSelectList();

      this.getSelectedList()
        .querySelector("li[data-id='all']")
        ?.classList.remove("hidden");
    });

    this.addEventListener("selectedListClick", (e: any) => {
      const target: HTMLElement = e.detail.target as HTMLElement;
      const parent: HTMLElement | null = target.parentElement;
      const closeIconName: string | undefined = icons.close.split(" ").pop();

      if (closeIconName && parent && target.classList.contains(closeIconName)) {
        const id: string | undefined = parent.dataset.id;

        if (id) {
          this.getSelectedListItem(id).remove();

          e.detail.modelUnselectItem(id);

          if (!e.detail.isAnySelection()) {
            this.getSelectedList()
              .querySelector("li[data-id='all']")
              ?.classList.remove("hidden");
          }
        }
      }
    });
  }

  public static init(tagName: string): void {
    if (!SearchDatalistComponent.isComponentInit) {
      window.customElements.define(tagName, SearchDatalistComponent);

      SearchDatalistComponent.isComponentInit = true;
    }
  }

  public static getTemplateConfig(): ISearchComponentNames {
    return SearchDatalistComponent.templateConfig;
  }

  private getSelectedList(): HTMLElement {
    return this.shadow.querySelector(
      `#${SearchDatalistComponent.templateConfig.selectedListId}`
    ) as HTMLElement;
  }
  private getSelectedListItem(id: string): HTMLElement {
    return this.getSelectedList().querySelector(
      `li[data-id="${id}"]`
    ) as HTMLElement;
  }
  private getClearSelectionButton(): HTMLElement {
    return this.shadow.querySelector(
      `.${SearchDatalistComponent.templateConfig.ctrlButtons}__clear-selection`
    ) as HTMLElement;
  }
  private addSelectedListItem(config: { id: string; value: string }): void {
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
  private clearSelectList(): void {
    const selectedList: HTMLElement = this.getSelectedList();

    selectedList.querySelectorAll("li").forEach((el) => {
      if (el.dataset.id !== "all") {
        el.remove();
      }
    });
  }
}
