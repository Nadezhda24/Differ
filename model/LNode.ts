import * as ch from "cheerio";
var md5 = require('md5');

class LNode {
    _node : cheerio.Element
    _hash : string
    _level : number
    _children : LNode[]

    constructor(level: number, node : cheerio.Element) {
        this._node = node
        this._level = level
        this._hash = ""
        this._children = [];
    }

    get node() {
        return this._node
    }

    get type() {
        return this._node.type;
    }

    get hash() {
        return this._hash;
    }

    get level() {
        return this._level;
    }

    get children() {
        return this._children;
    }

    get content() {
        let str : string = "";
        if (this._node.type === "tag") {
            let tag: cheerio.TagElement = this._node as cheerio.TagElement;
            
            str += tag.name;
        }
    
        if (this._node.type === "comment") {
            let comment: cheerio.CommentElement = this._node as cheerio.CommentElement;

            str += "comment" + comment.data;
        }

        if (this._node.type === "text") {
            let text: cheerio.TextElement = this._node as cheerio.TextElement;

            str += "textelement" + text.data;
        }

        return str.replace(/\\n/g, '');
    }

    get html() : string {
        let doc = ch.load("");

        doc.root().children().replaceWith(this._node);
        return doc.html();
    }

    computeHash(ignoreAttributes : boolean, ignoreClassAttribute : boolean) : string {
        let str: string = ""

        if (this._node.type === "tag") {
            let tag: cheerio.TagElement = this._node as cheerio.TagElement;
            let keys: string[] = Object.keys(tag.attribs);

            str += tag.name;

            if (!ignoreAttributes) {
                keys.forEach((k) => {
                    if (!(ignoreClassAttribute && k === "class")) {
                        str += k + "=" + tag.attribs[k] + "||||";
                    }
                });
            }

            str += tag.data;
        }
    
        if (this._node.type === "comment") {
            let comment: cheerio.CommentElement = this._node as cheerio.CommentElement;

            str += "comment" + comment.data;
        }

        if (this._node.type === "text") {
            let text: cheerio.TextElement = this._node as cheerio.TextElement;

            str += "text" + text.data;
        }

        this._hash = md5(str) as string;

        return this._hash;
    }

    isEqualTo(otherNode : LNode) : boolean {
        return otherNode._hash === this._hash;
    }

    clearChilds() {
        if (this._node.type === "tag") {
            (this._node as cheerio.TagElement).childNodes = [];
        }
    }

    appendChild(childNode : LNode) {
        if (childNode._level <= this._level) {
            childNode._level = this._level + 1;
        }

        this._children.push(childNode);

        if (this._node.type === "tag") {
            (this._node as cheerio.TagElement).childNodes.push(childNode.node);
        }
    }
}

export {LNode}