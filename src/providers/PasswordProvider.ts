import bcrypt from "bcryptjs";
import generator from "password-generator";

export class PasswordProvider {
    private maxLength = 12;
    private minLength = 3;
    private lowercaseMinCount = 1;
    private numberMinCount = 1;
    private specialMinCount = 0;
    private LOWERCASE_RE = /([a-z])/g;
    private NUMBER_RE = /([\d])/g;
    private SPECIAL_CHAR_RE = /([\?\-])/g;

    async generateSalt(): Promise<string> {
        const saltRounds = 10;
        return bcrypt.genSaltSync(saltRounds);
    }

    async encryptPassword(salt: string, password: string): Promise<string> {
        return bcrypt.hashSync(password, salt);
    }

    async generatePassword(): Promise<string> {
        var password = "";
        var randomLength = Math.floor(Math.random() * (this.maxLength - this.minLength)) + this.minLength;
        while (!this.isStrongEnough(password)) {
            password = generator(randomLength, true, /[\w\d\?\-]/) + Math.floor(Math.random() * (100 - 999));
        }
        return password;
    }

    isStrongEnough(password: string): boolean {
        const lc = password.match(this.LOWERCASE_RE);
        const n = password.match(this.NUMBER_RE);
        const sc = password.match(this.SPECIAL_CHAR_RE);
        return (
            (password.length >= this.minLength &&
                lc &&
                lc.length >= this.lowercaseMinCount &&
                n &&
                n.length >= this.numberMinCount &&
                sc &&
                sc.length >= this.specialMinCount) ??
            false
        );
    }

    async isCorrectPassword(password: string, hash: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}
