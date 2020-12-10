import { serverConfig } from "../configs/serverConfig";
import { IUserModelItem } from "../interfaces/IUserModelItem";
import { IUsersModel } from "../interfaces/IUsersModel";

export class UsersModel implements IUsersModel {
  private static _instance: UsersModel;
  private hash: { isLoaded: boolean; data: IUserModelItem[] } = {
    isLoaded: false,
    data: []
  };
  private selectedItemsIds: Set<string> = new Set();

  public getInstance(): UsersModel {
    if (!UsersModel._instance) {
      UsersModel._instance = new UsersModel();
    }

    return UsersModel._instance;
  }

  public loadUsers(): Promise<IUserModelItem[]> {
    return fetch(`${serverConfig.baseUrl}/${serverConfig.users}`)
      .then((res) => res.json())
      .then((data: IUserModelItem[]) => {
        this.hash.isLoaded = true;
        this.hash.data.push(
          ...data.map((el) => ((el.id = el.id.toString()), el))
        );

        return data;
      });
  }

  public getUsers(): Promise<IUserModelItem[]> {
    if (!this.hash.isLoaded) {
      return this.loadUsers();
    }

    return new Promise((res) => res(this.hash.data));
  }

  public async getItem(id: string): Promise<IUserModelItem | undefined> {
    return (await this.getUsers()).find((el: IUserModelItem) => el.id === id);
  }

  public isItemSelected(id: string): boolean {
    return this.selectedItemsIds.has(id);
  }

  public isAnySelection(): boolean {
    return this.selectedItemsIds.size !== 0;
  }

  public selectItem(id: string): void {
    this.selectedItemsIds.add(id);
  }

  public unselectItem(id: string): void {
    this.selectedItemsIds.delete(id);
  }

  public unselectAllItems(): void {
    this.selectedItemsIds.clear();
  }

  public getSelectedItems(): string[] {
    return [...this.selectedItemsIds];
  }
}
