(function () {
  const template: HTMLTemplateElement = document.createElement("template");

  template.innerHTML = `
    <style>
      @import url("https://pro.fontawesome.com/releases/v5.10.0/css/all.css");
      li {
          display: grid;
          justify-content: space-between;
          grid-auto-flow: column;
          border: 1px solid;
          padding: 5px 10px;
          border-radius: 5px;
          margin: 10px;
      }

      li.hidden {
          display: none;
      }

      .close-button {
        border: 0;
        background: none;
      }

      .close-button:hover:before {
        color: red;
      }
    </style>
    <li></li>
  `;

  class DatalistItem extends HTMLElement {
    private model: any;
    static get observedAttributes(): string[] {
      return ["value"];
    }

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot?.appendChild(template.content.cloneNode(true));
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

        const valueNode = document.createElement("span");
        valueNode.appendChild(document.createTextNode(newv));

        li.appendChild(valueNode);

        if (newv !== "All") {
          const closeButton: HTMLElement = document.createElement("button");
          closeButton.classList.add("close-button", "fas", "fa-times");

          closeButton.addEventListener("click", () => {
            this.dispatchEvent(
              new CustomEvent("onButtonClick", {
                detail: {
                  id: this.dataset.id
                }
              })
            );
          });

          li.appendChild(closeButton);
        }
      }
    }
  }

  window.customElements.define("datalist-item-component", DatalistItem);
})();
