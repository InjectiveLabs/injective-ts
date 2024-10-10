/// <reference types="node" />
import { ErrorContext, ErrorContextCode, TransactionChainErrorModule } from '../types';
export declare const parseErrorMessage: (message: string) => string;
export declare const mapFailedTransactionMessageFromString: (message: string) => {
    message: string;
    code: ErrorContextCode;
    module?: TransactionChainErrorModule | undefined;
};
export declare const mapFailedTransactionMessage: (message: string, context?: ErrorContext) => {
    message: string;
    code: ErrorContextCode;
    contextModule?: string | undefined;
};
export declare const mapMetamaskMessage: (message: string) => string;
//# sourceMappingURL=maps.d.ts.map