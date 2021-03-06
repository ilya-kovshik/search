(function () {
  const template: HTMLTemplateElement = document.createElement("template");

  template.innerHTML = `
      <style>
        .search-input {
            padding-left: 1em;
            width: 100%;
            height: 54px;
            border-radius: 5px;
            box-sizing: border-box;
            box-shadow: none;
            border: 1px solid #ccc;
            outline: 0;
        }
    
        .search-input:focus {
            border: 1px solid #3288C1;
            outline: 0;
        }
      </style>
      <input class="search-input" type="text">
    `;

  class InputComponent extends HTMLElement {
    static get observedAttributes(): string[] {
      return ["value"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot?.appendChild(template.content.cloneNode(true));
    }

    public getValue() {
      return this.getInput()?.value;
    }

    private getInput() {
      return this.shadowRoot?.querySelector("input");
    }
  }

  window.customElements.define("search-input", InputComponent);
})();
