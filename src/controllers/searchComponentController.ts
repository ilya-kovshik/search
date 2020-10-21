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
                        const node: HTMLElement =
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

        Promise
            .all([this.usersModel.getUsers(), this.observeNodes()])
            .then(([data, node]) => {
                console.log(data, node);
            });

        return `<${this.tagName}></${this.tagName}>`;
    }
}