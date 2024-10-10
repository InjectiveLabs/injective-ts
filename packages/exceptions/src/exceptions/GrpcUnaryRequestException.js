"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrpcUnaryRequestException = void 0;
const exception_1 = require("../exception");
const types_1 = require("../types");
class GrpcUnaryRequestException extends exception_1.ConcreteException {
    constructor(error, context) {
        super(error, context);
        this.errorClass = 'GrpcUnaryRequestException';
        this.type = types_1.ErrorType.GrpcUnaryRequest;
    }
    parse() {
        const { message } = this;
        if (message.toLowerCase().includes('response closed without headers')) {
            this.setMessage('The request has failed. The server has closed the connection without sending any headers.');
            this.setContextCode(types_1.GRPC_REQUEST_FAILED);
        }
    }
}
exports.GrpcUnaryRequestException = GrpcUnaryRequestException;
//# sourceMappingURL=GrpcUnaryRequestException.js.map