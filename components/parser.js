import {convertToRoot, readHtml} from "./readHtml.js";

const rootTree = (node) => {
    node.children.forEach(n => {
        console.log(n)
        if (!!n.children && n.children.length > 1) {
            rootTree(n);
        }
    })
}

const parser = (path) => {
    const document = readHtml(path);
    rootTree(convertToRoot(document)[0]);
}

export {parser}