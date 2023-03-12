import { UseCase } from "./UseCase";
import { ContractRepository } from "../repositories/ContractRepository";
import { CreateContractBody } from "../handlers/createContract";

export class CreateContractUseCase extends UseCase<string> {
    readonly contract: CreateContractBody;
    readonly contractRepository: ContractRepository;

    constructor(contract: CreateContractBody, contractRepository: ContractRepository) {
        super();
        this.contract = contract;
        this.contractRepository = contractRepository;
    }

    async operate(): Promise<string> {
        if (!this.contract || !this.contract.contractName || !this.contract.templateID || !this.contract.userID) {
            throw new Error("Invalid Request");
        }
        return await this.contractRepository.createContract(this.contract);
    }
}
