"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DifferenceType = exports.Difference = void 0;
var DifferenceType;
(function (DifferenceType) {
    DifferenceType[DifferenceType["Equals"] = 0] = "Equals";
    DifferenceType[DifferenceType["Added"] = 1] = "Added";
    DifferenceType[DifferenceType["Deleted"] = 2] = "Deleted";
    DifferenceType[DifferenceType["Error"] = 3] = "Error";
})(DifferenceType || (DifferenceType = {}));
exports.DifferenceType = DifferenceType;
var Difference = /** @class */ (function () {
    function Difference(src, dst) {
        this._src = src;
        this._dst = dst;
        if (src != null && dst != null && src.hash === dst.hash) {
            this._type = DifferenceType.Equals;
        }
        else if (src == null && dst == null) {
            this._type = DifferenceType.Error;
        }
        else if (src == null) {
            this._type = DifferenceType.Added;
        }
        else {
            this._type = DifferenceType.Deleted;
        }
    }
    return Difference;
}());
exports.Difference = Difference;
