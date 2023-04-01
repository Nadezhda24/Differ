import * as fs from "fs";
import {load} from "cheerio";

const convertHtml = (path) => {
    const content = fs.readFileSync(path, 'utf8');
    return load(content);
}

const writeToHtmlFile = (pathOutput, document) => {
    fs.writeFileSync(pathOutput, document.root().html(), 'utf8');
}

const convertToRoot = (document) => {
    return document.root();
}

const convertToHtml = (document) => {
    return document.root().html();
}


export {convertHtml, convertToRoot, convertToHtml, writeToHtmlFile}