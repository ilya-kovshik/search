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

    private toggleControllsButtonsVisibility(
        showButton: HTMLElement | null,
        hideButton: HTMLElement | null,
        config?: {hideBtnVissibile: boolean, showBtnVissibile: boolean}
    ): void {
        if(config) {
            config.hideBtnVissibile ?
                hideButton?.classList.remove("hidden"):
                hideButton?.classList.add("hidden");

            config.showBtnVissibile ?
                showButton?.classList.remove("hidden"):
                showButton?.classList.add("hidden");

            return;
        }

        showButton?.classList.toggle("hidden");
        hideButton?.classList.toggle("hidden");
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
        const datalistNode: HTMLElement | null =
            SearchComponent.getElement(shadowRoot, `#${templateConfig.datalistId}__ul`);
        const datalistInputNode: HTMLInputElement | null =
            SearchComponent.getElement(shadowRoot, `#${templateConfig.datalistId}__input`);
        const showListButton: HTMLInputElement | null =
            SearchComponent.getElement(shadowRoot, `.${templateConfig.ctrlButtons}__show`);
        const hideListButton: HTMLInputElement | null =
            SearchComponent.getElement(shadowRoot, `.${templateConfig.ctrlButtons}__hide`);
        const clearSelectionButton: HTMLInputElement | null =
            SearchComponent.getElement(shadowRoot, `.${templateConfig.ctrlButtons}__clear-selection`);
        const selectedListNode: HTMLInputElement | null =
            SearchComponent.getElement(shadowRoot, `#${templateConfig.selectedListId}`);

        showListButton?.addEventListener("click", () => {
            const listArr: HTMLElement[] =
                SearchComponent.getDatalistItems(data, this.usersModel.isItemSelected.bind(this.usersModel), datalistInputNode?.value);

            SearchComponent.appendElements(datalistNode, listArr);
            datalistInputNode?.parentElement?.classList.add("active");

            this.toggleControllsButtonsVisibility(showListButton, hideListButton);
        });

        hideListButton?.addEventListener("click", () => {
            datalistInputNode?.parentElement?.classList.remove("active");

            this.toggleControllsButtonsVisibility(showListButton, hideListButton);
        });


        datalistInputNode?.addEventListener("input", (): void => {
            const value: string = datalistInputNode.value;
            const listArr: HTMLElement[] =
                SearchComponent.getDatalistItems(data, this.usersModel.isItemSelected.bind(this.usersModel), value);

            SearchComponent.appendElements(datalistNode, listArr);
            datalistInputNode.parentElement?.classList.add("active");

            this.toggleControllsButtonsVisibility(
                showListButton,
                hideListButton,
                {hideBtnVissibile: true, showBtnVissibile: false}
            );
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