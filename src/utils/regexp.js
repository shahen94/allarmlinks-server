"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caseInsExp = void 0;
exports.caseInsExp = function (value) {
    return new RegExp("^" + value, "i");
};
