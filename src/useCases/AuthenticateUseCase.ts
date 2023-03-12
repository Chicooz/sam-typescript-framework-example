import { UseCase } from "./UseCase";
import { UserRepository } from "../repositories/UserRepository";
import { AuthenticateBody } from "../handlers/authenticate";
import { PasswordProvider } from "../providers/PasswordProvider";
import { JWTProvider } from "../providers/JWTProvider";

export class AuthenticateUserUseCase extends UseCase<string> {
    readonly user: AuthenticateBody;
    readonly userRepository: UserRepository;
    readonly passwordProvider: PasswordProvider;

    constructor(user: AuthenticateBody, userRepository: UserRepository, passwordProvider: PasswordProvider) {
        super();
        this.user = user;
        this.userRepository = userRepository;
        this.passwordProvider = passwordProvider;
    }

    async operate(): Promise<string> {
        if (!this.user || !this.user.username || !this.user.password) {
            throw new Error("Invalid Request");
        }
        const dbUser = await this.userRepository.getUserByUsername(this.user.username);
        const isPasswordCorrect = await this.passwordProvider.isCorrectPassword(this.user.password, dbUser.password);
        if (isPasswordCorrect) {
            const jWTProvider = new JWTProvider(dbUser.password);
            const token = await jWTProvider.sign(dbUser.username, dbUser.userId);
            await this.userRepository.updateUserToken(dbUser.userId, token);
            return token;
        } else {
            throw new Error("Wrong password");
        }
    }
}
