"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var ResultHTML_1 = require("./component/ResultHTML");
var HTMLLoader_1 = require("./component/HTMLLoader");
var HTMLDiffer_1 = require("./component/HTMLDiffer");
var ArgsKeys;
(function (ArgsKeys) {
    ArgsKeys[ArgsKeys["IgnoreAttributes"] = 0] = "IgnoreAttributes";
    ArgsKeys[ArgsKeys["IgnoreClassAtrribute"] = 1] = "IgnoreClassAtrribute";
})(ArgsKeys || (ArgsKeys = {}));
function main(path1, path2, resultFileName, args) {
    var loader = new HTMLLoader_1.HTMLLoader();
    console.log("loading html1 ...");
    loader.loadHtml(path1);
    var list1 = loader.getPlainTree();
    list1.forEach(function (item) { item.computeHash(args[ArgsKeys.IgnoreAttributes], args[ArgsKeys.IgnoreClassAtrribute]); });
    console.log("loading html2 ...");
    loader.loadHtml(path2);
    var list2 = loader.getPlainTree();
    list2.forEach(function (item) { item.computeHash(args[ArgsKeys.IgnoreAttributes], args[ArgsKeys.IgnoreClassAtrribute]); });
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
    var ignoreAttributesArg = "--ignoreAttributes";
    var ignoreClassAttributeArg = "--ignoreClassAttribute";
    var usage = "usage: <source file> <destination file> <result file> [".concat(ignoreAttributesArg, ", ").concat(ignoreClassAttributeArg, "]");
    var args = [];
    if (process.argv.length < 5) {
        console.log(usage);
        args = ["-1"];
    }
    else {
        var srcPath = process.argv[2];
        var dstPath = process.argv[3];
        var resultPath = process.argv[4];
        var ignoreAttributesArgValue = false;
        var ignoreClassAttributeArgValue = false;
        if (process.argv.length >= 6) {
            for (var i = 5; i < process.argv.length; i++) {
                if (process.argv[i] === ignoreAttributesArg)
                    ignoreAttributesArgValue = true;
                else if (process.argv[i] === ignoreClassAttributeArg)
                    ignoreClassAttributeArgValue = true;
            }
        }
        if (!fs.existsSync(srcPath)) {
            console.log("filepath ".concat(srcPath, " does not exists"));
            args = ["-1"];
        }
        else {
            args.push(srcPath);
        }
        if (!fs.existsSync(dstPath)) {
            console.log("filepath ".concat(dstPath, " does not exists"));
            args = ["-1"];
        }
        else {
            args.push(dstPath);
        }
        args.push(resultPath);
        args.push(ignoreAttributesArgValue ? "1" : "0");
        args.push(ignoreClassAttributeArgValue ? "1" : "0");
    }
    return args;
}
var args = processInput();
if (args[0] !== "-1") {
    var additionalArgs = {};
    additionalArgs[ArgsKeys.IgnoreAttributes] = args[3] === "1";
    additionalArgs[ArgsKeys.IgnoreClassAtrribute] = args[4] === "1";
    main(args[0], args[1], args[2], additionalArgs);
}
