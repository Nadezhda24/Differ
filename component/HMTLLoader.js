"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLLoader = void 0;
var ch = require("cheerio");
var fs = require("fs");
var LNode_1 = require("../model/LNode");
var HTMLLoader = /** @class */ (function () {
    function HTMLLoader() {
    }
    HTMLLoader.prototype.loadHtml = function (path) {
        this._path = path;
        var html = fs.readFileSync(path, 'utf-8');
        this._root = ch.load(html);
    };
    HTMLLoader.prototype.getPlainTree = function () {
        var _a;
        var list = [];
        var htmlTreeToPlainListRec = function (level, node) {
            var _a;
            if (node.type === "tag") {
                var tag = node;
                (_a = tag.childNodes) === null || _a === void 0 ? void 0 : _a.forEach(function (element) {
                    list.push(new LNode_1.LNode(level, element));
                    if (element.type === "tag") {
                        htmlTreeToPlainListRec(level + 1, element);
                    }
                });
            }
            else {
                list.push(new LNode_1.LNode(level, node));
            }
        };
        (_a = this._root) === null || _a === void 0 ? void 0 : _a.root().children().toArray().forEach(function (el) { return htmlTreeToPlainListRec(1, el); });
        return list;
    };
    HTMLLoader.prototype.dumpListToFile = function (path) {
        var _a;
        fs.writeFileSync(path, "\n");
        (_a = this._list) === null || _a === void 0 ? void 0 : _a.forEach(function (r) {
            fs.appendFileSync(path, " ".repeat(r.level) + r.content);
        });
    };
    return HTMLLoader;
}());
exports.HTMLLoader = HTMLLoader;
