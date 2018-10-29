import { Board } from "./board";
import { Node } from "./node";
import { Moves } from "./moves";

export class Bot {
    nodes: Node[];
    frontier: Node[];
    explored: Set<string>;
    frontierSet: Set<string>;

    constructor() {
        this.nodes = [];
        this.frontier = [];
        this.explored = new Set<string>();
        this.frontierSet = new Set<string>();
    }

    getSolveSequnce(board: Board) {
        if (board.is_complete()) return;
        let goal = this.ast(board);
        if (!goal) {
            console.log("Game not solved by bot!");
            return;
        }
        let moves = this.getMovementDirection(goal);
        return moves;
    }

    getMovementDirection(goalNode: Node) {
        let moves = [];
        let node = goalNode;

        while (true) {
            let previousNode = node.previous_node;
            let direction = node.direction;
            let tempPrev = previousNode;
            moves.push(direction);

            if (previousNode == 0) {
                return moves.reverse();
            }

            node = this.nodes[previousNode];

            if (tempPrev != node.node_index) {
                console.log("Error! \nPrevious: " + tempPrev + " index: " + node.node_index);
                return;
            }
        }
    }

    ast(startState: Board) {
        this.nodes.push(new Node(startState));
        this.frontier.push(new Node(startState));


        let iterCount = 0;
        let maxDepth = 0;
        let index = 1;

        while(this.frontier.length != 0) {
            let i = this.getMinDistanceIndex();
            let node = this.frontier.splice(i, 1)[0];

            this.explored.add(node.board.state);

            // if (index % 200 == 0) {
            //     console.log("Nodes expanded: " + iterCount);
            //     console.log("index: " + index);
            //     console.log("nodes size: " + this.nodes.length);
            //     console.log("forntier size: " + this.frontier.length);
            //     console.log("max depth: " + maxDepth);
            //     console.log("total: " + node.total);
            //     console.log("path cost: " + node.path_cost);
            //     console.log(node);
            // }

            if (node.board.is_complete()) {
                console.log("Nodes expanded: " + iterCount);
                console.log("Search depth: " + node.depth);
                console.log("Max Search Depth: " + maxDepth);
                return node;
            }

            let neighbors = this.getNeighbors(node.board);

            for (let i = 0; i < neighbors.length; ++i) {

                let neighbor: Board  = neighbors[i][0];
                let direction: Moves = neighbors[i][1];
                let neighborIndex = this.getIndexOfState(neighbor);
                let total = this.getManhattenDistance(neighbor) + node.path_cost;

                if (!this.explored.has(neighbor.state) && !this.frontierSet.has(neighbor.state)) {
                    let newNode = new Node(neighbor, node.depth + 1, false,
                        index, direction, node.node_index, node.path_cost + 1, total);

                    this.nodes.push(newNode);
                    this.frontier.push(newNode);
                    this.frontierSet.add(neighbor.state);
                    index += 1;

                    if (this.nodes[this.nodes.length-1].depth > maxDepth) {
                        maxDepth = this.nodes[this.nodes.length-1].depth;
                    }
                } else if (neighborIndex != -1) {

                    if (total < this.frontier[neighborIndex].total) {
                        let previousNodeIndex = this.frontier[neighborIndex].node_index;
                        let newNode = new Node(neighbor, node.depth + 1, false,
                            previousNodeIndex, direction, node.node_index, node.path_cost + 1, total);
                        this.frontier[neighborIndex] = newNode;
                    }
                }
            }
            iterCount += 1;
        }
        return;
    }

    transition(board: Board, zeroIndex: number, i: number): Board {
        let clonedBoard = new Board(board.size, board.state);
        clonedBoard.swapValue(zeroIndex, i);
        return clonedBoard;
    }

    getNeighbors(board: Board) {
        let neighbors = [];
        let moves = board.moves;
        let zeroIndex = board.getZeroTileIndex();

        if (moves.up) {
            let i = zeroIndex - board.size;
            let move = new Moves();
            move.up = true;
            let neighbor = [this.transition(board, zeroIndex, i), move];
            neighbors.push(neighbor);
        }
        if (moves.down) {
            let i = zeroIndex + board.size;
            let move = new Moves();
            move.down = true;
            let neighbor = [this.transition(board, zeroIndex, i), move];
            neighbors.push(neighbor);
        }
        if (moves.right) {
            let i = zeroIndex + 1;
            let move = new Moves();
            move.right = true;
            let neighbor = [this.transition(board, zeroIndex, i), move];
            neighbors.push(neighbor);
        }
        if (moves.left) {
            let i = zeroIndex - 1;
            let move = new Moves();
            move.left = true;
            let neighbor = [this.transition(board, zeroIndex, i), move];
            neighbors.push(neighbor);
        }

        return neighbors;
    }

    getMinDistanceIndex(): number {
        let index = 0;
        let minDistance = this.frontier[0].total;

        for(let i = 0; i < this.frontier.length; ++i) {
            if (this.frontier[i].total <= minDistance) {
                minDistance = this.frontier[i].total;
                index = i;
            }
        }
        return index;
    }

    // distance is calculated wrt to the goal state
    getManhattenDistance(state: Board): number {
        let distance = 0;

        for (let i = 1; i < state.size * state.size; ++i) {
            for (let j = 0; j < state.size * state.size; ++j) {
                let x = parseInt(state.tiles[j].value);
                if (i == x) {
                    let row1 = Math.floor(i / state.size);
                    let col1 = i % state.size;
                    let row2 = Math.floor(j / state.size);
                    let col2 = j % state.size;

                    distance += (Math.abs(row1 - row2) + Math.abs(col1 - col2));
                }
            }
        }
        return distance;
    }

    getIndexOfState(board: Board): number {
        for (let i = 0; i < this.frontier.length; i++) {
            if (board.state == this.frontier[i].board.state)
                return i;
        }
        return -1;
    }

}
