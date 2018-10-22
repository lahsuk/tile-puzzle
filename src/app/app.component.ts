import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from './game.service'
import { Board } from './board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GameService]
})
export class AppComponent {
  title = 'Tile Puzzle';
  size: number;
  moves: number;
  difficulty: number;
  difficulties: string[];
  difficulty_sizes: number[] = [
    3, 4, 5
  ];
  puzzle: number;
  puzzles: string[];

  constructor(public gs: GameService, public snackBar: MatSnackBar) {
    this.moves = 0;
    this.difficulty = 0;
    this.difficulties = [
      "easy",
      "medium",
      "hard"
    ]
    this.puzzle = 0;
    this.puzzles = [
      "desert_road",
      "urara_meirochou",
      "canyon",
    ]
    this.size = this.difficulty_sizes[this.difficulty];
    gs.setBoard(new Board(this.size));
    this.gs.randomize();
    this.gs.updateTiles();
  }

  playerClick(i) {
    if (!this.gs.board.tiles[i].swappable) {
      this.snackBar.open("You can onlyl swap adjacent tiles to the empty tiles.", "Oh, OK.", {duration: 2500,});
      return;
    }

    this.moves += 1;

    console.log(i);
    let zeroIndex = this.gs.getZeroTileIndex();
    // swap values
    this.gs.swapValue(zeroIndex, i);

    this.gs.updateTiles();
    let completed = this.gs.gameCompleted();
    if (completed) {
      this.snackBar.open("Game Complete!", "OK", {duration: 4000,});
    }
  }

  newGame() {
    this.gs.setBoard(new Board(this.size))
    this.moves = 0;
    this.gs.randomize();
    this.gs.updateTiles();
  }

  getImagePath(i) {
    return "../assets/tiles/" + this.puzzles[this.puzzle] + "/" + this.difficulties[this.difficulty] + "/"
      + this.gs.board.tiles[i].value + ".jpg";
  }

  getOriginalImagePath() {
    return "../assets/tiles/" + this.puzzles[this.puzzle] + "/original.jpg";
  }

  changeDifficulty(level: string) {
    if (level == "easy")   this.difficulty = 0;
    if (level == "medium") this.difficulty = 1;
    if (level == "hard")   this.difficulty = 2;
    this.size = this.difficulty_sizes[this.difficulty];
    this.newGame();
  }

  changePuzzle() {
    this.puzzle = (this.puzzle + 1) % this.puzzles.length;
    this.newGame();
  }

}
