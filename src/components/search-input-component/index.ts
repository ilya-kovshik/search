import { ISearchComponentNames } from "../../interfaces/ISearchComponentNames";
import { IUserModelItem } from "../../interfaces/IUserModelItem";
import { getInputStyles, getInputTemplate } from "./templates/input";
import { SearchInputController } from "../../controllers/searchInputController";
import { icons } from "../../icons";

export class SearchInputComponent extends HTMLElement {
  private static isComponentInit = false;
  private shadow: ShadowRoot;
  private static shadow: ShadowRoot;
  private static templateConfig: ISearchComponentNames = {
    datalistId: "datalist",
    selectedListId: "selectedList",
    ctrlButtons: "controls-buttons"
  };
  public static getSelectedItem: (id: string) => HTMLElement;
  public static dispatchEvent: (event: Event) => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    SearchInputComponent.shadow = this.shadow;

    SearchInputComponent.getSelectedItem = (id: string) => {
      return this.getDataListItem(id);
    };

    SearchInputComponent.dispatchEvent = (event: Event) => {
      this.dispatchEvent(event);
    };
  }

  private connectedCallback(): void {
    this.render();
  }

  private render(): void {
    const template: HTMLTemplateElement = document.createElement("template");

    template.innerHTML = `
			<style>
				@import url("https://pro.fontawesome.com/releases/v5.10.0/css/all.css");
				${getInputStyles(SearchInputComponent.templateConfig)}
			</style>
			${getInputTemplate(SearchInputComponent.templateConfig)}
		`;

    this.shadowRoot?.appendChild(template.content.cloneNode(true));

    this.addEventListeners();

    SearchInputController.addEventListeners(this);
  }

  private addEventListeners(): void {
    this.addEventListener("showListButtonClick", async (e: any) => {
      const datalistInput: HTMLInputElement = this.getDataListInput();
      const data: IUserModelItem[] = e.detail.data;
      const dataList: HTMLElement = this.getDataList();
      const listArr: HTMLElement[] = this.getDatalistItems(
        data,
        e.detail.isItemSelectedCalbck,
        datalistInput.value
      );

      this.clearDataList();
      dataList.append(...listArr);

      datalistInput.parentElement?.classList.add("active");

      this.toggleControllsButtonsVisibility();
    });

    this.addEventListener("hideButtonClick", () => {
      this.getDataListInput().parentElement?.classList.remove("active");

      this.toggleControllsButtonsVisibility();
    });

    this.addEventListener("dataListClick", (e: any) => {
      const target = e.detail.target;

      if (target.tagName.toLowerCase() === "li" && target.dataset.id) {
        const id: string = e.detail.id;
        const dataListItem: HTMLElement = this.getDataListItem(id);

        if (dataListItem.classList.contains("selected")) {
          dataListItem.classList.remove("selected");

          e.detail.modelUnselectItemClb(id);

          if (!e.detail.modelIsAnySelectionClb()) {
            this.getClearSelectionButton().classList.add("hidden");
          }
          return;
        }
        dataListItem.classList.add("selected");

        this.getClearSelectionButton().classList.remove("hidden");
      }
    });

    this.addEventListener("clearSelectionButtonClick", () => {
      this.unselectDataListItems();

      this.getClearSelectionButton().classList.add("hidden");
    });

    this.addEventListener("windowClickEvent", () => {
      window.addEventListener("click", (e: Event) => {
        const target: HTMLElement = e.composedPath()[0] as HTMLElement;

        if (
          target !== this.getDataList() &&
          target !== this.getShowButton() &&
          target.parentNode !== this.getDataList() &&
          target !== this.getClearSelectionButton() &&
          target !== this.getDataListInput() &&
          target !== this.getSelectedList() &&
          target.parentNode !== this.getSelectedList() &&
          !target.classList.contains("fa-times")
        ) {
          this.shadow
            .getElementById(SearchInputComponent.templateConfig.datalistId)
            ?.classList.remove("active");
          this.getShowButton().classList.remove("hidden");
          this.getHideButton().classList.add("hidden");
        }
      });
    });

    this.addEventListener("windowKeyDownEvent", () => {
      window.addEventListener("keydown", (e) => {
        if (e.code.toLowerCase() === "escape") {
          this.shadow
            .getElementById(SearchInputComponent.templateConfig.datalistId)
            ?.classList.remove("active");
          this.getShowButton().classList.remove("hidden");
          this.getHideButton().classList.add("hidden");
        }
      });
    });

    this.addEventListener("searchInput", async (e: any) => {
      const datalistInput: HTMLInputElement = this.getDataListInput();
      const dataList: HTMLElement = this.getDataList();
      const value: string = datalistInput.value;
      const data: IUserModelItem[] = e.detail.data;

      const listArr: HTMLElement[] = this.getDatalistItems(
        data,
        e.detail.isItemSelectedCalbck,
        value
      );

      this.clearDataList();
      dataList.append(...listArr);
      datalistInput.parentElement?.classList.add("active");

      this.getHideButton().classList.remove("hidden");
      this.getShowButton().classList.add("hidden");
    });

    this.addEventListener("selectedListClick", (e: any) => {
      const target: HTMLElement = e.detail.target as HTMLElement;
      const parent: HTMLElement | null = target.parentElement;
      const closeIconName: string | undefined = icons.close.split(" ").pop();

      if (closeIconName && parent && target.classList.contains(closeIconName)) {
        const id: string | undefined = parent.dataset.id;

        if (id) {
          this.getDataListItem(id)?.classList.remove("selected");

          if (!e.detail.isAnySelection()) {
            this.getClearSelectionButton().classList.add("hidden");
          }
        }
      }
    });
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

  private getSelectedListItem(id: string): HTMLElement {
    return this.getSelectedList().querySelector(
      `li[data-id="${id}"]`
    ) as HTMLElement;
  }

  private getSelectedList(): HTMLElement {
    return this.shadow.querySelector(
      `#${SearchInputComponent.templateConfig.selectedListId}`
    ) as HTMLElement;
  }

  private getDataList(): HTMLElement {
    return this.shadow.querySelector(
      `#${SearchInputComponent.templateConfig.datalistId}__ul`
    ) as HTMLElement;
  }
  private getDataListItem(id: string): HTMLElement {
    return this.getDataList().querySelector(
      `li[data-id="${id}"]`
    ) as HTMLElement;
  }
  private getDataListInput(): HTMLInputElement {
    return this.shadow.querySelector(
      `#${SearchInputComponent.templateConfig.datalistId}__input`
    ) as HTMLInputElement;
  }
  private clearDataList(): void {
    this.getDataList().innerHTML = "";
  }
  private getShowButton(): HTMLElement {
    return this.shadow.querySelector(
      `.${SearchInputComponent.templateConfig.ctrlButtons}__show`
    ) as HTMLElement;
  }
  private getHideButton(): HTMLElement {
    return this.shadow.querySelector(
      `.${SearchInputComponent.templateConfig.ctrlButtons}__hide`
    ) as HTMLElement;
  }
  private toggleControllsButtonsVisibility(): void {
    this.getShowButton()?.classList.toggle("hidden");
    this.getHideButton()?.classList.toggle("hidden");
  }
  private getClearSelectionButton(): HTMLElement {
    return this.shadow.querySelector(
      `.${SearchInputComponent.templateConfig.ctrlButtons}__clear-selection`
    ) as HTMLElement;
  }

  private unselectDataListItems(): void {
    const listNode: HTMLElement = this.getDataList();

    if (!listNode) {
      return;
    }

    const selectedListItems: HTMLElement[] = [
      ...listNode.querySelectorAll(`.selected`)
    ] as HTMLElement[];

    selectedListItems.forEach((el) => {
      el.classList.remove("selected");
    });
  }

  public static init(tagName: string): void {
    if (!SearchInputComponent.isComponentInit) {
      window.customElements.define(tagName, SearchInputComponent);

      SearchInputComponent.isComponentInit = true;
    }
  }

  private getDatalistItems(
    data: IUserModelItem[],
    isItemSelectedClbck: (id: string) => boolean,
    filter = ""
  ): HTMLElement[] {
    const nodesArr: HTMLElement[] = [];

    data
      .filter((el) => el.name.toLowerCase().includes(filter))
      .forEach((el: IUserModelItem) => {
        const listItem: HTMLElement = document.createElement("li");
        listItem.appendChild(document.createTextNode(el.name));
        listItem.setAttribute("data-id", el.id);

        if (isItemSelectedClbck(el.id)) {
          listItem.classList.add("selected");
        }

        nodesArr.push(listItem);
      });

    return nodesArr;
  }

  public static getTemplateConfig(): ISearchComponentNames {
    return SearchInputComponent.templateConfig;
  }
}
