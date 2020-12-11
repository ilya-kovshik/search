(function () {
  const template: HTMLTemplateElement = document.createElement("template");

  template.innerHTML = `
          <style>
          li button {
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
            width: 90%;
          }
      
          li button:hover,
          li.selected button {
              background: #007DAF;
              color: #fff;
          }

          li button:focus {
            border: 0;
          }
          </style>
          <li><button></button></li>
        `;

  class DropdownItem extends HTMLElement {
    static get observedAttributes(): string[] {
      return ["value", "data-id"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    private setEventListeners() {
      const { onClickHandler } = this.getEventListenersHandlers();

      this.getDropdownItem()
        ?.querySelector("button")
        ?.addEventListener("click", onClickHandler);
    }
    private removeEventListeners() {
      const { onClickHandler } = this.getEventListenersHandlers();

      this.getDropdownItem()
        ?.querySelector("button")
        ?.removeEventListener("click", onClickHandler);
    }

    private connectedCallback() {
      this.setEventListeners();
    }

    private disconnectedCallback() {
      this.removeEventListeners();
    }

    private getEventListenersHandlers() {
      const onClickHandler = () => {
        this.toggleSelection();

        this.dispatchEvent(
          new CustomEvent("onDropdownItemClick", {
            detail: {
              id: this.dataset.id
            }
          })
        );
      };

      return {
        onClickHandler
      };
    }

    private attributeChangedCallback(
      name: string,
      oval: string | null,
      newv: string
    ) {
      if (name === "value") {
        const button = this.shadowRoot?.querySelector("li button");

        if (!button) {
          return;
        }

        button.innerHTML = newv;
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

  window.customElements.define("dropdown-list-item", DropdownItem);
})();
