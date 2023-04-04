import * as ch from 'cheerio';
import * as fs from "fs";

import { LNode } from "../model/LNode";


class HTMLLoader {
    _path : string
    _root : cheerio.Root | null
    _list : LNode[] | null

    loadHtml(path : string) {
        this._path = path;
        let html: string = fs.readFileSync(path, 'utf-8');
        this._root = ch.load(html);
    }

    getPlainTree() : LNode[] {
        let list : LNode[] = [];

        const htmlTreeToPlainListRec = (level: number, node : cheerio.Element) => {
            if (node.type === "tag") {
                let tag : cheerio.TagElement = node;

                tag.childNodes?.forEach((element : cheerio.Element) => {
                    list.push(new LNode(level, element));
                    
                    if (element.type === "tag") {
                        htmlTreeToPlainListRec(level + 1, element);
                    }
                });
            } 
            else {
                list.push(new LNode(level, node));
            }
        }
        
        this._root?.root().children().toArray().forEach(el => htmlTreeToPlainListRec(1, el));

        this._list = list;

        return list;
    }

    dumpListToFile(path : string) {
        fs.writeFileSync(path, "\n");
    
        this._list?.forEach((r) => {
            fs.appendFileSync(path, " ".repeat(r.level) + r.content + '\n')
        })

        this._list?.forEach((r) => {
            fs.appendFileSync(path, r.hash + "\n");
        })
    }
}

export {HTMLLoader}