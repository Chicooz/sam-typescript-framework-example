import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    QueryCommand,
    UpdateCommand,
    UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { EnvironmentVariablesProvider } from "./EnvironmentVariablesProvider";

export class DatabaseUserDataProvider {
    readonly environmentVariablesProvider: EnvironmentVariablesProvider;
    readonly ddb: DynamoDBDocumentClient;
    readonly tableName: string;

    readonly marshallOptions = {
        // Whether to automatically convert empty strings, blobs, and sets to `null`.
        convertEmptyValues: false, // false, by default.
        // Whether to remove undefined values while marshalling.
        removeUndefinedValues: true,
        // Whether to convert typeof object to map attribute.
        convertClassInstanceToMap: false, // false, by default.
    };

    readonly unmarshallOptions = {
        // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
        wrapNumbers: false, // false, by default.
    };

    constructor(environmentVariablesProvider: EnvironmentVariablesProvider, tableName?: string | undefined) {
        this.environmentVariablesProvider = environmentVariablesProvider;
        const dynamdb = new DynamoDBClient({});
        this.ddb = DynamoDBDocumentClient.from(dynamdb, {
            marshallOptions: this.marshallOptions,
            unmarshallOptions: this.unmarshallOptions,
        });
        this.tableName = tableName ?? this.environmentVariablesProvider.getUsersTableName();
    }
    async byId(userId: string): Promise<User> {
        const params = {
            TableName: this.tableName,
            Key: {
                userId: userId,
            },
        };
        const user = (await this.ddb.send(new GetCommand(params)))?.Item;

        if (!user) {
            throw new Error(`User '${userId}' not found`);
        }

        return user as User;
    }
    async byUsername(username: string): Promise<User> {
        const params = {
            TableName: this.tableName,
            IndexName: "usernameIndex",
            KeyConditionExpression: "username = :name",
            ExpressionAttributeValues: {
                ":name": username,
            },
            ProjectionExpression: "userId, username, password",
        };
        const user = (await this.ddb.send(new QueryCommand(params)))?.Items;

        if (!user) {
            throw new Error(`Username: '${username}' not found`);
        }

        return user[0] as User;
    }
    async byToken(token: string): Promise<User | void> {
        const params = {
            TableName: this.tableName,
            IndexName: "authTokenIndex",
            KeyConditionExpression: "authToken = :name",
            ExpressionAttributeValues: {
                ":name": token,
            },
            ProjectionExpression: "userId, username, password, authToken",
        };
        try {
            const dbResult = await this.ddb.send(new QueryCommand(params));
            if (!dbResult || !dbResult?.Items?.length) {
                throw new Error(`Token: '${token}' not found`);
            }
            return dbResult.Items[0] as User;
        } catch (e) {
            const error = e as Error;
            console.log(error.message);
        }
    }
    async updateToken(userId: string, token: string) {
        const params: UpdateCommandInput = {
            TableName: this.tableName,
            Key: {
                userId: userId,
            },
            UpdateExpression: "set authToken = :token",
            ExpressionAttributeValues: {
                ":token": token,
            },
        };

        return await this.ddb.send(new UpdateCommand(params));
    }
}

export interface User {
    userId: string;
    username: string;
    password: string;
    authToken: string;
}
