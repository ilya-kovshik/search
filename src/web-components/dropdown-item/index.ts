(function () {
  const template: HTMLTemplateElement = document.createElement("template");

  template.innerHTML = `
          <style>
            @import url("https://pro.fontawesome.com/releases/v5.10.0/css/all.css");
          li {
            display: block;
            text-align: left;
            padding: 0.8em 1em 0.8em 1em;
            color: #3288C1;
            cursor: pointer;
            background: #E6F3FD;
            margin: 10px 20px;
            border-radius: 7px;
            border: #C7E0EE 2px solid;
            font-weight: 700;
          }
      
          li:hover,
          li.selected {
              background: #007DAF;
              color: #fff;
          }
          </style>
          <li></li>
        `;

  class DropdownItem extends HTMLElement {
    static get observedAttributes(): string[] {
      return ["value", "data-id"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot?.appendChild(template.content.cloneNode(true));

      this.setEventListeners();
    }

    private setEventListeners() {
      this.getDropdownItem()?.addEventListener("click", () => {
        this.toggleSelection();

        this.dispatchEvent(
          new CustomEvent("onDropdownItemClick", {
            detail: {
              id: this.dataset.id
            }
          })
        );
      });
    }

    private attributeChangedCallback(
      name: string,
      oval: string | null,
      newv: string
    ) {
      if (name === "value") {
        const li = this.shadowRoot?.querySelector("li");

        if (!li) {
          return;
        }

        li.innerHTML = newv;
      }
    }

    private getDropdownItem() {
      return this.shadowRoot?.querySelector("li");
    }

    public toggleSelection() {
      this.getDropdownItem()?.classList.toggle("selected");

      this.classList.toggle("selected");
    }
  }

  window.customElements.define("dropdown-item-component", DropdownItem);
})();
