import { UseCase } from "./UseCase";
import { ContractRepository } from "../repositories/ContractRepository";
import { GetContractQuery } from "../handlers/getContract";
import { Contract } from "../providers/ContractProvider";

export class GetContractUseCase extends UseCase<Contract> {
    readonly contractQuery: GetContractQuery;
    readonly contractRepository: ContractRepository;

    constructor( contractQuery:GetContractQuery, contractRepository: ContractRepository) {
        super();
        this.contractRepository = contractRepository;
        this.contractQuery = contractQuery;
    }

    async operate(): Promise<Contract> {
        const contractID = this.contractQuery.id;
        if(!contractID){
            throw new Error("Bad Request")
        }
        return await this.contractRepository.getContract(contractID); 
    }
}
