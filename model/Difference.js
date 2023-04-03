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
    Object.defineProperty(Difference.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Difference.prototype, "node", {
        get: function () {
            if (this._type === DifferenceType.Added) {
                return this._dst;
            }
            else if (this._type === DifferenceType.Deleted) {
                return this._src;
            }
            else if (this._type === DifferenceType.Equals) {
                return this._src;
            }
            else {
                return null;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Difference.prototype, "content", {
        get: function () {
            var _a, _b, _c, _d, _e, _f;
            if (this._type === DifferenceType.Added) {
                return "Added  hash: " + ((_a = this.node) === null || _a === void 0 ? void 0 : _a.hash) + " content: " + ((_b = this.node) === null || _b === void 0 ? void 0 : _b.content);
            }
            else if (this._type === DifferenceType.Deleted) {
                return "Deleted  hash: " + ((_c = this.node) === null || _c === void 0 ? void 0 : _c.hash) + " content: " + ((_d = this.node) === null || _d === void 0 ? void 0 : _d.content);
            }
            else if (this._type === DifferenceType.Equals) {
                return "Equals  hash: " + ((_e = this.node) === null || _e === void 0 ? void 0 : _e.hash) + " content: " + ((_f = this.node) === null || _f === void 0 ? void 0 : _f.content);
            }
            else {
                return "Null";
            }
        },
        enumerable: false,
        configurable: true
    });
    return Difference;
}());
exports.Difference = Difference;
