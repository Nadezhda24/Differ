"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LNode_1 = require("./model/LNode");
var ch = require("cheerio");
var fs = require("fs");
var Difference_1 = require("./model/Difference");
function loadHtml(path) {
    var html = fs.readFileSync(path, 'utf-8');
    return ch.load(html);
}
function htmlTreeToPlainList(documentRoot) {
    var root = documentRoot.root();
    var list = [];
    var htmlTreeToPlainListRec = function (level, node) {
        var _a;
        if (node.type === "tag") {
            var tag = node;
            (_a = tag.childNodes) === null || _a === void 0 ? void 0 : _a.forEach(function (element) {
                list.push(new LNode_1.LNode(level, element));
                htmlTreeToPlainListRec(level + 1, element);
            });
        }
        else {
            list.push(new LNode_1.LNode(level, node));
        }
    };
    root.children().toArray().forEach(function (el) { return htmlTreeToPlainListRec(1, el); });
    return list;
}
function findDifferenceBtwLists(src, dst) {
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
    }
    return diffs;
}
function buildResultListFromDifferences(src, dst, diffs) {
    var result = [];
    diffs.forEach(function (d) {
        //console.log("d" + d._type + " " + d._src?._hash + " " + d._dst?._hash);
        if (d._type === Difference_1.DifferenceType.Added) {
            result.push(d._dst);
        }
        if (d._type === Difference_1.DifferenceType.Deleted) {
            result.push(d._src);
        }
        if (d._type === Difference_1.DifferenceType.Equals) {
            result.push(d._src);
        }
        if (d._type === Difference_1.DifferenceType.Error) {
            console.log("error");
        }
    });
    return result;
}
function buildTreeFromList(list) {
    var doc = loadHtml("testPages/1-src.html");
    doc.root().children();
}
var src = htmlTreeToPlainList(loadHtml("testPages/1-src.html"));
var dst = htmlTreeToPlainList(loadHtml("testPages/1-dst.html"));
//src.forEach((s) => {console.log(s.hash)});
//dst.forEach((s) => {console.log(s.hash)});
var diffs = findDifferenceBtwLists(src, dst);
var result = buildResultListFromDifferences(src, dst, diffs);
//result.forEach((s) => {console.log(s.hash)});
// TODO: build DOM tree from LNode's list
// TODO: write DOM tree to disk
diffs.forEach(function (d) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (d._type === Difference_1.DifferenceType.Added) {
        console.log(" ".repeat((_a = d._dst) === null || _a === void 0 ? void 0 : _a._level) + "Added   hash: " + ((_b = d._dst) === null || _b === void 0 ? void 0 : _b._hash) + " text: " + ((_c = d._dst) === null || _c === void 0 ? void 0 : _c.text));
    }
    if (d._type === Difference_1.DifferenceType.Deleted) {
        console.log(" ".repeat((_d = d._src) === null || _d === void 0 ? void 0 : _d._level) + "Deleted hash: " + ((_e = d._src) === null || _e === void 0 ? void 0 : _e._hash) + " text: " + ((_f = d._src) === null || _f === void 0 ? void 0 : _f.text));
    }
    if (d._type === Difference_1.DifferenceType.Equals) {
        console.log(" ".repeat((_g = d._src) === null || _g === void 0 ? void 0 : _g._level) + "Equals  hash: " + ((_h = d._src) === null || _h === void 0 ? void 0 : _h._hash) + " text: " + ((_j = d._src) === null || _j === void 0 ? void 0 : _j.text));
    }
    if (d._type === Difference_1.DifferenceType.Error) {
        console.log("error");
    }
});
// result.forEach((r) => {
//     console.log(" ".repeat(r._level) + r.text);
// });
