import { Injectable } from '@angular/core';
import { Board } from './board';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    board: Board;
    size: number;

    constructor() {
        this.board = new Board(4);
        this.size = this.board.size;
    }

    newBoard(size: number) {
        this.board = new Board(size);
        this.size = size;
    }

    gameCompleted() {
        for (let i = 0; i < this.size * this.size; ++i) {
            if (this.board.tiles[i].value != i.toString())
            return false;
        }
        return true;
    }
}
