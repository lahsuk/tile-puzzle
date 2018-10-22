import { Tile } from "./tile";

export class Board {
    size: number;
    tiles: Tile[] = [];

    constructor(size: number = 3) {
        this.size = size;
        for (let i = 0; i < size * size; ++i) {
            let tile = new Tile();
            tile.setValue(i.toString());

            this.tiles.push(tile);
        }
    }

    getTiles() {
        return this.tiles;
    }
}
