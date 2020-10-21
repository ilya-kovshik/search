import { serverConfig } from "../configs/serverConfig";
import { IUserModelItem } from "../interfaces/IUserModelItem";
import { IUsersModel } from "../interfaces/IUsersModel";

export class UsersModel implements IUsersModel {
    private static _instance: UsersModel;
    private hash: {isLoaded: boolean, data: IUserModelItem[]} = {
        isLoaded: false,
        data: []
    };

    public getInstance(): UsersModel {
        if (!UsersModel._instance) {
            UsersModel._instance = new UsersModel();
        }

        return UsersModel._instance;
    }

    public loadUsers(): Promise<IUserModelItem[]> {
        return fetch(`${serverConfig.baseUrl}/${serverConfig.users}`)
            .then(res => res.json())
            .then((data: IUserModelItem[]) => {
                this.hash.isLoaded = true;
                this.hash.data.push(...data);

                return data;
            });
    }

    public getUsers(): Promise<IUserModelItem[]>  {
        if(!this.hash.isLoaded) {
            return this.loadUsers();
        }

        return new Promise((res) => res(this.hash.data));
    }
}
