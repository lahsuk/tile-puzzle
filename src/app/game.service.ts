import { Injectable } from '@angular/core';
import { Board } from './board';
import { Moves } from './moves';

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

  setBoard(board: Board) {
    this.board = board;
    this.size = board.size;
  }

  randomize() {
    for (let i = 0; i < this.size * this.size; ++i) {
      let random1 = Math.floor(Math.random() * 100) % (this.size * this.size);
      let random2 = Math.floor(Math.random() * 100) % (this.size * this.size);
      this.swapValue(random1, random2);
    }
  }

  swapValue(i, j) {
    let temp = this.board.tiles[j].value;
    this.board.tiles[j].value = this.board.tiles[i].value;
    this.board.tiles[i].value = temp;
  }


  updateTiles() {
    let size = this.size;
    let i = this.getZeroTileIndex();
    let moves: Moves = this.getPossibleMoves();

    // reset all swappable values
    for (let i = 0; i < size * size; ++i) {
      this.board.tiles[i].swappable = false;
    }

    if (moves.up) {
      let index = i - size;
      this.board.tiles[index].swappable = true;
    }
    if (moves.down) {
      let index = i + size;
      this.board.tiles[index].swappable = true;
    }
    if (moves.left) {
      let index = i - 1;
      this.board.tiles[index].swappable = true;
    }
    if (moves.right) {
      let index = i + 1;
      this.board.tiles[index].swappable = true;
    }
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

  gameCompleted() {
    for (let i = 0; i < this.size * this.size; ++i) {
      if (this.board.tiles[i].value != i.toString())
        return false;
    }
    return true;
  }

  getZeroTileIndex(): number {
    let size = this.size;
    for (let i = 0; i < size * size; ++i) {
      if (this.board.tiles[i].value == "0")
        return i;
    }
  }
}
