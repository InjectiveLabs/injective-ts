import { ConcreteException } from '../exception';
import { ErrorContext } from '../types';
export declare class Web3Exception extends ConcreteException {
    errorClass: string;
    constructor(error: Error, context?: ErrorContext);
}
//# sourceMappingURL=Web3Exception.d.ts.map