export class EnvironmentVariablesProvider {
    getUsersTableName(): string {
        return 'Users-' + process.env.ENVIRONMENT;
    }
    getContractsTableName(): string {
        return 'Contracts-' + process.env.ENVIRONMENT;
    }
    
}
