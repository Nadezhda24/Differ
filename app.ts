import * as fs from "fs";

import { ResultHTML } from './component/ResultHTML';
import { HTMLLoader } from './component/HMTLLoader';
import { HTMLDiffer } from './component/HTMLDiffer';

enum ArgsKeys {
    IgnoreClassAtrribute,
}

function main(path1 : string, path2 : string, resultFileName : string, args : object) {
    let loader = new HTMLLoader();

    console.log("loading html1 ...");
    loader.loadHtml(path1);
    let list1 = loader.getPlainTree();
    list1.forEach(item => {item.computeHash(args[ArgsKeys.IgnoreClassAtrribute])})

    console.log("loading html2 ...");
    loader.loadHtml(path2);
    let list2 = loader.getPlainTree();
    list2.forEach(item => {item.computeHash(args[ArgsKeys.IgnoreClassAtrribute])})

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
    let ignoreCaseArg = "--ignoreClassAttribute";
    let usage : string = `usage: <path/to/src/html> <path/to/dst/html> <resultFileName> [${ignoreCaseArg}]`;
    let args : string[] = []

    if (process.argv.length < 5) {
        console.log(usage)
        args = ["-1"]
    }
    else 
    {
        let path1 = process.argv[2];
        let path2 = process.argv[3];
        let filename = process.argv[4];
        let ignoreCaseArgValue : boolean = false;

        if (process.argv.length >= 6 && process.argv[5] === ignoreCaseArg) 
        {
            ignoreCaseArgValue = true;
        }

        if (!fs.existsSync(path1)) 
        {
            console.log(`filepath ${path1} does not exists`);
            args = ["-1"]
        } 
        else 
        {
            args.push(path1);
        }

        if (!fs.existsSync(path2)) 
        {
            console.log(`filepath ${path2} does not exists`);
            args = ["-1"]
        }
        else
        {
            args.push(path2);
        }

        args.push(filename);
        args.push(ignoreCaseArgValue ? "1" : "0");
    }

    return args;
}

let args = processInput();

if (args[0] !== "-1") {
    let additionalArgs = {}

    additionalArgs[ArgsKeys.IgnoreClassAtrribute] = args[3] === "1";

    //main("testPages/1-src.html", "testPages/1-dst.html", "result", additionalArgs);
    main(args[0], args[1], args[2], additionalArgs);
}
