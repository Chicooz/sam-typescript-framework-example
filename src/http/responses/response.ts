export class NotAuthorised implements Response<null> {
    readonly statusCode: number = 403;
    readonly body: string;
    constructor(e: Error) {
        console.log(`Responding with ${this.statusCode} due to error [${e}: ${e.message}]`, e.stack);
        this.body = e.message;
    }
}

export class ServerError<Type> implements Response<Type | null> {
    readonly error: Error;
    readonly statusCode: number = 500;
    readonly body: string;

    constructor(e: Error) {
        this.error = e;
        console.log(
            `Responding with ${this.statusCode} due to error [${this.error}: ${this.error.message}]`,
            this.error.stack,
        );
        this.body = this.error.message;
    }
}

export class Success<Type> implements Response<Type | null> {
    body: string;
    statusCode: number = 200;

    constructor(body: Type) {
        this.body = toString(body);
    }
}

export class SuccessNoContent<Type> implements Response<null> {
    statusCode: number = 204;
    body: string = "{}";
}

export interface Response<Type> {
    statusCode: number;
    body?: string;
}

function toString<Type>(object: Type): string {
    return JSON.stringify(object);
}
