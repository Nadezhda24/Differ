"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var ResultHTML_1 = require("./component/ResultHTML");
var HMTLLoader_1 = require("./component/HMTLLoader");
var HTMLDiffer_1 = require("./component/HTMLDiffer");
var ArgsKeys;
(function (ArgsKeys) {
    ArgsKeys[ArgsKeys["IgnoreClassAtrribute"] = 0] = "IgnoreClassAtrribute";
})(ArgsKeys || (ArgsKeys = {}));
function main(path1, path2, resultFileName, args) {
    var loader = new HMTLLoader_1.HTMLLoader();
    loader.loadHtml(path1);
    var list1 = loader.getPlainTree();
    loader.loadHtml(path2);
    var list2 = loader.getPlainTree();
    var differ = new HTMLDiffer_1.HTMLDiffer();
    var differences = differ.buildDifferencesList(list1, list2);
    var htmlBuilder = new ResultHTML_1.ResultHTML();
    var html = htmlBuilder.buildHtml(differences);
    fs.writeFileSync("./".concat(resultFileName, ".html"), html);
}
main("testPages/1-src.html", "testPages/1-dst.html", "result", {});
