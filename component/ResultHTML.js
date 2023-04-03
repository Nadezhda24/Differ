"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultHTML = void 0;
var Difference_1 = require("../model/Difference");
var ResultHTML = /** @class */ (function () {
    function ResultHTML() {
    }
    ResultHTML.prototype.docTemplate = function (content) {
        return "<!DOCTYPE html>\n                <html lang=\"en\">\n                    <head>\n                        <meta charset=\"UTF-8\">\n                        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n                        <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\n                        <title>HTML Difference</title>\n                        <style>\n                            .delete { background-color:#FF0000; } \n                            .add { background-color:#00FF00; }\n                            .equal { background-color:#FFFFFF; }\n                        </style>\n                    </head>\n                    <body>\n                        <pre>".concat(content, "</pre>\n                    </body>\n                </html>");
    };
    ResultHTML.prototype.itemTemplate = function (content, type) {
        var styleMap = {};
        styleMap[Difference_1.DifferenceType.Added] = "add";
        styleMap[Difference_1.DifferenceType.Deleted] = "delete";
        styleMap[Difference_1.DifferenceType.Equals] = "equal";
        return "<span class=".concat(styleMap[type], ">").concat(content, "</span></br>");
    };
    ResultHTML.prototype.buildHtml = function (differences) {
        var _this = this;
        var content = "";
        differences.forEach(function (element) {
            var _a;
            content += _this.itemTemplate((_a = element.node) === null || _a === void 0 ? void 0 : _a.escapedHtml, element.type);
        });
        return this.docTemplate(content);
    };
    return ResultHTML;
}());
exports.ResultHTML = ResultHTML;
