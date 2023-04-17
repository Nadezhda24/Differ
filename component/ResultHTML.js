"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultHTML = void 0;
var ch = require("cheerio");
var Difference_1 = require("../model/Difference");
var LNode_1 = require("../model/LNode");
var ResultHTML = /** @class */ (function () {
    function ResultHTML() {
    }
    ResultHTML.prototype.docTemplate = function (content) {
        return "<!DOCTYPE html>".concat(content);
    };
    ResultHTML.prototype.makeRootNode = function () {
        var rootNode = new LNode_1.LNode(0, ch.load("").root().children().toArray()[0]);
        rootNode.clearChilds();
        return rootNode;
    };
    ResultHTML.prototype.wrapNode = function (node, type) {
        if (type == Difference_1.DifferenceType.Equals)
            return node;
        var colorMap = {};
        colorMap[Difference_1.DifferenceType.Added] = "#9FE89FFF";
        colorMap[Difference_1.DifferenceType.Deleted] = "#EA8888FF";
        var wrapDiv = ch.load("<div style=\"background-color:".concat(colorMap[type], "\"></div>")).root().children().toArray()[0];
        wrapDiv = wrapDiv.children[1];
        wrapDiv = wrapDiv.children[0];
        var wrapNode = new LNode_1.LNode(node.level, wrapDiv);
        wrapNode.appendChild(node);
        return wrapNode;
    };
    ResultHTML.prototype.buildHtml = function (differences) {
        var _this = this;
        var content = "";
        var root = this.makeRootNode();
        differences.forEach(function (element) {
            element.node.clearChilds();
            var lastNode = root;
            for (var i = 1; i < element.node.level; i++) {
                if (lastNode.children.at(-1))
                    lastNode = lastNode.children.at(-1);
                else
                    break;
            }
            lastNode.appendChild(_this.wrapNode(element.node, element.type));
        });
        return this.docTemplate(root.html);
    };
    return ResultHTML;
}());
exports.ResultHTML = ResultHTML;
