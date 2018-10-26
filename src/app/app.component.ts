import { Component, OnChanges, DoCheck } from '@angular/core';
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
        this.botPlaying = false;
        gs.newBoard(this.size);
    }

    playerClick(i) {
        if (this.botPlaying) return;
        this.click(i);
    }

    click(i) {
        if (!this.gs.board.tiles[i].swappable) {
            this.snackBar.open("You can only swap adjacent tiles to the empty tile.", "Oh, OK.", {duration: 2500,});
            return;
        }
        console.log(i);

        this.moves += 1;

        let zeroIndex = this.gs.board.getZeroTileIndex();
        this.gs.board.swapValue(zeroIndex, i);

        let completed = this.gs.gameCompleted();
        if (completed) {
            this.snackBar.open("Game Complete!", "OK", {duration: 4000,});
        }
    }

    sleepFor (sleepDuration: number){
        var now = new Date().getTime();
        while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
    }

    botPlay() {
        this.botPlaying = true;
        let bot = new Bot();
        let moves = bot.getSolveSequnce(this.gs.board);
        console.log("move sequence: ", moves);
        for (let i = 0; i < moves.length; ++i) {
            let movePos = -1;
            let zeroIndex = this.gs.board.getZeroTileIndex();
            if (moves[i].up) {
                movePos = zeroIndex - this.gs.board.size;
            }
            if (moves[i].down) {
                movePos = zeroIndex + this.gs.board.size;
            }
            if (moves[i].right) {
                movePos = zeroIndex + 1;
            }
            if (moves[i].left) {
                movePos = zeroIndex - 1;
            }

            console.log("move pos: " + movePos);
            this.sleepFor(500);
            this.click(movePos);

            // TODO: make angular refresh the template statement forcefully
            // this.sleepFor(500);
        }
        this.botPlaying = false;
        console.log("Game completed by bot!");
    }

    singleMove(moves) {
        let move = moves.pop();
        let movePos = -1;
        let zeroIndex = this.gs.board.getZeroTileIndex();
        if (move.up) {
            movePos = zeroIndex - this.gs.board.size;
        }
        if (move.down) {
            movePos = zeroIndex + this.gs.board.size;
        }
        if (move.right) {
            movePos = zeroIndex + 1;
        }
        if (move.left) {
            movePos = zeroIndex - 1;
        }
        this.click(movePos);
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
