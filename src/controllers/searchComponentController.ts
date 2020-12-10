import { IUsersModel } from "../interfaces/IUsersModel";
import { UsersModel } from "../models/usersModel";

import "./searchComponentController.less";

class SearchComponentController {
  private usersModel: IUsersModel;
  private wrapper: any;
  private inputWrapper: any;
  private datalist: any;
  private input: any;
  private dropdown: any;
  private clearSelectionButton: any;
  private hideDropdownButton: any;
  private showDropdownButton: any;

  constructor() {
    this.usersModel = new UsersModel();
    this.wrapper = document.createElement("div");
    this.inputWrapper = document.createElement("div");
    this.datalist = document.createElement("datalist-component");
    this.input = document.createElement("input-component");
    this.dropdown = document.createElement("dropdown-component");
    this.clearSelectionButton = document.createElement(
      "clear-selection-button-component"
    );
    this.hideDropdownButton = document.createElement(
      "hide-dropdown-button-component"
    );
    this.showDropdownButton = document.createElement(
      "show-dropdown-button-component"
    );

    this.init();

    this.setEventListeners();

    this.inputWrapper.append(
      this.input,
      this.showDropdownButton,
      this.hideDropdownButton,
      this.clearSelectionButton
    );

    this.wrapper.append(this.datalist, this.inputWrapper, this.dropdown);

    return this.wrapper;
  }

  private createSubComponents(): {
    inputWrapper: any;
    wrapper: any;
    dropdown: any;
    hideDropdownButton: any;
    clearSelectionButton: any;
    datalist: any;
    input: any;
    showDropdownButton: any;
  } {
    const wrapper: any = document.createElement("div");
    const inputWrapper: any = document.createElement("div");
    const datalist: any = document.createElement("datalist-component");
    const input: any = document.createElement("input-component");
    const dropdown: any = document.createElement("dropdown-component");
    const clearSelectionButton: any = document.createElement(
      "clear-selection-button-component"
    );
    const hideDropdownButton: any = document.createElement(
      "hide-dropdown-button-component"
    );
    const showDropdownButton: any = document.createElement(
      "show-dropdown-button-component"
    );

    return {
      inputWrapper,
      wrapper,
      dropdown,
      hideDropdownButton,
      clearSelectionButton,
      datalist,
      input,
      showDropdownButton
    };
  }

  private async init() {
    this.dropdown.parseData(await this.usersModel.getUsers());

    this.inputWrapper.style.display = "flex";
    this.wrapper.classList.add("input-wrapper");

    this.hideDropdownButton.hide();
    this.dropdown.hide();
    this.clearSelectionButton.hide();
  }

  private async setEventListeners() {
    this.setHideDropdownButtonEvents();
    this.setShowDropdownButtonEvents();
    this.setClearSelectionButtonEvents();
    this.setInputEvents();
    this.setDropdownEvents();
    this.setDatalistEvents();
    this.setWindowEvents();
  }

  private setHideDropdownButtonEvents() {
    this.hideDropdownButton.addEventListener("onButtonClick", () => {
      this.showDropdownButton.show();
      this.hideDropdownButton.hide();
      this.dropdown.hide();
    });
  }
  private setShowDropdownButtonEvents() {
    this.showDropdownButton.addEventListener("onButtonClick", () => {
      this.showDropdownButton.hide();
      this.hideDropdownButton.show();
      this.dropdown.show();
    });
  }
  private setClearSelectionButtonEvents() {
    this.showDropdownButton.addEventListener("onButtonClick", () => {
      this.usersModel.unselectAllItems();

      this.clearSelectionButton.hide();
      this.datalist.clearAll();
      this.dropdown.unselectAllItems();
    });
  }

  private setInputEvents() {
    this.input.addEventListener("input", async () => {
      const users = await this.usersModel.getUsers();
      const value: string = this.input.getValue();

      this.dropdown.show();
      this.showDropdownButton.hide();
      this.hideDropdownButton.show();

      this.dropdown.parseData(
        users.filter((el) => el.name.toLowerCase().includes(value))
      );
    });
  }

  private setDropdownEvents() {
    this.dropdown.addEventListener("onItemSelect", async (e: any) => {
      const user = await this.usersModel.getItem(e.detail.id);

      if (!user) {
        return;
      }

      if (!this.usersModel.isAnySelection()) {
        this.datalist.removeDefaultOption();
        this.clearSelectionButton.show();
      }

      if (this.usersModel.isItemSelected(user.id)) {
        this.usersModel.unselectItem(user.id);
        this.datalist.removeListItem(user.id);
      } else {
        this.usersModel.selectItem(user.id);
        this.datalist.addListItem(user.name, user.id);
      }

      if (!this.usersModel.isAnySelection()) {
        this.datalist.addDefaultOption();
        this.clearSelectionButton.hide();
      }
    });
  }

  private setDatalistEvents() {
    this.datalist.addEventListener("onItemDelete", (e: any) => {
      this.datalist.removeListItem(e.detail.id);
      this.usersModel.unselectItem(e.detail.id);
      this.dropdown.unselectItem(e.detail.id);

      if (!this.usersModel.isAnySelection()) {
        this.datalist.addDefaultOption();
        this.clearSelectionButton.hide();
      }
    });
  }

  private setWindowEvents() {
    window.addEventListener("click", (e: Event) => {
      const target = e.target;

      if (
        this.dropdown.isVisible() &&
        target !== this.input &&
        target !== this.showDropdownButton &&
        target !== this.dropdown &&
        target !== this.datalist &&
        target !== this.clearSelectionButton
      ) {
        this.dropdown.hide();
        this.showDropdownButton.show();
        this.hideDropdownButton.hide();
      }
    });

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "escape") {
        this.dropdown.hide();
        this.showDropdownButton.show();
        this.hideDropdownButton.hide();
      }
    });
  }
}
export { SearchComponentController };
