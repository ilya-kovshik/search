import { UsersModel } from "../models/usersModel";
import { SearchComponent } from "../components/search-component";
import { IUserModelItem } from "../interfaces/IUserModelItem";
import { ISearchComponentNames } from "../interfaces/ISearchComponentNames";
export class SearchComponentController {
    private tagName: string;
    private usersModel: UsersModel;

    constructor(tagName: string, usersModel: UsersModel) {
        this.tagName = tagName;
        this.usersModel = usersModel;
    }

    private observeNodes(componentID: string): Promise<HTMLElement> {
        return new Promise((res) => {
            const observerCallback = (mutationsList: any) => {
                for(const mutation of mutationsList) {
                    if (mutation.type === "childList" && mutation.addedNodes.length) {
                        const node: HTMLElement | null = document.getElementById(componentID);

                        if(node) {
                            observer.disconnect();

                            res(node);
                        }
                    }
                }
            };
            const observer: MutationObserver = new MutationObserver(observerCallback);

            observer.observe(document, { attributes: true, childList: true, subtree: true });
        });
    }

    private addEventListeners(rootNode: HTMLElement): void {
        const templateConfig: ISearchComponentNames = SearchComponent.getTemplateConfig();
        const shadowRoot: ShadowRoot = rootNode.shadowRoot as ShadowRoot;

        this.addShowListButtonEvent(shadowRoot, templateConfig, rootNode);
        this.addHideListButtonEvents(shadowRoot, templateConfig, rootNode);
        this.addDataListEvents(shadowRoot, templateConfig, rootNode);
        this.addSelectedListEvents(shadowRoot, templateConfig, rootNode);
        this.addSearchInputEvents(shadowRoot, templateConfig, rootNode);
        this.addClearSelectionButtonEvents(shadowRoot, templateConfig, rootNode);
        this.addWindowEvents(rootNode);
    }

    private addShowListButtonEvent(
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
        const selectedList: HTMLInputElement | null = shadowRoot.querySelector(`#${templateConfig.selectedListId}`);

        selectedList?.addEventListener("click", (e: Event) => {
            const event: Event = new CustomEvent("selectedListClick", {
                detail: {
                    target: e.target,
                    unselectItem: (id: string) => this.usersModel.unselectItem.call(this.usersModel, id),
                    isAnySelection: this.usersModel.isAnySelection.bind(this.usersModel)
                }
            });

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
            rootNode.dispatchEvent(new Event("clearSelectionButtonClick"));

            this.usersModel.unselectAllItems();
        });
    }

    private addWindowEvents(rootNode: HTMLElement): void {
        rootNode.dispatchEvent(new Event("windowClickEvent"));
        rootNode.dispatchEvent(new Event("windowKeyDownEvent"));
    }

    public initSearchComponent(componentID: string): Promise<string> {
        return new Promise((res) => {
            SearchComponent.init();

            this.observeNodes(componentID).then((node: HTMLElement) => {
                this.addEventListeners(node);

            });

            res(`<${this.tagName} id="${componentID}"></${this.tagName}>`);
        });
    }
}