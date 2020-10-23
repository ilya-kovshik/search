import { UsersModel } from "../models/usersModel";
import { SearchComponent } from "../components/search-component";
import { IUserModelItem } from "../interfaces/IUserModelItem";
import { ISearchComponentNames } from "../interfaces/ISearchComponentNames";
import { icons } from "../icons";
export class SearchComponentController {
    private tagName: string;
    private usersModel: UsersModel;

    constructor(tagName: string, usersModel: UsersModel) {
        this.tagName = tagName;
        this.usersModel = usersModel;
    }

    private observeNodes(): Promise<HTMLElement> {
        return new Promise((res) => {
            const observerCallback = (mutationsList: any) => {
                for(const mutation of mutationsList) {
                    if (mutation.type === "childList" && mutation.addedNodes.length) {
                        const node =
                            [...mutation.addedNodes].find(el => el.tagName.toLowerCase() === this.tagName);

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

    private addEventListeners(shadowRoot: ShadowRoot, data: IUserModelItem[], rootNode: HTMLElement): void {
        const templateConfig: ISearchComponentNames = SearchComponent.getTemplateConfig();

        const datalistNode: HTMLElement | null = shadowRoot.querySelector(`#${templateConfig.datalistId}__ul`);
        const datalistInputNode: HTMLInputElement | null = shadowRoot.querySelector(`#${templateConfig.datalistId}__input`);
        const showListButton: HTMLInputElement | null = shadowRoot.querySelector(`.${templateConfig.ctrlButtons}__show`);
        const hideListButton: HTMLInputElement | null = shadowRoot.querySelector(`.${templateConfig.ctrlButtons}__hide`);
        const clearSelectionButton: HTMLInputElement | null = shadowRoot.querySelector(`.${templateConfig.ctrlButtons}__clear-selection`);
        const selectedListNode: HTMLInputElement | null = shadowRoot.querySelector(`#${templateConfig.selectedListId}`);

        showListButton?.addEventListener("click", () => {
            const event: CustomEvent = new CustomEvent("showListButtonClick", {
                detail: {
                    data,
                    isItemSelectedCalbck: this.usersModel.isItemSelected.bind(this.usersModel)
                }
            });

            rootNode.dispatchEvent(event);
        });

        hideListButton?.addEventListener("click", () => {
            const hideButtonClickEvent: Event = new Event("hideButtonClick");

            rootNode.dispatchEvent(hideButtonClickEvent);
        });


        datalistInputNode?.addEventListener("input", (): void => {
            const searchInputEvent: CustomEvent = new CustomEvent("searchInput", {
                detail: {
                    data,
                    isItemSelectedCalbck: this.usersModel.isItemSelected.bind(this.usersModel)
                }
            });

            rootNode.dispatchEvent(searchInputEvent);
        });

        datalistNode?.addEventListener("click", (e: Event) => {
            const target: HTMLElement = (<HTMLElement>e.target);

            if(target.tagName.toLowerCase() === "li" && target.dataset.id) {
                const dataListItemClickEvent: CustomEvent = new CustomEvent("dataListItemClick", {
                    detail: {
                        id: target.dataset.id,
                        modelUnselectItemClb: this.usersModel.unselectItem.bind(this.usersModel),
                        modelIsAnySelectionClb: this.usersModel.isAnySelection.bind(this.usersModel),
                        modelSelectItemClb: this.usersModel.selectItem.bind(this.usersModel)
                    }
                });

                rootNode.dispatchEvent(dataListItemClickEvent);
            }
        });

        clearSelectionButton?.addEventListener("click", () => {
            const unselectListItemsEvent: Event = new Event("unselectListItems");
            const clearSelectedListEvent: Event = new Event("clearSelectedList");
            const showSelectedListDefaultItemEvent: Event = new Event("showSelectedListDefaultItem");
            const hideClearSelectionButtonEvent: Event = new Event("hideClearSelectionButton");

            rootNode.dispatchEvent(unselectListItemsEvent);
            rootNode.dispatchEvent(clearSelectedListEvent);
            rootNode.dispatchEvent(showSelectedListDefaultItemEvent);
            rootNode.dispatchEvent(hideClearSelectionButtonEvent);

            this.usersModel.unselectAllItems();
        });

        selectedListNode?.addEventListener("click", (e: Event) => {
            const target: HTMLElement = e.target as HTMLElement;
            const parent: HTMLElement | null = target.parentElement;
            const closeIconName: string | undefined = icons.close.split(" ").pop();

            if(closeIconName && parent && target.classList.contains(closeIconName)) {
                const id: string | undefined = parent.dataset.id;

                if(id) {
                    const removeSelectedListItemEvent: CustomEvent = new CustomEvent("removeSelectedListItem", {
                        detail: {
                            id: parent.dataset.id
                        }
                    });
                    const unselectDataListItemEvent: CustomEvent = new CustomEvent("unselectDataListItem", {
                        detail: {
                            id: parent.dataset.id
                        }
                    });

                    rootNode.dispatchEvent(removeSelectedListItemEvent);
                    rootNode.dispatchEvent(unselectDataListItemEvent);

                    this.usersModel.unselectItem(id);

                    if(!this.usersModel.isAnySelection()) {
                        const showSelectedListDefaultItemEvent: Event = new Event("showSelectedListDefaultItem");
                        const hideClearSelectionButtonEvent: Event = new Event("hideClearSelectionButton");

                        rootNode.dispatchEvent(showSelectedListDefaultItemEvent);
                        rootNode.dispatchEvent(hideClearSelectionButtonEvent);
                    }
                }
            }
        });
    }

    public async initSearchComponent(): Promise<string> {
        SearchComponent.init();

        Promise
            .all([this.usersModel.getUsers(), this.observeNodes()])
            .then(([data, node]) => {
                const shadowRoot: ShadowRoot | null = node.shadowRoot;
                if(!shadowRoot) {
                    return;
                }

                this.addEventListeners(shadowRoot, data, node);
            });

        return `<${this.tagName}></${this.tagName}>`;
    }
}