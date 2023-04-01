import {convertToRoot, convertHtml, convertToHtml} from "./convertHtml.js";
import {LinerTree} from "../model/LinerTree.js";

const parser = (path) => {
    let linerTreeList = [];
    const rootTree = (node) => {
        node.childNodes.forEach(n => {
            linerTreeList.push(new LinerTree(n))
            if (!!n.childNodes && n.childNodes.length > 0) {
                rootTree(n);
            }
        })
    }

    const document = convertHtml(path);

    rootTree(convertToRoot(document)[0]);

    return linerTreeList;
}

export {parser}