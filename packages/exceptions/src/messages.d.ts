import { ErrorContextCode, TransactionChainErrorModule } from './types';
export declare const chainModuleCodeErrorMessagesMap: Record<string, Record<number, string>>;
/**
 * **Legacy** but needed for error messages from broadcasting transactions
 * where we don't control the response and only have the message
 * i.e Keplr, Leap, etc
 */
export declare const chainErrorMessagesMap: Record<string, {
    message: string;
    code: ErrorContextCode;
    module: TransactionChainErrorModule;
}>;
//# sourceMappingURL=messages.d.ts.map