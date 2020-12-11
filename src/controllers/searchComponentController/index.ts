import { IUsersModel } from "../../interfaces/IUsersModel";

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
  private fieldName: string;

  constructor(model: IUsersModel, fieldName: string) {
    this.usersModel = model;
    this.fieldName = fieldName;
    this.wrapper = document.createElement("div");
    this.inputWrapper = document.createElement("div");
    this.datalist = document.createElement("results-datalist");
    this.input = document.createElement("search-input");
    this.dropdown = document.createElement("dropdown-list");
    this.clearSelectionButton = document.createElement(
      "clear-selection-button"
    );
    this.hideDropdownButton = document.createElement("hide-dropdown-button");
    this.showDropdownButton = document.createElement("show-dropdown-button");

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

  private async init() {
    this.hideDropdownButton.hide();
    this.dropdown.hide();
    this.clearSelectionButton.hide();

    this.inputWrapper.classList.add("input-wrapper");
    this.wrapper.classList.add("wrapper");

    this.dropdown.parseData(
      await this.usersModel.getUsers(),
      [],
      this.fieldName,
      this.getModelItemValue
    );
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
    this.clearSelectionButton.addEventListener("onButtonClick", () => {
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
        users.filter(
          (el) =>
            this.getModelItemValue(el, this.fieldName)
              .toLowerCase()
              .includes(value),
          []
        ),
        this.usersModel.getSelectedItems(),
        this.fieldName,
        this.getModelItemValue
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
        this.datalist.addListItem(
          this.getModelItemValue(user, this.fieldName),
          user.id
        );
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

  private getModelItemValue(obj: any, fieldName: string) {
    const fieldArr: string[] = fieldName.split(".");
    let tempObj = obj;
    let val;

    while (fieldArr.length !== 0) {
      const prop: any = fieldArr.shift();

      val = tempObj[prop];
      tempObj = val;
    }
    return val;
  }
}
export { SearchComponentController };
