"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteException = void 0;
/* eslint-disable class-methods-use-this */
const types_1 = require("./types");
const utils_1 = require("./utils");
class ConcreteException extends Error {
    constructor(error, context) {
        super(error.message);
        /**
         * The type of the Error
         */
        this.type = types_1.ErrorType.Unspecified;
        /**
         * Error specific code (HttpStatus, GrpcStatus, etc)
         */
        this.code = types_1.UnspecifiedErrorCode;
        /**
         * Parsed message of the exception
         */
        this.message = '';
        /**
         * The original stack of the error
         */
        this.stack = '';
        /**
         * The original message of the error
         */
        this.originalMessage = '';
        this.parseError(error);
        this.parseContext(context);
        this.parse();
    }
    parse() {
        //
    }
    parseError(error) {
        this.setName(this.errorClass || this.constructor.name);
        this.setStack(error.stack || '');
        this.setMessage(error.message);
        this.originalMessage = error.message;
    }
    parseContext(errorContext) {
        const { contextModule, type, code, context } = errorContext || {
            contextModule: 'Unknown',
            context: 'Unknown',
            code: types_1.UnspecifiedErrorCode,
            type: types_1.ErrorType.Unspecified,
        };
        this.context = context;
        this.contextModule = contextModule;
        this.type = type || types_1.ErrorType.Unspecified;
        this.code = code || types_1.UnspecifiedErrorCode;
    }
    setType(type) {
        this.type = type;
    }
    setCode(code) {
        this.code = code;
    }
    setContext(context) {
        this.context = context;
    }
    setOriginalMessage(message) {
        this.originalMessage = message;
    }
    setStack(stack) {
        try {
            this.stack = stack;
        }
        catch (e) {
            // throw nothing here
        }
    }
    setName(name) {
        super.name = name;
        this.name = name;
        this.errorClass = name;
    }
    setMessage(message) {
        super.message = message;
        this.message = message;
    }
    setContextModule(contextModule) {
        this.contextModule = contextModule;
    }
    setContextCode(code) {
        this.contextCode = code;
    }
    toOriginalError() {
        const error = new Error(this.originalMessage);
        error.stack = this.stack;
        error.name = this.name || '';
        return error;
    }
    toError() {
        const error = new Error(this.message);
        error.stack = this.stack;
        error.name = this.name || '';
        return error;
    }
    toCompactError() {
        const name = this.name || (0, utils_1.toPascalCase)(this.type);
        const error = new Error(`${this.message} | ${JSON.stringify({
            originalMessage: this.originalMessage,
            message: this.message,
            errorClass: name,
            code: this.code,
            type: this.type,
            context: this.context,
            contextModule: this.contextModule,
            contextCode: this.contextCode,
            stack: (this.stack || '').split('\n').map((line) => line.trim()),
        })}`);
        error.stack = this.stack;
        error.name = this.name || (0, utils_1.toPascalCase)(this.type);
        return error;
    }
    toJson() {
        return JSON.stringify({ error: this.message, stack: this.stack });
    }
    toObject() {
        const name = this.name || (0, utils_1.toPascalCase)(this.type);
        return {
            message: this.message,
            originalMessage: this.originalMessage,
            errorClass: name,
            code: this.code,
            type: this.type,
            context: this.context,
            contextModule: this.contextModule,
            contextCode: this.contextCode,
            stack: (this.stack || '').split('\n').map((line) => line.trim()),
        };
    }
    toString() {
        return this.message;
    }
}
exports.ConcreteException = ConcreteException;
/**
 * The name of the error class as it the constructor.name might
 * give a minified class name when we bundle using webpack
 */
ConcreteException.errorClass = '';
//# sourceMappingURL=exception.js.map