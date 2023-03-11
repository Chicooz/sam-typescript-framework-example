import { UseCase } from "./UseCase";
import { ContractRepository } from "../repositories/ContractRepository";
import { DBContractID } from "../handlers/getContractIDs";

export class GetContractIDsUseCase extends UseCase<DBContractID[]> {
    readonly contractRepository: ContractRepository;

    constructor(contractRepository: ContractRepository) {
        super();
        this.contractRepository = contractRepository;
    }

    async operate(): Promise<DBContractID[]> {
        return await this.contractRepository.getContractsIDs();
    }
}
