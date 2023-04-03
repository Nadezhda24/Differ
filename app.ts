import { LNode } from './model/LNode';

import * as ch from 'cheerio';
import * as fs from "fs";
import { Difference, DifferenceType } from './model/Difference';


function loadHtml(path: string) : cheerio.Root {
    let html: string = fs.readFileSync(path, 'utf-8');
    return ch.load(html);
}

function writeLnodesToFile(path: string, list: LNode[]) {
    fs.writeFileSync(path, "\n");
    
    list.forEach((r) => {
        fs.appendFileSync(path, " ".repeat(r.level) + r.content)
    })
}

function htmlTreeToPlainList(documentRoot: cheerio.Root) : LNode[] {

    let root : cheerio.Cheerio = documentRoot.root();
    
    let list : LNode[] = [];

    const htmlTreeToPlainListRec = (level: number, node : cheerio.Element) => {
        if (node.type === "tag") {
            let tag : cheerio.TagElement = node;
            tag.childNodes?.forEach((element : cheerio.Element) => {
                list.push(new LNode(level, element));
                htmlTreeToPlainListRec(level + 1, element);
            });
        } 
        else {
            list.push(new LNode(level, node));
        }
    }
    
    root.children().toArray().forEach(el => htmlTreeToPlainListRec(1, el));

    return list;
}

function findDifferenceBtwLists(src: LNode[], dst: LNode[]) {
    let diffs: Difference[] = [];

    let existancePositions: number[] = Array(src.length).fill(0);

    // find differences positions

    for (let i : number = src.length - 1; i >= 0; --i) {
        let exists : boolean = false;

        let startPos : number = dst.length;
        let oldStartPos : number = dst.length;

        for (let x : number = i + 1; x < src.length; ++x) {
            if (existancePositions[x] !== -1) {
                startPos = existancePositions[x];
                break;
            }
        }

        for (let x : number = i + 2; x < src.length; ++x) {
            if (existancePositions[x] !== -1) {
                oldStartPos = existancePositions[x];
                break;
            }
        }

        if (oldStartPos - startPos > 1) {
            for (let j : number = oldStartPos - 1; j > startPos && !exists; --j) {
                if (src[i].isEqualTo(dst[j])) {
                    exists = true;
                    existancePositions[i] = j;
                    existancePositions[i + 1] = -1;
                }
            }
        }

        for (let j : number = startPos - 1; j >= 0 && !exists; --j) {
            if (src[i].isEqualTo(dst[j])) {
                exists = true;
                existancePositions[i] = j;
            }
        }

        if (!exists) {
            existancePositions[i] = -1;
        }
    }

    // build differences list

    let lastNotDeletedItemPos : number = 0;

    for (let i : number = 0; i < existancePositions.length; ++i) {
        if (existancePositions[i] !== -1) {
            // track added items
            if (existancePositions[i] - lastNotDeletedItemPos > 1) {
                for (let j : number = lastNotDeletedItemPos + 1; j < existancePositions[i]; ++j) {
                    diffs.push(new Difference(null, dst[j]));
                }
            }

            lastNotDeletedItemPos = existancePositions[i];

            // track not changed items

            diffs.push(new Difference(src[i], dst[existancePositions[i]]));
        } else {
            // track deleted items
            diffs.push(new Difference(src[i], null));
        }
    }

    return diffs;
}

function buildResultListFromDifferences(diffs: Difference[]) : LNode[] {
    let result : LNode[] = [];
    
    diffs.forEach(d => {
        //console.log("d" + d._type + " " + d._src?._hash + " " + d._dst?._hash);
        if (d._type === DifferenceType.Added) {
            result.push(d._dst as LNode);
        }
        if (d._type === DifferenceType.Deleted) {
            result.push(d._src as LNode);
        }
        if (d._type === DifferenceType.Equals) {
            result.push(d._src as LNode);
        }
        if (d._type === DifferenceType.Error) {
            console.log("error");
        }
    })

    return result;
}

function buildTreeFromList(list : LNode[]) {

    let doc : cheerio.Root = loadHtml("testPages/1-src.html");

    doc.root().children();
}

let src : LNode[] = htmlTreeToPlainList(loadHtml("testPages/simple_src.html"));
let dst : LNode[] = htmlTreeToPlainList(loadHtml("testPages/simple_dst.html"));

writeLnodesToFile("outPages/src.out", src);
writeLnodesToFile("outPages/dst.out", dst);

let diffs : Difference[] = findDifferenceBtwLists(src, dst);

let result = buildResultListFromDifferences(diffs);

writeLnodesToFile("outPages/result.out", result);

// TODO: build DOM tree from LNode's list
// TODO: write DOM tree to disk

// diffs.forEach((d : Difference) => {
//     if (d._type === DifferenceType.Added) {
//         console.log(" ".repeat(d._dst?._level as number) + "Added   hash: " + d._dst?._hash + " text: " + d._dst?.text);
//     }
//     if (d._type === DifferenceType.Deleted) {
//         console.log(" ".repeat(d._src?._level as number) + "Deleted hash: " + d._src?._hash + " text: " + d._src?.text);
//     }
//     if (d._type === DifferenceType.Equals) {
//         console.log(" ".repeat(d._src?._level as number) + "Equals  hash: " + d._src?._hash + " text: " + d._src?.text);
//     }
//     if (d._type === DifferenceType.Error) {
//         console.log("error");
//     }
// });