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

        const dataList: HTMLElement | null = shadowRoot.querySelector(`#${templateConfig.datalistId}__ul`);
        const searchInput: HTMLInputElement | null = shadowRoot.querySelector(`#${templateConfig.datalistId}__input`);
        const showListButton: HTMLInputElement | null = shadowRoot.querySelector(`.${templateConfig.ctrlButtons}__show`);
        const hideListButton: HTMLInputElement | null = shadowRoot.querySelector(`.${templateConfig.ctrlButtons}__hide`);
        const clearSelectionButton: HTMLInputElement | null = shadowRoot.querySelector(`.${templateConfig.ctrlButtons}__clear-selection`);
        const selectedList: HTMLInputElement | null = shadowRoot.querySelector(`#${templateConfig.selectedListId}`);

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
            rootNode.dispatchEvent(new Event("hideButtonClick"));
        });

        searchInput?.addEventListener("input", (): void => {
            const event: CustomEvent = new CustomEvent("searchInput", {
                detail: {
                    data,
                    isItemSelectedCalbck: this.usersModel.isItemSelected.bind(this.usersModel)
                }
            });

            rootNode.dispatchEvent(event);
        });

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

        clearSelectionButton?.addEventListener("click", () => {
            rootNode.dispatchEvent(new Event("clearSelectionButtonClick"));

            this.usersModel.unselectAllItems();
        });

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