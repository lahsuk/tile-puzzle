import { Component, OnChanges, DoCheck, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from './game.service'
import { Bot } from './bot';

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
    botPlaying: boolean;

    constructor(public gs: GameService, public snackBar: MatSnackBar, private ref: ChangeDetectorRef) {
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
        this.botPlaying = false;
        gs.newBoard(this.size);
    }

    playerClick(i) {
        if (this.botPlaying) return;
        this.click(i);
    }

    click(i, self = this) {
        if (!self.gs.board.tiles[i].swappable) {
            self.snackBar.open("You can only swap adjacent tiles to the empty tile.", "Oh, OK.", {duration: 2500,});
            return;
        }
        console.log(i);

        self.moves += 1;

        let zeroIndex = self.gs.board.getZeroTileIndex();
        self.gs.board.swapValue(zeroIndex, i);

        self.gs.board.printBoard();

        let completed = self.gs.gameCompleted();
        if (completed) {
            self.snackBar.open("Game Complete!", "OK", {duration: 4000,});
            this.botPlaying = false;
        }
    }

    botPlay() {
        this.botPlaying = true;
        let bot = new Bot();
        let moves = bot.getSolveSequnce(this.gs.board);
        console.log("move sequence: ");
        console.log(moves);

        this.singleMove(0, moves);

        console.log("Game completed by bot!");
    }

    singleMove(i, moves, self=this) {
        console.log("length: " + moves.length);
        console.log("i: " + i);
        console.log(moves);

        let move = moves[i];
        console.log(move);
        let movePos = -1;
        let zeroIndex = self.gs.board.getZeroTileIndex();
        if (move.up) {
            console.log("up");
            movePos = zeroIndex - self.gs.board.size;
        }
        if (move.down) {
            console.log("down");
            movePos = zeroIndex + self.gs.board.size;
        }
        if (move.right) {
            console.log("right");
            movePos = zeroIndex + 1;
        }
        if (move.left) {
            console.log("left");
            movePos = zeroIndex - 1;
        }
        self.click(movePos, self);

        if ( i != (moves.length-1) ) {
            // console.log("Scheduled " + i + "th move.");
            setTimeout(self.singleMove, 200, i+1, moves, self);
        }
    }

    playerPlay() {
        this.botPlaying = false;
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
