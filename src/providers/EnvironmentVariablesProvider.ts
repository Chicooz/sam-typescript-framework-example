export class EnvironmentVariablesProvider {
    getUsersTableName(): string {
        return 'Users-' + process.env.EnvironmentType;
    }
    getContractsTableName(): string {
        return 'Contracts-' + process.env.EnvironmentType;
    }
    
}
