import * as fs from "fs";
import {load} from "cheerio";

/**
 * Получение данных из файла
 * @param path - путь для загрузки данных
 */
const readToHtmlFile = (path) => {
    const content = fs.readFileSync(path, 'utf8');
    return load(content);
}
/**
 * Запись данных в файл
 * @param pathOutput - путь до файла сохранения (если его не существует, то файл будет создан по этому пути)
 * @param document -  данные, для сохранеия
 */
const writeToHtmlFile = (pathOutput, document) => {
    fs.writeFileSync(pathOutput, document.root().html(), 'utf8');
}

/**
 * Конвертация в дерево
 * @param document - данные, которые необходимо вывести в виде дерева
 */
const convertToRoot = (document) => {
    return document.root();
}
/**
 * Конвертация в HTML
 * @param document - данные, которые необходимо вывести в HTML
 */
const convertToHtml = (document) => {
    return document.root().html();
}

/**
 * Добавление элемента для выделения изменений
 * @param node - узел, который необходимо обернуть в элемент
 * @param element - элемент (<div>), в который оборачивается узел
 */
const addElement = (node, element) => {

}

export {readToHtmlFile, convertToRoot, convertToHtml, writeToHtmlFile}