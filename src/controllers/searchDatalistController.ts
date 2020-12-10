import { SearchDatalistComponent } from "../web-components/search-datalist-component";
import { ISearchComponentNames } from "../interfaces/ISearchComponentNames";
import { IUsersModel } from "../interfaces/IUsersModel";

export class SearchDatalistController {
  private tagName: string;
  private usersModel: IUsersModel;
  public static addEventListeners: (rootNode: HTMLElement) => void;
  private getSelectedItem: any;
  private dispatchInputEvent: any;

  constructor(tagName: string, usersModel: IUsersModel) {
    this.tagName = tagName;
    this.usersModel = usersModel;

    SearchDatalistController.addEventListeners = (rootNode: HTMLElement) => {
      this.addEventListeners(rootNode);
    };
  }

  private addEventListeners(rootNode: HTMLElement): void {
    const templateConfig: ISearchComponentNames = SearchDatalistComponent.getTemplateConfig();
    const shadowRoot: ShadowRoot = rootNode.shadowRoot as ShadowRoot;

    this.addHideListButtonEvents(shadowRoot, templateConfig, rootNode);
    this.addDataListEvents(shadowRoot, templateConfig, rootNode);
    this.addSelectedListEvents(shadowRoot, templateConfig, rootNode);
  }

  private addHideListButtonEvents(
    shadowRoot: ShadowRoot,
    templateConfig: ISearchComponentNames,
    rootNode: HTMLElement
  ): void {
    const hideListButton: HTMLInputElement | null = shadowRoot.querySelector(
      `.${templateConfig.ctrlButtons}__hide`
    );

    hideListButton?.addEventListener("click", () => {
      rootNode.dispatchEvent(new Event("hideButtonClick"));
    });
  }

  private addDataListEvents(
    shadowRoot: ShadowRoot,
    templateConfig: ISearchComponentNames,
    rootNode: HTMLElement
  ): void {
    const dataList: HTMLElement | null = shadowRoot.querySelector(
      `#${templateConfig.datalistId}__ul`
    );

    dataList?.addEventListener("click", (e: Event) => {
      const event: CustomEvent = new CustomEvent("dataListClick", {
        detail: {
          id: (e.target as HTMLElement).dataset.id,
          target: e.target,
          modelUnselectItemClb: this.usersModel.unselectItem.bind(
            this.usersModel
          ),
          modelIsAnySelectionClb: this.usersModel.isAnySelection.bind(
            this.usersModel
          ),
          modelSelectItemClb: this.usersModel.selectItem.bind(this.usersModel)
        }
      });

      rootNode.dispatchEvent(event);
    });
  }

  private addSelectedListEvents(
    shadowRoot: ShadowRoot,
    templateConfig: ISearchComponentNames,
    rootNode: HTMLElement
  ): void {
    const selectedList: HTMLInputElement | null = shadowRoot.querySelector(
      `#${templateConfig.selectedListId}`
    );

    selectedList?.addEventListener("click", (e: Event) => {
      const event: Event = new CustomEvent("selectedListClick", {
        detail: {
          target: e.target,
          modelUnselectItem: (id: string) =>
            this.usersModel.unselectItem.call(this.usersModel, id),
          isAnySelection: this.usersModel.isAnySelection.bind(this.usersModel)
        }
      });

      rootNode.dispatchEvent(event);
      this.dispatchInputEvent(event);
    });
  }

  public getComponentNode(): HTMLElement {
    return SearchDatalistComponent.getNode();
  }

  public dispatchEvent(event: Event): void {
    SearchDatalistComponent.dispatchEvent(event);
  }

  public initComponent(
    componentID: string,
    getSelectedItem: (id: string) => HTMLElement,
    dispatchInputEvent: (event: Event) => void
  ): Promise<HTMLElement> {
    return new Promise((res) => {
      SearchDatalistComponent.init(componentID);

      const element: HTMLElement = document.createElement(this.tagName);

      element.setAttribute("id", componentID);
      this.getSelectedItem = getSelectedItem;
      this.dispatchInputEvent = dispatchInputEvent;

      res(element);
    });
  }
}
