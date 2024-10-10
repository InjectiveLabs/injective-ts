import { ConcreteException } from '../exception';
import { ErrorContext, HttpRequestMethod } from '../types';
export declare class HttpRequestException extends ConcreteException {
    errorClass: string;
    method: HttpRequestMethod;
    constructor(error: Error, context?: ErrorContext & {
        method?: HttpRequestMethod;
    });
}
//# sourceMappingURL=HttpRequestException.d.ts.map