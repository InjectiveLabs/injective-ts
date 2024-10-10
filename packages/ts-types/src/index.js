"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamOperation = void 0;
__exportStar(require("./enums"), exports);
__exportStar(require("./aliases"), exports);
__exportStar(require("./transactions"), exports);
__exportStar(require("./cosmos"), exports);
__exportStar(require("./trade"), exports);
var StreamOperation;
(function (StreamOperation) {
    StreamOperation["Insert"] = "insert";
    StreamOperation["Delete"] = "delete";
    StreamOperation["Replace"] = "replace";
    StreamOperation["Update"] = "update";
    StreamOperation["Invalidate"] = "invalidate";
})(StreamOperation = exports.StreamOperation || (exports.StreamOperation = {}));
//# sourceMappingURL=index.js.map