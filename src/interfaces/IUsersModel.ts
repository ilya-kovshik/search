import { UsersModel } from "../models/usersModel";
import { IUserModelItem } from "./IUserModelItem";

export interface IUsersModel {
    _instance?: UsersModel;
    getInstance(): UsersModel;
    loadUsers(): Promise<IUserModelItem[]>;
}
