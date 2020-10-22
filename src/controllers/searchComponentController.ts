import { UsersModel } from "../models/usersModel";
import { SearchComponent } from "../components/search-component";
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

    public async initSearchComponent(): Promise<string> {
        SearchComponent.init();
        const templateConfig: {datalistId: string, ctrlButtons: string}
            = SearchComponent.getTemplateConfig();

        Promise
            .all([this.usersModel.getUsers(), this.observeNodes()])
            .then(([data, node]) => {
                const shadowRoot: ShadowRoot | null = node.shadowRoot;
                if(!shadowRoot) {
                    return;
                }

                const datalistNode: HTMLElement | null
                    = SearchComponent.getElement(shadowRoot, `#${templateConfig.datalistId}__ul`);

                const datalistInputNode: HTMLInputElement | null
                    = SearchComponent.getElement(shadowRoot, `#${templateConfig.datalistId}__input`);

                const showListButton: HTMLInputElement | null
                    = SearchComponent.getElement(shadowRoot, `.${templateConfig.ctrlButtons}__show`);

                const hideListButton: HTMLInputElement | null
                    = SearchComponent.getElement(shadowRoot, `.${templateConfig.ctrlButtons}__hide`);

                showListButton?.addEventListener("click", () => {
                    showListButton.classList.add("hidden");
                    hideListButton?.classList.remove("hidden");

                    datalistInputNode?.parentElement?.classList.add("active");

                    const listArr: HTMLElement[] = SearchComponent.getDatalistItems(data);
                    SearchComponent.appendElements(datalistNode, listArr);
                });

                hideListButton?.addEventListener("click", () => {
                    hideListButton.classList.add("hidden");
                    showListButton?.classList.remove("hidden");

                    datalistInputNode?.parentElement?.classList.remove("active");
                });


                datalistInputNode?.addEventListener("input", (): void => {
                    const value: string = datalistInputNode.value;

                    const listArr: HTMLElement[] = SearchComponent.getDatalistItems(data, value);
                    SearchComponent.appendElements(datalistNode, listArr);

                    datalistInputNode.parentElement?.classList.add("active");
                });
            });

        return `<${this.tagName}></${this.tagName}>`;
    }
}