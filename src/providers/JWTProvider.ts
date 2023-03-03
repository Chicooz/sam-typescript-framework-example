import jwt, { JwtPayload } from "jsonwebtoken";

export class JWTProvider {
    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    async signSynchronously(userEmail: string, userId: string): Promise<string> {
        const options = {};
        const payload = { email: userEmail, userId: userId };
        return jwt.sign(payload, this.key, options);
    }

    async verifySynchronously(token: string): Promise<string | JwtPayload> {
        const options = {};
        return jwt.verify(token, this.key, options);
    }

    async sign(userEmail: string, userId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const options = {};
            const payload = { email: userEmail, userId: userId };
            return jwt.sign(payload, this.key, options, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result || "");
                }
            });
        });
    }

    async verify(token: string): Promise<string | jwt.JwtPayload> {
        return new Promise((resolve, reject) => {
            const options = {};
            return jwt.verify(token, this.key, options, function (error, decoded) {
                if (error) {
                    reject(error);
                } else {
                    resolve(decoded || "");
                }
            });
        });
    }
}
