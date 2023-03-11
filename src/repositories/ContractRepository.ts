import { CreateContractBody } from "../handlers/createContract";
import { DatabaseContractDataProvider, Contract } from "../providers/ContractProvider";

export class ContractRepository {
    readonly databaseContractProvider: DatabaseContractDataProvider;

    constructor(databaseContractProvider: DatabaseContractDataProvider) {
        this.databaseContractProvider = databaseContractProvider;
    }

    async createContract(contract: CreateContractBody) {
        return await this.databaseContractProvider.createContract(contract);
    }
    async getContractsIDs() {
        return await this.databaseContractProvider.getContractsIDs();
    }
    async getContract(contractID: string) {
        return await this.databaseContractProvider.getContract(contractID);
    }
}
