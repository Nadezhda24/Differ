import {parser} from "./components/parser.js";
import {writeToHtmlFile} from "./components/convertHtml.js";
import {compere} from "./components/compare.js";

const path1 = "testPages/1-dst.html";
const path2 = "testPages/1-src.html";
const pathOutput = "testOutput/output.html";


const tree1 = parser(path1);
const tree2 = parser(path2);
const resultDocument = compere(tree1, tree2);

let change = 0;
tree2.forEach((item, index) => {
   item.compare(tree1[index]);
   if (item.status === "changed") change++;
})

//writeToHtmlFile(pathOutput, resultDocument);
console.log("change " + change);
console.log(tree1.length);
console.log(tree2[343]);
console.log(tree1.length);