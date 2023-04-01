import {parser} from "./components/parser.js";

const path1 = "testPages/1-dst.html";
const path2 = "testPages/1-src.html";
const linerTreeList1 = parser(path1);
const linerTreeList2 = parser(path2);

console.log(linerTreeList1.length);
console.log(linerTreeList2.length);