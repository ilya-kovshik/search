import { UsersModel } from "../models/usersModel";
import { SearchInputComponent } from "../components/search-input-component";
import { ISearchComponentNames } from "../interfaces/ISearchComponentNames";
import { IUserModelItem } from "../interfaces/IUserModelItem";
import { IUsersModel } from "../interfaces/IUsersModel";

export class SearchInputController {
    private tagName: string;
    public usersModel: IUsersModel;
    public static addEventListeners: any;
    public dispatchDatalistEvent: any;
    public getSelectedItem: (id: string) => HTMLElement;

    constructor(tagName: string, usersModel: IUsersModel) {
        this.tagName = tagName;
        this.usersModel = usersModel;

        SearchInputController.addEventListeners = (rootNode: HTMLElement) => this.addEventListeners(rootNode);
        this.getSelectedItem = (id: string) => SearchInputComponent.getSelectedItem(id);
    }

    private addEventListeners(rootNode: HTMLElement): void {
        const templateConfig: ISearchComponentNames = SearchInputComponent.getTemplateConfig();
        const shadowRoot: ShadowRoot = rootNode.shadowRoot as ShadowRoot;

        this.addShowListButtonEvents(shadowRoot, templateConfig, rootNode);
        this.addHideListButtonEvents(shadowRoot, templateConfig, rootNode);
        this.addDataListEvents(shadowRoot, templateConfig, rootNode);
        this.addSearchInputEvents(shadowRoot, templateConfig, rootNode);
        this.addClearSelectionButtonEvents(shadowRoot, templateConfig, rootNode);
        this.addWindowEvents(rootNode);
    }

    private addShowListButtonEvents(
        shadowRoot: ShadowRoot,
        templateConfig: ISearchComponentNames,
        rootNode: HTMLElement
    ): void {
        const showListButton: HTMLInputElement | null = shadowRoot.querySelector(`.${templateConfig.ctrlButtons}__show`);

        showListButton?.addEventListener("click", async () => {
            const data: IUserModelItem[] = await this.usersModel.getUsers();
            const event: CustomEvent = new CustomEvent("showListButtonClick", {
                detail: {
                    data,
                    isItemSelectedCalbck: this.usersModel.isItemSelected.bind(this.usersModel)
                }
            });

            rootNode.dispatchEvent(event);
        });
    }

    private addHideListButtonEvents(
        shadowRoot: ShadowRoot,
        templateConfig: ISearchComponentNames,
        rootNode: HTMLElement
    ): void {
        const hideListButton: HTMLInputElement | null = shadowRoot.querySelector(`.${templateConfig.ctrlButtons}__hide`);

        hideListButton?.addEventListener("click", () => {
            rootNode.dispatchEvent(new Event("hideButtonClick"));
        });
    }

    private addDataListEvents(
        shadowRoot: ShadowRoot,
        templateConfig: ISearchComponentNames,
        rootNode: HTMLElement
    ): void {
        const dataList: HTMLElement | null = shadowRoot.querySelector(`#${templateConfig.datalistId}__ul`);

        dataList?.addEventListener("click", (e: Event) => {
            const event: CustomEvent = new CustomEvent("dataListClick", {
                detail: {
                    id: (e.target as HTMLElement).dataset.id,
                    target: e.target,
                    modelUnselectItemClb: this.usersModel.unselectItem.bind(this.usersModel),
                    modelIsAnySelectionClb: this.usersModel.isAnySelection.bind(this.usersModel),
                    modelSelectItemClb: this.usersModel.selectItem.bind(this.usersModel),
                    getSelectedItem: this.getSelectedItem
                }
            });

            this.dispatchDatalistEvent(event);
            rootNode.dispatchEvent(event);
        });
    }

    private addSearchInputEvents(
        shadowRoot: ShadowRoot,
        templateConfig: ISearchComponentNames,
        rootNode: HTMLElement
    ): void {
        const searchInput: HTMLInputElement | null = shadowRoot.querySelector(`#${templateConfig.datalistId}__input`);

        searchInput?.addEventListener("input", async (): Promise<void> => {
            const data: IUserModelItem[] = await this.usersModel.getUsers();
            const event: CustomEvent = new CustomEvent("searchInput", {
                detail: {
                    data,
                    isItemSelectedCalbck: this.usersModel.isItemSelected.bind(this.usersModel)
                }
            });

            rootNode.dispatchEvent(event);
        });
    }

    private addClearSelectionButtonEvents(
        shadowRoot: ShadowRoot,
        templateConfig: ISearchComponentNames,
        rootNode: HTMLElement
    ): void {
        const clearSelectionButton: HTMLInputElement | null =
            shadowRoot.querySelector(`.${templateConfig.ctrlButtons}__clear-selection`);

        clearSelectionButton?.addEventListener("click", () => {
            const event: Event = new Event("clearSelectionButtonClick");

            rootNode.dispatchEvent(event);
            this.dispatchDatalistEvent(event);

            this.usersModel.unselectAllItems();
        });
    }

    private addWindowEvents(rootNode: HTMLElement): void {
        rootNode.dispatchEvent(new Event("windowClickEvent"));
        rootNode.dispatchEvent(new Event("windowKeyDownEvent"));
    }

    public dispatchEvent(event: Event): void {
        return SearchInputComponent.dispatchEvent(event);
    }

    public initComponent(
        componentID: string,
        dispatchDatalistEvent: (event: Event) => void
    ): Promise<HTMLElement> {
        return new Promise((res) => {
            SearchInputComponent.init(componentID);

            const element: HTMLElement = document.createElement(this.tagName);

            element.setAttribute("id", componentID);

            this.dispatchDatalistEvent = dispatchDatalistEvent;
            this.getSelectedItem = (id: string) => SearchInputComponent.getSelectedItem(id);

            res(element);
        });
    }
}