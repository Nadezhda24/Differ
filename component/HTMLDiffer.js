"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLDiffer = void 0;
var fs = require("fs");
var Difference_1 = require("../model/Difference");
var HTMLDiffer = /** @class */ (function () {
    function HTMLDiffer() {
    }
    HTMLDiffer.prototype.buildDifferencesList = function (src, dst) {
        var diffs = [];
        var existancePositions = Array(src.length).fill(0);
        // find differences positions
        for (var i = src.length - 1; i >= 0; --i) {
            var exists = false;
            var startPos = dst.length;
            var oldStartPos = dst.length;
            for (var x = i + 1; x < src.length; ++x) {
                if (existancePositions[x] !== -1) {
                    startPos = existancePositions[x];
                    break;
                }
            }
            for (var x = i + 2; x < src.length; ++x) {
                if (existancePositions[x] !== -1) {
                    oldStartPos = existancePositions[x];
                    break;
                }
            }
            if (oldStartPos - startPos > 1) {
                for (var j = oldStartPos - 1; j > startPos && !exists; --j) {
                    if (src[i].isEqualTo(dst[j])) {
                        exists = true;
                        existancePositions[i] = j;
                        existancePositions[i + 1] = -1;
                    }
                }
            }
            for (var j = startPos - 1; j >= 0 && !exists; --j) {
                if (src[i].isEqualTo(dst[j])) {
                    exists = true;
                    existancePositions[i] = j;
                }
            }
            if (!exists) {
                existancePositions[i] = -1;
            }
        }
        // build differences list
        var lastNotDeletedItemPos = 0;
        for (var i = 0; i < existancePositions.length; ++i) {
            if (existancePositions[i] !== -1) {
                // track added items
                if (existancePositions[i] - lastNotDeletedItemPos > 1) {
                    for (var j = lastNotDeletedItemPos + 1; j < existancePositions[i]; ++j) {
                        diffs.push(new Difference_1.Difference(null, dst[j]));
                    }
                }
                lastNotDeletedItemPos = existancePositions[i];
                // track not changed items
                diffs.push(new Difference_1.Difference(src[i], dst[existancePositions[i]]));
            }
            else {
                // track deleted items
                diffs.push(new Difference_1.Difference(src[i], null));
            }
            if (i == existancePositions.length - 1) {
                for (var j = lastNotDeletedItemPos + 1; j < dst.length; ++j) {
                    diffs.push(new Difference_1.Difference(null, dst[j]));
                }
            }
        }
        this._differences = diffs;
        return diffs;
    };
    HTMLDiffer.prototype.dumpDifferencesList = function (path) {
        var _a;
        fs.writeFileSync(path, "\n");
        (_a = this._differences) === null || _a === void 0 ? void 0 : _a.forEach(function (d) {
            var _a;
            fs.appendFileSync(path, " ".repeat((_a = d.node) === null || _a === void 0 ? void 0 : _a.level) + d.content + "\n");
        });
    };
    return HTMLDiffer;
}());
exports.HTMLDiffer = HTMLDiffer;
