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
        if (!!this._node && !!linerTree && !!linerTree.node ) {
            if (this._node.type !== "text" && this._node.name !== linerTree.node.name){
                this._status = "changed";
                linerTree.setStatus("changed");
            }
            if (this._node.type === "text" && this._node.data !== linerTree.node.data){
                this._status = "changed";
                linerTree.setStatus("changed");
            }
        }
    }

}

export {LinerTree}