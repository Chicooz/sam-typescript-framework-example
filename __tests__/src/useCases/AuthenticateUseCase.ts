import { instance, mock, reset, when, anything } from "ts-mockito";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { AuthenticateUserUseCase } from "../../../src/useCases/AuthenticateUseCase";
import { AuthenticateBody } from "../../../src/handlers/authenticate";
import { User } from "../../../src/providers/UserProvider";
import { PasswordProvider } from "../../../src/providers/PasswordProvider";

describe("Test create contract use case", () => {
    const userRepository: UserRepository = mock(UserRepository);
    const fakePasswordProvider: PasswordProvider = mock(PasswordProvider);
    const fakeAuthBody: AuthenticateBody = {
        username: "test@user.com",
        password: "testpass",
    };
    const fakeUser: User = {
        userId: "fakeuuid",
        username: "test@user.com",
        password: "testpass",
        authToken: "",
    };

    afterEach(() => {
        reset(userRepository);
    });

    it("will return token if valid username/password are provided  ", async () => {
        when(userRepository.getUserByUsername(fakeAuthBody.username!)).thenResolve(fakeUser);
        when(userRepository.updateUserToken(fakeUser.userId!, anything())).thenResolve();
        when(fakePasswordProvider.isCorrectPassword(fakeAuthBody.password!, fakeUser.password)).thenResolve(true);
        const useCase = new AuthenticateUserUseCase(
            fakeAuthBody,
            instance(userRepository),
            instance(fakePasswordProvider),
        );
        const response = await useCase.operate();
        expect(response).not.toBeNull();
    });
    it("will throw Wrong Password if pasword is incorrect ", async () => {
        when(userRepository.getUserByUsername(fakeAuthBody.username!)).thenResolve(fakeUser);
        when(userRepository.updateUserToken(fakeUser.userId!, anything())).thenResolve();
        when(fakePasswordProvider.isCorrectPassword(fakeAuthBody.password!, fakeUser.password)).thenResolve(false);
        const useCase = new AuthenticateUserUseCase(
            fakeAuthBody,
            instance(userRepository),
            instance(fakePasswordProvider),
        );
        try {
            const response = await useCase.operate();
        } catch (e) {
            const error = e as Error;
            expect(error.message).toEqual("Wrong password");
        }
    });
    it("will throw Invalid Request if pasword or username are not present ", async () => {
        fakeAuthBody.username = undefined;
        const useCase = new AuthenticateUserUseCase(
            fakeAuthBody,
            instance(userRepository),
            instance(fakePasswordProvider),
        );
        try {
            const response = await useCase.operate();
        } catch (e) {
            const error = e as Error;
            expect(error.message).toEqual("Invalid Request");
        }
    });
});
