import * as fs from "fs";
import {load} from "cheerio";


const readHtml = (path , selector = null) => {
    const content = fs.readFileSync(path, 'utf8');
    return load(content)
    }

const convertToRoot = (document) => {
    return document.root()
}


export {readHtml,  convertToRoot}