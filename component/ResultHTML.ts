import * as ch from "cheerio";
import { Difference, DifferenceType } from "../model/Difference";
import { LNode } from "../model/LNode";

class ResultHTML {
    docTemplate(content: string) : string {
        return `<!DOCTYPE html>${content}`
    }

    makeRootNode(): LNode {
        let rootNode = new LNode(0, ch.load("").root().children().toArray()[0]);
        rootNode.clearChilds();

        return rootNode;
    }

    wrapNode(node: LNode, type: DifferenceType) : LNode {
        if (type == DifferenceType.Equals)
            return node;

        let colorMap = {};
        colorMap[DifferenceType.Added] = "#9FE89FFF";
        colorMap[DifferenceType.Deleted] = "#EA8888FF";

        let wrapDiv = ch.load(`<div style="background-color:${colorMap[type]}"></div>`).root().children().toArray()[0] as cheerio.TagElement;
        wrapDiv = wrapDiv.children[1] as cheerio.TagElement;
        wrapDiv = wrapDiv.children[0] as cheerio.TagElement;

        let wrapNode = new LNode(node.level, wrapDiv);
        wrapNode.appendChild(node);

        return wrapNode;
    }

    buildHtml(differences: Difference[]) : string {
        let content: string = "";

        let root = this.makeRootNode();

        differences.forEach(element => {
            element.node.clearChilds();
            let lastNode = root;

            for (let i = 1; i < element.node.level; i++) {
                if (lastNode.children.at(-1))
                    lastNode = lastNode.children.at(-1);
                else
                    break;
            }

            lastNode.appendChild(this.wrapNode(element.node, element.type));
        });

        return this.docTemplate(root.html);
    }
}

export {ResultHTML}