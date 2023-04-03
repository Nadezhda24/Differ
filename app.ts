import * as fs from "fs";

import { ResultHTML } from './component/ResultHTML';
import { HTMLLoader } from './component/HMTLLoader';
import { HTMLDiffer } from './component/HTMLDiffer';

enum ArgsKeys {
    IgnoreClassAtrribute,
}

function main(path1 : string, path2 : string, resultFileName : string, args : object) {
    let loader = new HTMLLoader();

    loader.loadHtml(path1);
    let list1 = loader.getPlainTree();

    loader.loadHtml(path2);
    let list2 = loader.getPlainTree();

    let differ = new HTMLDiffer();
    let differences = differ.buildDifferencesList(list1, list2);

    let htmlBuilder = new ResultHTML();
    let html = htmlBuilder.buildHtml(differences);

    fs.writeFileSync(`./${resultFileName}.html`, html);
}

main("testPages/1-src.html", "testPages/1-dst.html", "result", {});
