"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCommonLockedError = void 0;
const isCommonLockedError = (error) => {
    const commonMessages = [
        'Ledger device: Incorrect length',
        'Ledger device: INS_NOT_SUPPORTED',
        'Ledger device: CLA_NOT_SUPPORTED',
        'Unknown',
        'Ledger device',
        'CLA_NOT_SUPPORTED',
        'CLA',
        'Locked',
        'Failed to open the device',
        'Failed to open the device',
        'Ledger Device is busy',
        'Ledger device',
        'UNKNOWN_ERROR',
    ];
    return (commonMessages.some((m) => m.includes(error)) ||
        commonMessages.some((m) => error.toLowerCase().includes(m)) ||
        commonMessages.some((m) => m.toLowerCase().includes(error.toLowerCase())));
};
exports.isCommonLockedError = isCommonLockedError;
//# sourceMappingURL=helpers.js.map