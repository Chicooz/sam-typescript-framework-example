import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult } from "aws-lambda";
import { UserRepository } from "../repositories/UserRepository";
import { JWTProvider } from "../providers/JWTProvider";

export class Authoriser implements IAuthoriser {
    readonly event: APIGatewayAuthorizerEvent;
    readonly repository: UserRepository;
    constructor(event: APIGatewayAuthorizerEvent, repository: UserRepository) {
        this.event = event;
        this.repository = repository;
    }
    async getToken(): Promise<string> {
        if (this.event.type !== "TOKEN") {
            throw new Error('Expected "event.type" parameter to have value "TOKEN"');
        }
        const tokenString = this.event.authorizationToken;
        const match = tokenString?.match(/^Bearer (.*)$/);
        if (!match || match.length < 2) {
            throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
        }
        return match[1];
    }
    async isAuthorised(): Promise<string | boolean> {
        try {
            const token = await this.getToken();
            const user = await this.repository.getUserByToken(token);
            if (!user) {
                return false;
            }
            const jwtProvider = new JWTProvider(user.password);
            const verifiedToken = await jwtProvider.verifySynchronously(token);
            if(typeof verifiedToken === "string" || verifiedToken.email !== user.username || verifiedToken.userId !== user.userId) {
                return false;        
            }
            return user.userId;    
        } catch (e) {
            const error = e as Error;
            console.log("returning false due to error " + error.message);
            return false;
        }
    }
}

export interface IAuthoriser {
    isAuthorised(): Promise<string | boolean>;
}
