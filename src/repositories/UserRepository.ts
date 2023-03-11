import { UpdateCommandOutput } from "@aws-sdk/lib-dynamodb";
import { DatabaseUserDataProvider, User } from "../providers/UserProvider";

export class UserRepository {
    readonly databaseUserProvider: DatabaseUserDataProvider;

    constructor(databaseUserProvider: DatabaseUserDataProvider) {
        this.databaseUserProvider = databaseUserProvider;
    }
    async getUserByUsername(username: string) {
        return this.databaseUserProvider.byUsername(username);
    }
    async updateUserToken(userId: string, token: string): Promise<UpdateCommandOutput> {
        return this.databaseUserProvider.updateToken(userId, token);
    }
    async getUserByToken(token: string): Promise<User | void> {
        return this.databaseUserProvider.byToken(token);
    }
}
