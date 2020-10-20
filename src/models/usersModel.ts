import { serverConfig } from "../configs/serverConfig";
import { IUserModelItem } from "../interfaces/IUserModelItem";
import { IUsersModel } from "../interfaces/IUsersModel";

class UsersModel implements IUsersModel {
    private static _instance: UsersModel;

    public getInstance(): UsersModel {
        if (!UsersModel._instance) {
            UsersModel._instance = new UsersModel();
        }

        return UsersModel._instance;
    }

    public loadUsers(): Promise<IUserModelItem[]> {
        return fetch(`${serverConfig.baseUrl}/${serverConfig.users}`)
            .then(res => res.json());
    }
}

const usersModel: UsersModel = new UsersModel();

export {
    usersModel,
    UsersModel
};
