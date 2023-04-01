import * as fs from "fs";
import {load} from "cheerio";

const convertHtml = (path) => {
    const content = fs.readFileSync(path, 'utf8');
    return load(content);
}

const convertToRoot = (document) => {
    return document.root();
}



export {convertHtml, convertToRoot}