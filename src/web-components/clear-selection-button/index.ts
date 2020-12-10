(function () {
  const template: HTMLTemplateElement = document.createElement("template");

  template.innerHTML = `
        <style>
          @import url("https://pro.fontawesome.com/releases/v5.10.0/css/all.css");
          .clear-selection-button {
            padding: 10px;
            border: 2px solid #007DAF;
            cursor: pointer;
            background: #CCE4F7;
            color: #3995D1;
            font-weight: 700;
            border-radius: 5px;
        }
        .clear-selection-button.hidden {
            display: none;
        }
        </style>
        <button class="clear-selection-button">Clear selection</button>
      `;

  class ClearSelectionButtonComponent extends HTMLElement {
    static get observedAttributes(): string[] {
      return ["value"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot?.appendChild(template.content.cloneNode(true));

      this.setEventListeners();
    }

    private getButton() {
      return this.shadowRoot?.querySelector(".clear-selection-button");
    }

    private setEventListeners(): void {
      this.getButton()?.addEventListener("click", () => {
        this.dispatchEvent(new Event("onButtonClick"));
      });
    }

    public hide() {
      this.getButton()?.classList.add("hidden");
    }

    public show() {
      this.getButton()?.classList.remove("hidden");
    }
  }

  window.customElements.define(
    "clear-selection-button-component",
    ClearSelectionButtonComponent
  );
})();
