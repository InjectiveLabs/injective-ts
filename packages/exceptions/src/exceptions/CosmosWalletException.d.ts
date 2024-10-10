import { ConcreteException } from '../exception';
import { ErrorContext } from '../types';
export declare class CosmosWalletException extends ConcreteException {
    errorClass: string;
    constructor(error: Error, context?: ErrorContext);
}
//# sourceMappingURL=CosmosWalletException.d.ts.map