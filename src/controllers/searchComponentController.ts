import { IUsersModel } from "../interfaces/IUsersModel";
import { UsersModel } from "../models/usersModel";

interface ISearchSubCompomponents {
  datalist: any;
  input: any;
  dropdown: any;
  clearSelectionButton: any;
  hideDropdownButton: any;
  showDropdownButton: any;
  usersModel: IUsersModel;
}

class SearchComponentController {
  constructor() {
    const wrapper: any = document.createElement("div");
    const inputWrapper: HTMLElement = document.createElement("div");
    inputWrapper.style.display = "flex";
    wrapper.classList.add("input-wrapper");

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

    const usersModel: IUsersModel = new UsersModel();

    this.init({
      dropdown,
      hideDropdownButton,
      clearSelectionButton,
      usersModel
    });

    this.setEventListeners({
      datalist,
      input,
      dropdown,
      clearSelectionButton,
      hideDropdownButton,
      showDropdownButton,
      usersModel
    });

    inputWrapper.append(
      input,
      showDropdownButton,
      hideDropdownButton,
      clearSelectionButton
    );

    wrapper.append(datalist, inputWrapper, dropdown);

    return wrapper;
  }

  private async init({
    dropdown,
    hideDropdownButton,
    clearSelectionButton,
    usersModel
  }: {
    dropdown: any;
    hideDropdownButton: any;
    clearSelectionButton: any;
    usersModel: IUsersModel;
  }) {
    dropdown.parseData(await usersModel.getUsers());

    hideDropdownButton.hide();
    dropdown.hide();
    clearSelectionButton.hide();
  }

  private async setEventListeners({
    datalist,
    input,
    dropdown,
    clearSelectionButton,
    hideDropdownButton,
    showDropdownButton,
    usersModel
  }: ISearchSubCompomponents) {
    hideDropdownButton.addEventListener("onButtonClick", () => {
      showDropdownButton.show();
      hideDropdownButton.hide();
      dropdown.hide();
    });

    showDropdownButton.addEventListener("onButtonClick", () => {
      showDropdownButton.hide();
      hideDropdownButton.show();
      dropdown.show();
    });

    clearSelectionButton.addEventListener("onButtonClick", () => {
      usersModel.unselectAllItems();

      clearSelectionButton.hide();
      datalist.clearAll();
      dropdown.unselectAllItems();
    });

    input.addEventListener("input", async () => {
      const users = await usersModel.getUsers();
      const value: string = input.getValue();

      dropdown.show();
      showDropdownButton.hide();
      hideDropdownButton.show();

      dropdown.parseData(
        users.filter((el) => el.name.toLowerCase().includes(value))
      );
    });

    dropdown.addEventListener("onItemSelect", async (e: any) => {
      const user = await usersModel.getItem(e.detail.id);

      if (!user) {
        return;
      }

      if (!usersModel.isAnySelection()) {
        datalist.removeDefaultOption();
        clearSelectionButton.show();
      }

      if (usersModel.isItemSelected(user.id)) {
        usersModel.unselectItem(user.id);
        datalist.removeListItem(user.id);
      } else {
        usersModel.selectItem(user.id);
        datalist.addListItem(user.name, user.id);
      }

      if (!usersModel.isAnySelection()) {
        datalist.addDefaultOption();
        clearSelectionButton.hide();
      }
    });

    datalist.addEventListener("onItemDelete", (e: any) => {
      datalist.removeListItem(e.detail.id);
      usersModel.unselectItem(e.detail.id);
      dropdown.unselectItem(e.detail.id);

      if (!usersModel.isAnySelection()) {
        datalist.addDefaultOption();
        clearSelectionButton.hide();
      }
    });

    window.addEventListener("click", (e: Event) => {
      const target = e.target;

      if (
        dropdown.isVisible() &&
        target !== input &&
        target !== showDropdownButton &&
        target !== dropdown &&
        target !== datalist &&
        target !== clearSelectionButton
      ) {
        dropdown.hide();
        showDropdownButton.show();
        hideDropdownButton.hide();
      }
    });

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "escape") {
        dropdown.hide();
        showDropdownButton.show();
        hideDropdownButton.hide();
      }
    });
  }
}
export { SearchComponentController };
