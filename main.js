import {parserToList} from "./components/parser.js";
import {readToHtmlFile} from "./components/htmlUtils.js";
import {compere} from "./components/compare.js";

const path1 = "testPages/1-dst.html";
const path2 = "testPages/1-src.html";
const pathOutput = "testOutput/output.html";


const tree1 = readToHtmlFile(path1);
const tree2 = readToHtmlFile(path2);
//если нужны списки
const listTree1 = parserToList(tree1);
const listTree2 = parserToList(tree2);



const resultDocument = compere(listTree1, listTree2);

//writeToHtmlFile(pathOutput, resultDocument);
