import { Board } from "./board";
import { Moves } from "./moves";

export class Node {
    board:         Board;
    depth:         number;
    visited:       boolean;
    node_index:    number;
    direction:     Moves;
    previous_node: number;
    path_cost:     number;
    total:         number;

    constructor(
        board        : Board,
        depth        : number  = 0,
        visited      : boolean = false,
        node_index   : number  = 0,
        direction    : Moves   = new Moves(),
        previous_node: number  = 0,
        path_cost    : number  = 0,
        total        : number  = 0,
        ) {

        this.board         = board;
        this.depth         = depth;
        this.visited       = visited;
        this.node_index    = node_index;
        this.direction     = direction;
        this.previous_node = previous_node;
        this.path_cost     = path_cost;
        this.total         = total;
    }
}
