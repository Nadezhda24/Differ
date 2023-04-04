import * as fs from "fs";

import { Difference } from "../model/Difference";
import { LNode } from "../model/LNode";


class HTMLDiffer {
    _differences : Difference[]

    buildDifferencesList(src : LNode[], dst : LNode[]) : Difference[] {
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

            if (i == existancePositions.length - 1)
            {
                for (let j : number = lastNotDeletedItemPos + 1; j < dst.length; ++j)
                {
                    diffs.push(new Difference(null, dst[j]));
                }
            }
        }

        this._differences = diffs;

        return diffs;
    }

    dumpDifferencesList(path : string) {
        fs.writeFileSync(path, "\n");
    
        this._differences?.forEach((d) => {
            fs.appendFileSync(path, " ".repeat(d.node?.level as number) + d.content + "\n")
        });
    }
}

export {HTMLDiffer}