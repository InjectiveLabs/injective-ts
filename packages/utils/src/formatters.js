"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatWalletAddress = void 0;
const formatWalletAddress = (address, substrLength = 6) => {
    if (address.length <= 10) {
        return address;
    }
    return `${address.slice(0, substrLength)}...${address.slice(address.length - substrLength, address.length)}`;
};
exports.formatWalletAddress = formatWalletAddress;
//# sourceMappingURL=formatters.js.map