import { LNode } from "./LNode";

enum DifferenceType {
    Equals,
    Added,
    Deleted,
    Error
}

class Difference 
{
    _src : LNode | null;
    _dst : LNode | null;
    _type : DifferenceType;

    constructor(src : LNode | null, dst : LNode | null) {
        this._src = src;
        this._dst = dst;

        if (src != null && dst != null && src.hash === dst.hash) {
            this._type = DifferenceType.Equals;
        } else if (src == null && dst == null) {
            this._type = DifferenceType.Error;
        } else if (src == null) {
            this._type = DifferenceType.Added;
        } else {
            this._type = DifferenceType.Deleted;
        }
    }
}

export {Difference, DifferenceType};