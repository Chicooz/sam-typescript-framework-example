import { instance, mock, reset, when } from "ts-mockito";
import { ContractRepository } from "../../../src/repositories/ContractRepository";
import { GetContractUseCase } from "../../../src/useCases/GetContractUseCase";
import { GetContractQuery } from "../../../src/handlers/getContract";
import { Contract } from "../../../src/providers/ContractProvider";

describe("Test get contract use case", () => {
    const contractRepository: ContractRepository = mock(ContractRepository);
    const fakeContractQuery: GetContractQuery = {
        id: "uuid",
    };
    const fakeContract: Contract = {
        userId: "uuid",
        contractName: "another string",
        templateID: "uuid",
        contractID: "fakeContractUUID",
    };

    afterEach(() => {
        reset(contractRepository);
    });

    it("will return contract details if provided with correct contract id  ", async () => {
        when(contractRepository.getContract(fakeContractQuery.id!)).thenResolve(fakeContract);
        const useCase = new GetContractUseCase(fakeContractQuery, instance(contractRepository));
        const response = await useCase.operate();
        expect(response).toEqual(fakeContract);
    });
    it("will throw bad request if provided with bad contract id  ", async () => {
        fakeContractQuery.id = undefined;
        const useCase = new GetContractUseCase(fakeContractQuery, instance(contractRepository));
        try {
            const response = await useCase.operate();
        } catch (e) {
            const error = e as Error;
            expect(error.message).toEqual("Bad Request");
        }
    });
});
