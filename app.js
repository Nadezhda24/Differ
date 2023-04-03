"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LNode_1 = require("./model/LNode");
var ch = require("cheerio");
var fs = require("fs");
var Difference_1 = require("./model/Difference");
var ResultHTML_1 = require("./component/ResultHTML");
function loadHtml(path) {
    var html = fs.readFileSync(path, 'utf-8');
    return ch.load(html);
}
function writeHtml(path, html) {
    fs.writeFileSync(path, html);
}
function writeLnodesToFile(path, list) {
    fs.writeFileSync(path, "\n");
    list.forEach(function (r) {
        fs.appendFileSync(path, " ".repeat(r.level) + r.content);
    });
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
function buildResultListFromDifferences(diffs) {
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
    var doc = ch.load("<div ></div>");
    var roots = [];
    for (var i = 0; i < list.length; ++i) {
        if (list[i].level == 1) {
            roots.push(list[i].node);
        }
    }
    roots.forEach(function (r) { r.childNodes = []; });
    list.forEach(function (r) {
        console.log(r.html);
    });
    doc.root().children().children().replaceWith(roots);
    //console.log("c" + doc.html());
    return doc;
}
var src = htmlTreeToPlainList(loadHtml("testPages/1-src.html"));
var dst = htmlTreeToPlainList(loadHtml("testPages/1-dst.html"));
writeLnodesToFile("outPages/src.out", src);
writeLnodesToFile("outPages/dst.out", dst);
var diffs = findDifferenceBtwLists(src, dst);
var htmlBuilder = new ResultHTML_1.ResultHTML();
writeHtml("outPages/result.html", htmlBuilder.buildHtml(diffs));
// TODO: build DOM tree from LNode's list
// TODO: write DOM tree to disk
// diffs.forEach((d : Difference) => {
//     if (d._type === DifferenceType.Added) {
//         console.log(" ".repeat(d._dst?._level as number) + "Added   hash: " + d._dst?._hash + " text: " + d._dst?.text);
//     }
//     if (d._type === DifferenceType.Deleted) {
//         console.log(" ".repeat(d._src?._level as number) + "Deleted hash: " + d._src?._hash + " text: " + d._src?.text);
//     }
//     if (d._type === DifferenceType.Equals) {
//         console.log(" ".repeat(d._src?._level as number) + "Equals  hash: " + d._src?._hash + " text: " + d._src?.text);
//     }
//     if (d._type === DifferenceType.Error) {
//         console.log("error");
//     }
// });
