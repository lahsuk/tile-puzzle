import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from './game.service'

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
        gs.newBoard(this.size);
    }

    playerClick(i) {
        if (!this.gs.board.tiles[i].swappable) {
            this.snackBar.open("You can only swap adjacent tiles to the empty tile.", "Oh, OK.", {duration: 2500,});
            return;
        }

        this.moves += 1;

        let zeroIndex = this.gs.board.getZeroTileIndex();
        this.gs.board.swapValue(zeroIndex, i);

        let completed = this.gs.gameCompleted();
        if (completed) {
            this.snackBar.open("Game Complete!", "OK", {duration: 4000,});
        }
    }

    newGame() {
        this.gs.newBoard(this.size);
        this.moves = 0;
    }

    getImagePath(i) {
        return "./assets/tiles/" + this.puzzles[this.puzzle] + "/" + this.difficulties[this.difficulty] + "/"
        + this.gs.board.tiles[i].value + ".jpg";
    }

    getOriginalImagePath() {
        return "./assets/tiles/" + this.puzzles[this.puzzle] + "/original.jpg";
    }

    changeDifficulty(level: string) {
        if (level == "easy")   this.difficulty = 0;
        if (level == "medium") this.difficulty = 1;
        if (level == "hard")   this.difficulty = 2;
        this.size = this.difficulty_sizes[this.difficulty];
        this.newGame();
    }

    changePuzzle() {
        console.log("puzzle changed.")
        this.puzzle = (this.puzzle + 1) % this.puzzles.length;
        this.newGame();
    }

}
