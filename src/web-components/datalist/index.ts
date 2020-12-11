import { IUserModelItem } from "../../interfaces/IUserModelItem";

(function () {
  const template: HTMLTemplateElement = document.createElement("template");

  template.innerHTML = `
    <style>
      .datalist {
          list-style: none;
          padding: 10px;
          border: 1px solid;
          border-radius: 5px;
      }
    </style>
    <ul class="datalist">
      <results-datalist-item value="All" data-id="all"></results-datalist-item>
    </ul>
  `;

  class Datalist extends HTMLElement {
    static get observedAttributes(): string[] {
      return [];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    public parseData(
      usersArr: IUserModelItem[],
      fieldName: string,
      getModelItemValue: any
    ) {
      const list = this.shadowRoot?.querySelector(".datalist");

      if (!list) {
        return;
      }

      const listItemsArr = usersArr.reduce((res: HTMLElement[], el) => {
        res.push(this.createListItem(getModelItemValue(el, fieldName), el.id));
        return res;
      }, []);

      list.append(...listItemsArr);
    }

    public removeDefaultOption() {
      const list = this.shadowRoot?.querySelector(".datalist");

      if (!list) {
        return;
      }

      list.querySelector(`[data-id="all"]`)?.remove();
    }

    public addDefaultOption() {
      this.addListItem("All", "all");
    }

    public addListItem(name: string, dataId: string) {
      const list = this.shadowRoot?.querySelector(".datalist");

      if (!list) {
        return;
      }

      const listItem: HTMLElement = this.createListItem(name, dataId);

      listItem.addEventListener("onButtonClick", (e: any) => {
        this.dispatchEvent(
          new CustomEvent("onItemDelete", {
            detail: {
              id: e.detail.id
            }
          })
        );
      });

      list.appendChild(listItem);
    }

    public removeListItem(dataId: string | number) {
      const list = this.shadowRoot?.querySelector(".datalist");

      if (!list) {
        return;
      }

      list.querySelector(`[data-id="${dataId}"]`)?.remove();
    }

    private createListItem(name: string, dataId: string): HTMLElement {
      const item = document.createElement("results-datalist-item");

      item.setAttribute("value", name);
      item.setAttribute("data-id", dataId);

      return item;
    }

    public clearAll() {
      const list = this.shadowRoot?.querySelector(".datalist");

      if (!list) {
        return;
      }

      list.innerHTML = "";

      this.addDefaultOption();
    }
  }

  window.customElements.define("results-datalist", Datalist);
})();
