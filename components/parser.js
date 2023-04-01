import {convertToRoot} from "./convertHtml.js";
import {LinerTree} from "../model/LinerTree.js";

const parser = (tree) => {
    let linerTreeList = [];
    const rootTree = (node) => {
        node.childNodes.forEach(n => {
            linerTreeList.push(new LinerTree(n))
            if (!!n.childNodes && n.childNodes.length > 0) {
                rootTree(n);
            }
        })
    }

    rootTree(convertToRoot(tree)[0]);

    return linerTreeList;
}

export {parser}