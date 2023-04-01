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

    console.log("change " + change);
    console.log(tree1.length);
    console.log(tree2.length);

    return tree2;
}

export {compere}