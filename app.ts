import * as fs from "fs";

import { ResultHTML } from './component/ResultHTML';
import { HTMLLoader } from './component/HTMLLoader';
import { HTMLDiffer } from './component/HTMLDiffer';

enum ArgsKeys {
    IgnoreAttributes,
    IgnoreClassAtrribute
}

function main(path1 : string, path2 : string, resultFileName : string, args : object) {
    let loader = new HTMLLoader();

    console.log("loading html1 ...");
    loader.loadHtml(path1);
    let list1 = loader.getPlainTree();
    list1.forEach(item => {item.computeHash(args[ArgsKeys.IgnoreAttributes], args[ArgsKeys.IgnoreClassAtrribute])})

    console.log("loading html2 ...");
    loader.loadHtml(path2);
    let list2 = loader.getPlainTree();
    list2.forEach(item => {item.computeHash(args[ArgsKeys.IgnoreAttributes], args[ArgsKeys.IgnoreClassAtrribute])})

    console.log("we are looking for differences ...");
    let differ = new HTMLDiffer();
    let differences = differ.buildDifferencesList(list1, list2);

    console.log("saving ...");
    let htmlBuilder = new ResultHTML();
    let html = htmlBuilder.buildHtml(differences);

    let savePath = `./${resultFileName}.html`;

    fs.writeFileSync(savePath, html);

    console.log(`saved at: ${savePath}`);
}

function processInput() : string[] {
    let ignoreAttributesArg = "--ignoreAttributes"
    let ignoreClassAttributeArg = "--ignoreClassAttribute";

    let usage : string = `usage: <source file> <destination file> <result file> [${ignoreAttributesArg}, ${ignoreClassAttributeArg}]`;
    let args : string[] = []

    if (process.argv.length < 5) {
        console.log(usage)
        args = ["-1"]
    }
    else 
    {
        let srcPath = process.argv[2];
        let dstPath = process.argv[3];
        let resultPath = process.argv[4];
        
        let ignoreAttributesArgValue : boolean = false;
        let ignoreClassAttributeArgValue : boolean = false;

        if (process.argv.length >= 6) 
        {
            for (let i = 5; i < process.argv.length; i++) {
                if (process.argv[i] === ignoreAttributesArg) ignoreAttributesArgValue = true;
                else if (process.argv[i] === ignoreClassAttributeArg) ignoreClassAttributeArgValue = true;
            }
        }

        if (!fs.existsSync(srcPath)) 
        {
            console.log(`filepath ${srcPath} does not exists`);
            args = ["-1"]
        } 
        else 
        {
            args.push(srcPath);
        }

        if (!fs.existsSync(dstPath)) 
        {
            console.log(`filepath ${dstPath} does not exists`);
            args = ["-1"]
        }
        else
        {
            args.push(dstPath);
        }

        args.push(resultPath);
        args.push(ignoreAttributesArgValue ? "1" : "0");
        args.push(ignoreClassAttributeArgValue ? "1" : "0");
    }

    return args;
}

let args = processInput();

if (args[0] !== "-1") {
    let additionalArgs = {}

    additionalArgs[ArgsKeys.IgnoreAttributes] = args[3] === "1";
    additionalArgs[ArgsKeys.IgnoreClassAtrribute] = args[4] === "1";

    main(args[0], args[1], args[2], additionalArgs);
}
