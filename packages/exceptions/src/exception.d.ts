import { Exception, ErrorType, ErrorContext, ErrorCode, ErrorContextCode } from './types';
export declare abstract class ConcreteException extends Error implements Exception {
    /**
     * The name of the error class as it the constructor.name might
     * give a minified class name when we bundle using webpack
     */
    static errorClass: string;
    /**
     * The type of the Error
     */
    type: ErrorType;
    /**
     * Error specific code (HttpStatus, GrpcStatus, etc)
     */
    code: ErrorCode;
    /**
     * The name of the error (the name of the instance of the Exception)
     */
    name: string;
    /**
     * The name of the error (the name of the instance of the Exception)
     * Needed for reporting reasons, ex: bugsnag
     */
    errorClass: string;
    /**
     * Providing more context
     * (ex: endpoint on http request)
     */
    context?: string;
    /**
     * Providing more context as to where the exception was thrown
     * (ex: on-chain module, etc)
     */
    contextModule?: string;
    /**
     * Providing more context as to why the exception was thrown
     * (ex: on-chain error code, etc)
     */
    contextCode?: ErrorContextCode;
    /**
     * Parsed message of the exception
     */
    message: string;
    /**
     * The original stack of the error
     */
    stack?: string;
    /**
     * The original message of the error
     */
    originalMessage: string;
    constructor(error: Error, context?: ErrorContext);
    parse(): void;
    parseError(error: Error): void;
    parseContext(errorContext?: ErrorContext): void;
    setType(type: ErrorType): void;
    setCode(code: ErrorCode): void;
    setContext(context: string): void;
    setOriginalMessage(message: string): void;
    setStack(stack: string): void;
    setName(name: string): void;
    setMessage(message: string): void;
    setContextModule(contextModule: string): void;
    setContextCode(code: ErrorContextCode): void;
    toOriginalError(): Error;
    toError(): Error;
    toCompactError(): Error;
    toJson(): string;
    toObject(): {
        message: string;
        originalMessage: string;
        errorClass: string;
        code: ErrorCode;
        type: ErrorType;
        context: string | undefined;
        contextModule: string | undefined;
        contextCode: ErrorContextCode | undefined;
        stack: string[];
    };
    toString(): string;
}
//# sourceMappingURL=exception.d.ts.map