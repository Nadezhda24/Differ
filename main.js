import {parser} from "./components/parser.js";
import {convertHtml} from "./components/convertHtml.js";
import {compere} from "./components/compare.js";

const path1 = "testPages/1-dst.html";
const path2 = "testPages/1-src.html";
const pathOutput = "testOutput/output.html";


const tree1 = convertHtml(path1);
const tree2 = convertHtml(path2);
//если нужны списки
const listTree1 = parser(tree1);
const listTree2 = parser(tree2);

const resultDocument = compere(listTree1, listTree2);



//writeToHtmlFile(pathOutput, resultDocument);
