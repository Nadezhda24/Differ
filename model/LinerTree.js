/**
 * статусы:
 * constant - не измененный
 * changed - изменный
 * add - добавленный
 * delete - удаленный
 */

class LinerTree {
    constructor(node) {
        this._node = node
        this._status = "constant"
    }

    setStatus(value) {
        this._status = value;
    }

    get status() {
        return this._status;
    }

    get node() {
        return this._node;
    }

    compare(linerTree) {
        if (this._node !== linerTree.node) {
            this._status = "changed";
            linerTree.status = "changed";
        }
    }

}

export {LinerTree}