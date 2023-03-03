export abstract class UseCase<Type> {
    abstract operate(): Promise<Type>;
}
