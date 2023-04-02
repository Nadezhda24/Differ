"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNode = void 0;
var md5 = require('md5');
function escapeHtml(str) {
    var lookup = {
        '&': '&amp;',
        '"': '&quot;',
        '\'': '&apos;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return str.replace(/[&"'<>]/g, function (c) { return lookup[c]; });
}
function wrapHtml(str) {
    return "<!DOCTYPE html>\n\t<html lang=\"en\">\n\t\t<head>\n\t\t\t<meta charset=\"UTF-8\">\n\t\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\t\t\t<meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\n\t\t\t<title>HTML Difference</title>\n\t\t\t<style>\n\t\t\t\t.delete { background-color:#FF0000; } \n\t\t\t\t.add { background-color:#00FF00; }\n\t\t\t</style>\n\t\t</head>\n\t\t<body>\n\t\t\t<pre>".concat(str, "</pre>\n\t\t</body>\n\t</html>");
}
var LNode = /** @class */ (function () {
    function LNode(level, node) {
        this._node = node;
        this._level = level;
        var str = "";
        if (this._node.type === "tag") {
            var tag_1 = node;
            var keys = Object.keys(tag_1.attribs);
            str += tag_1.name;
            keys.forEach(function (k) {
                str += k + "=" + tag_1.attribs[k] + "||||";
            });
        }
        if (this._node.type === "comment") {
            var comment = node;
            str += "comment" + comment.data;
        }
        if (this._node.type === "text") {
            var text = node;
            str += "text" + text.data;
        }
        this._hash = md5(str);
        //console.log(str);
        //console.log(this._hash);
    }
    Object.defineProperty(LNode.prototype, "node", {
        get: function () {
            return this._node;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LNode.prototype, "type", {
        get: function () {
            return this._node.type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LNode.prototype, "hash", {
        get: function () {
            return this._hash;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LNode.prototype, "text", {
        get: function () {
            var str = "";
            if (this._node.type === "tag") {
                var tag = this._node;
                str += tag.name;
            }
            if (this._node.type === "comment") {
                var comment = this._node;
                str += "comment" + comment.data;
            }
            if (this._node.type === "text") {
                var text = this._node;
                str += "text" + text.data;
            }
            return str;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LNode.prototype, "wrappedNode", {
        get: function () {
            if (this._node.type === "tag") {
                this._node.childNodes = [];
                //let newNode : cheerio.Element = new TagElement()
            }
            return this._node;
        },
        enumerable: false,
        configurable: true
    });
    LNode.prototype.isEqualTo = function (otherNode) {
        return otherNode._hash == this._hash;
    };
    return LNode;
}());
exports.LNode = LNode;
