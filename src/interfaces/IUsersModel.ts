import { UsersModel } from "../models/usersModel";
import { IUserModelItem } from "./IUserModelItem";

export interface IUsersModel {
  _instance?: UsersModel;
  getInstance(): UsersModel;
  loadUsers(): Promise<IUserModelItem[]>;
  getUsers(): Promise<IUserModelItem[]>;
  isItemSelected(id: string): boolean;
  isAnySelection(): boolean;
  selectItem(id: string): void;
  unselectItem(id: string): void;
  unselectAllItems(): void;
  getItem(id: string): Promise<IUserModelItem | undefined>;
  getSelectedItems(): string[];
}
