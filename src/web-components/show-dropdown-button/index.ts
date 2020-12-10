(function () {
  const template: HTMLTemplateElement = document.createElement("template");

  template.innerHTML = `
    <style>
      @import url("https://pro.fontawesome.com/releases/v5.10.0/css/all.css");
      .show-dropdown-button {
          background: none;
          border: 0;
          padding: 4px;
          position: relative;
          border-radius: 50%;
          cursor: pointer;
      }
      .show-dropdown-button.hidden {
          display: none;
      }
      .show-dropdown-button:hover {
          background: #9E9E9E;
      }
    </style>
    <button class="show-dropdown-button">
      <span class="fas fa-angle-down"></span>
    </button>
  `;

  class ShowDropdownButtonComponent extends HTMLElement {
    static get observedAttributes(): string[] {
      return ["value"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot?.appendChild(template.content.cloneNode(true));

      this.setEventListeners();
    }

    public hide(): void {
      this.getButton()?.classList.add("hidden");
    }
    public show(): void {
      this.getButton()?.classList.remove("hidden");
    }

    private getButton() {
      return this.shadowRoot?.querySelector(".show-dropdown-button");
    }

    private setEventListeners(): void {
      this.getButton()?.addEventListener("click", () => {
        this.dispatchEvent(new Event("onButtonClick"));
      });
    }
  }

  window.customElements.define(
    "show-dropdown-button-component",
    ShowDropdownButtonComponent
  );
})();
