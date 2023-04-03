import * as ch from "cheerio";
var md5 = require('md5');

function escapeHtml(str) {
	let lookup = {
		'&': '&amp;',
		'"': '&quot;',
		'\'': '&apos;',
		'<': '&lt;',
		'>': '&gt;'
	};
	return str.replace(/[&"'<>]/g, c => lookup[c]);
}

function wrapHtml(str) {
	return `<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="X-UA-Compatible" content="ie=edge">
			<title>HTML Difference</title>
			<style>
				.delete { background-color:#FF0000; } 
				.add { background-color:#00FF00; }
			</style>
		</head>
		<body>
			<pre>${str}</pre>
		</body>
	</html>`
}

class LNode {
    _node : cheerio.Element
    _hash : string
    _level : number

    constructor(level: number, node : cheerio.Element) {
        this._node = node
        this._level = level
        let str: string = ""

        if (this._node.type === "tag") {
            let tag: cheerio.TagElement = node as cheerio.TagElement;
            let keys: string[] = Object.keys(tag.attribs);

            str += tag.name;
            keys.forEach((k) => {
                str += k + "=" + tag.attribs[k] + "||||";
            });
        }
    
        if (this._node.type === "comment") {
            let comment: cheerio.CommentElement = node as cheerio.CommentElement;

            str += "comment" + comment.data;
        }

        if (this._node.type === "text") {
            let text: cheerio.TextElement = node as cheerio.TextElement;

            str += "text" + text.data;
        }

        this._hash = md5(str) as string;
        //console.log(str);
        //console.log(this._hash);
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

    get wrappedNode() : cheerio.Element {
        if (this._node.type === "tag") {
            this._node.childNodes = [];
            //let newNode : cheerio.Element = new TagElement()
        }

        return this._node;
    }

    isEqualTo(otherNode : LNode) : boolean {
        return otherNode._hash == this._hash;
    }

}

export {LNode}