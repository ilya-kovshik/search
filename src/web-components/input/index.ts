(function () {
  const template: HTMLTemplateElement = document.createElement("template");

  template.innerHTML = `
      <style>
        @import url("https://pro.fontawesome.com/releases/v5.10.0/css/all.css");
        .input-component {
            padding-left: 1em;
            width: 100%;
            height: 54px;
            border-radius: 5px;
            box-sizing: border-box;
            box-shadow: none;
            border: 1px solid #ccc;
            outline: 0;
        }
    
        .input-component:focus {
            border: 1px solid #3288C1;
            outline: 0;
        }
      </style>
      <input class="input-component" type="text">
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

        let html = `
            <span>${newv}</span>
          `;

        if (newv !== "All") {
          html += '<span class="fas fa-times"></span>';
        }

        li.innerHTML = html;
      }
    }

    private getInput() {
      return this.shadowRoot?.querySelector("input");
    }
  }

  window.customElements.define("input-component", InputComponent);
})();
