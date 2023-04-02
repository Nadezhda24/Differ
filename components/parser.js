import {convertToRoot} from "./htmlUtils.js";
import {LinerTree} from "../model/LinerTree.js";

/**
 * Преобразование дерева в список
 * @param tree -  информация об HTML файле в виде дерева
 * @returns {*[]} - информация об HTML файле в виде списка
 */
const parserToList = (tree) => {
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





export {parserToList}