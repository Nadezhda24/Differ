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
    console.log("loading html1 ...");
    loader.loadHtml(path1);
    var list1 = loader.getPlainTree();
    list1.forEach(function (item) { item.computeHash(args[ArgsKeys.IgnoreClassAtrribute]); });
    console.log("loading html2 ...");
    loader.loadHtml(path2);
    var list2 = loader.getPlainTree();
    list2.forEach(function (item) { item.computeHash(args[ArgsKeys.IgnoreClassAtrribute]); });
    console.log("we are looking for differences ...");
    var differ = new HTMLDiffer_1.HTMLDiffer();
    var differences = differ.buildDifferencesList(list1, list2);
    console.log("saving ...");
    var htmlBuilder = new ResultHTML_1.ResultHTML();
    var html = htmlBuilder.buildHtml(differences);
    var savePath = "./".concat(resultFileName, ".html");
    fs.writeFileSync(savePath, html);
    console.log("saved at: ".concat(savePath));
}
function processInput() {
    var ignoreCaseArg = "--ignoreClassAttribute";
    var usage = "usage: <path/to/src/html> <path/to/dst/html> <resultFileName> [".concat(ignoreCaseArg, "]");
    var args = [];
    if (process.argv.length < 5) {
        console.log(usage);
        args = ["-1"];
    }
    else {
        var path1 = process.argv[2];
        var path2 = process.argv[3];
        var filename = process.argv[4];
        var ignoreCaseArgValue = false;
        if (process.argv.length >= 6 && process.argv[5] === ignoreCaseArg) {
            ignoreCaseArgValue = true;
        }
        if (!fs.existsSync(path1)) {
            console.log("filepath ".concat(path1, " does not exists"));
            args = ["-1"];
        }
        else {
            args.push(path1);
        }
        if (!fs.existsSync(path2)) {
            console.log("filepath ".concat(path2, " does not exists"));
            args = ["-1"];
        }
        else {
            args.push(path2);
        }
        args.push(filename);
        args.push(ignoreCaseArgValue ? "1" : "0");
    }
    return args;
}
var args = processInput();
if (args[0] !== "-1") {
    var additionalArgs = {};
    additionalArgs[ArgsKeys.IgnoreClassAtrribute] = args[3] === "1";
    //main("testPages/1-src.html", "testPages/1-dst.html", "result", additionalArgs);
    main(args[0], args[1], args[2], additionalArgs);
}
