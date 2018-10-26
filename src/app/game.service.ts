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
        this.board.randomize();
        this.size = this.board.size;
    }

    newBoard(size: number) {
        this.board = new Board(size);
        this.board.randomize();
        this.size = size;
        console.log(this.board.state);
    }

    gameCompleted() {
        return this.board.is_complete();
    }
}
