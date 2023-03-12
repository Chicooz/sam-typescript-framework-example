import { instance, mock, reset, when } from "ts-mockito";
import { DBContractID } from "../../../src/handlers/getContractIDs";
import {  ContractRepository } from "../../../src/repositories/ContractRepository";
import { GetContractIDsUseCase } from "../../../src/useCases/GetContractIDsUseCase";

const fakeDBContracts: DBContractID[] = [
    {
        contractID: {
            S: "fakeContractID",
        },
    },
    {
        contractID: {
            S: "fakeContractID",
        },
    },
];

describe("Test get contract use case", () => {
    const contractRepository: ContractRepository = mock(ContractRepository);   
    afterEach(() => {
        reset(contractRepository);
    });

    it("will return list of DBContractIDs  ", async () => {
        when(contractRepository.getContractsIDs()).thenResolve(fakeDBContracts);
        const useCase = new GetContractIDsUseCase( instance(contractRepository));
        const response = await useCase.operate();
        expect(response).toEqual(fakeDBContracts);
    });
});
