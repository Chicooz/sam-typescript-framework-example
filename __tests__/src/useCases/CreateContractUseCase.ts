import { instance, mock, reset, when } from "ts-mockito";
import {  ContractRepository } from "../../../src/repositories/ContractRepository";
import { CreateContractUseCase } from "../../../src/useCases/CreateContractUseCase";
import { CreateContractBody } from "../../../src/handlers/createContract"

describe("Test create contract use case", () => {
    const contractRepository: ContractRepository = mock(ContractRepository);
    const fakeContract: CreateContractBody = {
        userID: "uuid",
        contractName: 'another string',
        templateID: 'uuid',
    };

    afterEach(() => {
        reset(contractRepository);
    });

    it("will return contractID if provided with correct contract data  ", async () => {
        when(contractRepository.createContract(fakeContract)).thenResolve("fakeContractUUID");
        const useCase = new CreateContractUseCase(fakeContract, instance(contractRepository));
        const response = await useCase.operate();
        expect(response).toEqual("fakeContractUUID")

        
    });

    it("will throw Invalid Request if provided with bad contract data  ", async () => {
        when(contractRepository.createContract(fakeContract)).thenResolve("fakeContractUUID");
        fakeContract.userID = undefined;
        const useCase = new CreateContractUseCase(fakeContract, instance(contractRepository));
        try{
            const response = await useCase.operate();
        }catch(e){
            const error = e as Error;
            expect(error.message).toEqual("Invalid Request")
        }        
    });


});
