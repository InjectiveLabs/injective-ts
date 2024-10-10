"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNotificationDescription = exports.toPascalCase = void 0;
const toPascalCase = (str) => `${str}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(new RegExp(/\s+(.)(\w*)/, 'g'), (_$1, $2, $3) => `${$2.toUpperCase() + $3}`)
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
exports.toPascalCase = toPascalCase;
const formatNotificationDescription = (description) => {
    const DESCRIPTION_CHARACTER_LIMIT = 50;
    if (description.length <= DESCRIPTION_CHARACTER_LIMIT) {
        return {
            description,
            tooltip: '',
        };
    }
    return {
        description: description.slice(0, DESCRIPTION_CHARACTER_LIMIT) + ' ...',
        tooltip: description,
    };
};
exports.formatNotificationDescription = formatNotificationDescription;
//# sourceMappingURL=index.js.map