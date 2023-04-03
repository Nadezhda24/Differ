"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNode = void 0;
var ch = require("cheerio");
var md5 = require('md5');
var LNode = /** @class */ (function () {
    function LNode(level, node) {
        this._node = node;
        this._level = level;
        this._hash = "";
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
    Object.defineProperty(LNode.prototype, "level", {
        get: function () {
            return this._level;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LNode.prototype, "content", {
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
                str += "textelement" + text.data;
            }
            return str.replace(/\\n/g, '');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LNode.prototype, "html", {
        get: function () {
            var doc = ch.load("");
            this.clearChilds();
            doc.root().children().replaceWith(this._node);
            return doc.html();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LNode.prototype, "escapedHtml", {
        get: function () {
            var lookup = {
                '&': '&amp;',
                '"': '&quot;',
                '\'': '&apos;',
                '<': '&lt;',
                '>': '&gt;'
            };
            return this.html.replace(/[&"'<>]/g, function (c) { return lookup[c]; });
        },
        enumerable: false,
        configurable: true
    });
    LNode.prototype.computeHash = function (ignoreClassAttribute) {
        var str = "";
        if (this._node.type === "tag") {
            var tag_1 = this._node;
            var keys = Object.keys(tag_1.attribs);
            str += tag_1.name;
            keys.forEach(function (k) {
                if (!(ignoreClassAttribute && k === "class")) {
                    str += k + "=" + tag_1.attribs[k] + "||||";
                }
            });
            str += tag_1.data;
        }
        if (this._node.type === "comment") {
            var comment = this._node;
            str += "comment" + comment.data;
        }
        if (this._node.type === "text") {
            var text = this._node;
            str += "text" + text.data;
        }
        this._hash = md5(str);
        //console.log(str);
        //console.log(this._hash);
        return this._hash;
    };
    LNode.prototype.isEqualTo = function (otherNode) {
        return otherNode._hash == this._hash;
    };
    LNode.prototype.clearChilds = function () {
        if (this._node.type === "tag") {
            this._node.childNodes = [];
        }
    };
    return LNode;
}());
exports.LNode = LNode;
