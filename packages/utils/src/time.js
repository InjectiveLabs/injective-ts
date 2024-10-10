"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEndDateStringFromTimeInSeconds = exports.pastDays = exports.past24Hours = exports.todayInSeconds = exports.tomorrow = exports.getUTCDateFromTimestamp = exports.convertTimestampToMilliseconds = exports.SECONDS_IN_A_DAY = void 0;
const classes_1 = require("./classes");
exports.SECONDS_IN_A_DAY = new classes_1.BigNumber(60 * 60 * 24);
const convertTimestampToMilliseconds = (timestamp) => {
    const timestampInBigNumber = new classes_1.BigNumberInBase(timestamp);
    if (timestamp.toString().length > 13) {
        return timestampInBigNumber
            .precision(13, classes_1.BigNumber.ROUND_HALF_UP)
            .toNumber();
    }
    if (timestamp.toString().length < 13) {
        const trailingZeros = 13 - timestamp.toString().length;
        return timestampInBigNumber.times(Math.pow(10, trailingZeros)).toNumber();
    }
    return timestampInBigNumber.toNumber();
};
exports.convertTimestampToMilliseconds = convertTimestampToMilliseconds;
const getUTCDateFromTimestamp = (timestamp) => {
    const date = new Date((0, exports.convertTimestampToMilliseconds)(timestamp));
    return `${date.getUTCDate()}-${date.getUTCMonth() + 1}-${date.getUTCFullYear()}`;
};
exports.getUTCDateFromTimestamp = getUTCDateFromTimestamp;
const tomorrow = () => new classes_1.BigNumberInBase(Math.floor(new Date().valueOf() / 1000) + 3600 * 24);
exports.tomorrow = tomorrow;
const todayInSeconds = () => Math.floor(Date.now() / 1000);
exports.todayInSeconds = todayInSeconds;
const past24Hours = () => new classes_1.BigNumberInBase((0, exports.todayInSeconds)()).minus(exports.SECONDS_IN_A_DAY).toNumber();
exports.past24Hours = past24Hours;
const pastDays = (day = 1) => new classes_1.BigNumberInBase((0, exports.todayInSeconds)())
    .minus(exports.SECONDS_IN_A_DAY.times(day))
    .toNumber();
exports.pastDays = pastDays;
const getEndDateStringFromTimeInSeconds = (timeInSeconds) => {
    const currentDate = new Date(timeInSeconds.toNumber() * 1000);
    return currentDate.toLocaleString('en-us');
};
exports.getEndDateStringFromTimeInSeconds = getEndDateStringFromTimeInSeconds;
//# sourceMappingURL=time.js.map