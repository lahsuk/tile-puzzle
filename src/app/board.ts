import { Tile } from "./tile";
import { Moves } from "./moves";

export class Board {
    size: number;
    tiles: Tile[] = [];
    state: string;
    moves: Moves;

    constructor(size: number = 3) {
        this.size = size;
        for (let i = 0; i < size * size; ++i) {
            let tile = new Tile();
            tile.setValue(i.toString());

            this.tiles.push(tile);
        }
        this.randomize();
        this.update();
        // console.log("Solvable: " + this.is_solvable());
        // console.log(this.getState());
    }

    randomize() {
        for (let i = 0; i < this.size * this.size; ++i) {
            let random1 = Math.floor(Math.random() * 100) % (this.size * this.size);
            let random2 = Math.floor(Math.random() * 100) % (this.size * this.size);
            this.swapValue(random1, random2);
        }
        if (!this.is_solvable())
            this.randomize();
        this.update();
    }

    update() {
        this.setState();
        let size = this.size;
        let i = this.getZeroTileIndex();
        this.moves = this.getPossibleMoves();

        // reset all swappable values
        for (let i = 0; i < size * size; ++i) {
            this.tiles[i].swappable = false;
        }

        if (this.moves.up) {
            let index = i - size;
            this.tiles[index].swappable = true;
        }
        if (this.moves.down) {
            let index = i + size;
            this.tiles[index].swappable = true;
        }
        if (this.moves.left) {
            let index = i - 1;
            this.tiles[index].swappable = true;
        }
        if (this.moves.right) {
            let index = i + 1;
            this.tiles[index].swappable = true;
        }
    }

    is_solvable(): boolean {
        let inversions = this.getInversions();
        if (this.size & 1) { // odd
            return !(inversions & 1);
        }
        // even
        let row = this.getBlankRowIndex();
        if (row & 1)
            return !(inversions & 1);
        else
            return Boolean(inversions & 1);
    }

    swapValue(i, j) {
        let temp = this.tiles[j].value;
        this.tiles[j].value = this.tiles[i].value;
        this.tiles[i].value = temp;
        this.update();
    }

    getPossibleMoves() {
        let i = this.getZeroTileIndex();
        let moves = new Moves();
        let size = this.size;
        let row = Math.floor(i / size);
        let col = Math.floor(i % size);

        if (row >= 1)       moves.up    = true;
        if (row < (size-1)) moves.down  = true;
        if (col >= 1)       moves.left  = true;
        if (col < (size-1)) moves.right = true;

        return moves;
    }

    getInversions(): number {
        let inversions: number = 0;
        for (let i = 0; i < this.size * this.size - 1; ++i) {
            let x = parseInt(this.tiles[i].value)
            for (let j = i + 1; j < this.size * this.size; ++j) {
                let y = parseInt(this.tiles[j].value);
                if ( (x > y) && (x != 0) && (y != 0) )
                    ++inversions;
            }
        }
        return inversions;
    }

    getBlankRowIndex(): number {
        let zeroIndex = this.getZeroTileIndex();
        let row = Math.floor(zeroIndex / this.size);
        row += 1; // since we count from 0
        return row;
    }

    getZeroTileIndex(): number {
        let size = this.size;
        for (let i = 0; i < size * size; ++i) {
            if (this.tiles[i].value == "0")
                return i;
        }
    }

    setState() {
        this.state = "";
        for (let i = 0; i < this.size * this.size; ++i) {
            this.state += this.tiles[i].value + ",";
        }
    }

    getTiles() {
        return this.tiles;
    }

    getState() {
        return this.state;
    }
}
