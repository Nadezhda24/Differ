import {addElement} from "./htmlUtils.js";

/**
 * Сравнение информации о двух HTML файлах
 * @param tree1 - информация о первом HTML файле
 * @param tree2 - информация о втором HTML файле
 * @returns {*} - результат сравления
 */
const compere = (tree1, tree2) => {
    let change = 0;
    tree1.forEach((item, index) => {
        item.compare(tree2[index]);
        if (item.status === "changed") {
            change++;
        }
    })

  //  console.log("change " + change);
  //  console.log(tree1.length);
  //  console.log(tree2.length);

    return tree2;
}

const compareTrees = (oldTree, newTree) => {
    const result = {
        addedNodes: [],
        deletedNodes: [],
        changedNodes: [],
        unchangedNodes: []
    };

    function dfs(node1, node2) {
        if (!node1 && !node2) {
            return;
        }

        if (!node1) {
            result.addedNodes.push(node2);
            return;
        }

        if (!node2) {
            result.deletedNodes.push(node1);
            return;
        }

        if (node1.name !== node2.name || node1.children.length !== node2.children.length) {
            result.changedNodes.push({
                oldNode: node1,
                newNode: node2
            });
            return;
        }

        const children1 = node1.children;
        const children2 = node2.children;

        for (let i = 0; i < children1.length; i++) {
            dfs(children1[i], children2[i]);
        }
    }


    dfs(oldTree.root(), newTree.root());

    return result;
}



export {compere, compareTrees}

