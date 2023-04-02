import {parserToList} from "./components/parser.js";
import {convertToRoot, readToHtmlFile} from "./components/htmlUtils.js";
import {compareTrees, compere} from "./components/compare.js";


const oldPath = "testPages/1-dst.html";
const newPath = "testPages/1-src.html";
const outputPath = "testOutput/output.html";

//вариант с деревьями
const oldTree = readToHtmlFile(oldPath);
const newTree = readToHtmlFile(newPath);
const changes = compareTrees(oldTree, newTree);


console.log(changes);

//вариант со списками
const listTree1 = parserToList(oldTree);
const listTree2 = parserToList(newTree);
const resultDocument = compere(listTree1, listTree2);



//writeToHtmlFile(pathOutput, resultDocument);
