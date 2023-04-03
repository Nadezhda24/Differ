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

    get type() : DifferenceType {
        return this._type;
    }

    get node() : LNode | null {
        if (this._type === DifferenceType.Added) {
            return this._dst;
        } else if (this._type === DifferenceType.Deleted) {
            return this._src;
        } else if (this._type === DifferenceType.Equals) {
            return this._src;
        } else {
            return null;
        }
    }

    get content() : string {
        if (this._type === DifferenceType.Added) {
            return "Added  hash: " + this.node?.hash + " content: " + this.node?.content;
        } else if (this._type === DifferenceType.Deleted) {
            return "Deleted  hash: " + this.node?.hash + " content: " + this.node?.content;
        } else if (this._type === DifferenceType.Equals) {
            return "Equals  hash: " + this.node?.hash + " content: " + this.node?.content;
        } else {
            return "Null";
        }
    }
}

export {Difference, DifferenceType};