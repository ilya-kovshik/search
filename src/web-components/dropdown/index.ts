import { IUserModelItem } from "../../interfaces/IUserModelItem";

(function () {
  const template: HTMLTemplateElement = document.createElement("template");

  template.innerHTML = `
        <style>
          @import url("https://pro.fontawesome.com/releases/v5.10.0/css/all.css");
          .dropdown {
            position: absolute;
            margin: 5px 0 0 0;
            padding: 0;
            width: 100%;
            max-height: 200px;
            top: 100%;
            left: 0;
            list-style: none;
            border-radius: 2px;
            background: #fff;
            overflow: hidden;
            overflow-y: auto;
            z-index: 100;
        }
        
        .dropdown.hidden {
          display: none;
        }
        </style>
        <ul class="dropdown"></ul>
      `;

  class Dropdown extends HTMLElement {
    static get observedAttributes(): string[] {
      return ["value"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    public parseData(
      data: IUserModelItem[],
      selectedItemsIds: string[] = [],
      fieldName: string,
      getModelItemValue: any
    ) {
      const dropdown = this.getDropdown();
      const dropdownItemsArr: HTMLElement[] = data.reduce(
        (acc: HTMLElement[], el) => {
          const dropdownItem: HTMLElement = this.createDropdownItem(
            getModelItemValue(el, fieldName),
            el.id
          );

          if (selectedItemsIds.includes(el.id)) {
            (dropdownItem as any).toggleSelection();
          }

          acc.push(dropdownItem);

          return acc;
        },
        []
      );

      this.clear();
      dropdown?.append(...dropdownItemsArr);
    }

    public hide(): void {
      const dropdown = this.getDropdown();

      if (!dropdown) {
        return;
      }

      dropdown.classList.add("hidden");
    }

    public show(): void {
      const dropdown = this.getDropdown();

      if (!dropdown) {
        return;
      }

      dropdown.classList.remove("hidden");
    }

    private clear(): void {
      const dropdown = this.getDropdown();

      if (!dropdown) {
        return;
      }

      dropdown.innerHTML = "";
    }

    private getDropdown() {
      return this.shadowRoot?.querySelector(".dropdown");
    }

    private createDropdownItem(value: string, id: string): HTMLElement {
      const dropdownItem: HTMLElement = document.createElement(
        "dropdown-item-component"
      );
      dropdownItem.setAttribute("value", value);
      dropdownItem.setAttribute("data-id", id);

      dropdownItem.addEventListener("onDropdownItemClick", (e: any) => {
        this.dispatchEvent(
          new CustomEvent("onItemSelect", {
            detail: {
              id: e.detail.id
            }
          })
        );
      });

      return dropdownItem;
    }

    public unselectAllItems() {
      this.getDropdown()
        ?.querySelectorAll(".selected")
        .forEach((el) => {
          (el as any).toggleSelection();
        });
    }

    public unselectItem(id: string | number) {
      (this.getDropdown()?.querySelector(
        `.selected[data-id="${id}"]`
      ) as any)?.toggleSelection();
    }

    public isVisible() {
      return !this.getDropdown()?.classList.contains("hidden");
    }
  }

  window.customElements.define("dropdown-component", Dropdown);
})();
