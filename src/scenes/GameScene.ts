/**
 * The game scene.
 * 
 * By: Sam Corbett
 * Version: 1.0
 * Since: 2025/01/07
 */

import Phaser from 'phaser';
import { vectorLine } from './vectorLine';

export class GameScene extends Phaser.Scene {
    // Properties
    private vectorLine: vectorLine;
    private isGemClicked: boolean = false;
    private selectedGem: Phaser.GameObjects.Image | null = null;
    private gems: Phaser.GameObjects.Image[] = [];
    private isDrawingLine: boolean = false;
    private numGemsToSpawn: number = 6;
    private gameMusic: Phaser.Sound.BaseSound;

    // Score, Rounds, and Turns
    private score: number = 0;
    private scoreText: Phaser.GameObjects.Text;
    private rounds: number = 1;
    private roundsText: Phaser.GameObjects.Text;
    private turns: number = 15;
    private turnsText: Phaser.GameObjects.Text;

    // Constructor Method
    constructor() {
        super({ key: 'GameScene' });
    }

    // Preload Assets
    preload() {
        // Load the sidebar
        this.load.image('sidebar', 'assets/sidebar.png');

        // Load the background for the game
        this.load.image('gameScene-bg', 'assets/gameScene-bg.jpg');

        // Load the images with text
        this.load.image('wellDone', 'assets/wellDone.png');
        this.load.image('gameOver', 'assets/gameOver.png');

        // Load the UI
        this.load.image('quitButton', 'assets/quitButton.png');

        // Load the gems
        this.load.image('gem1', 'assets/gem1.png');
        this.load.image('gem2', 'assets/gem2.png');
        this.load.image('gem3', 'assets/gem3.png');
        this.load.image('gem4', 'assets/gem4.png');
        this.load.image('gem5', 'assets/gem5.png');

        // Load the sound & music
        // SFX
        this.load.audio('UI-sound', 'assets/sound/UI.mp3');
        this.load.audio('jewelSound', 'assets/sound/jewelSound.mp3');
        this.load.audio('jewelClearSound', 'assets/sound/jewelClearSound.mp3');
        this.load.audio('extraTurns', 'assets/sound/extraTurns.mp3');
        this.load.audio('wellDoneSound', 'assets/sound/wellDoneSound.mp3');
        this.load.audio('gameOver', 'assets/sound/gameOver.mp3');

        // Music
        this.load.audio('gameMusic', 'assets/sound/gameMusic.mp3');
    }

    // Create Method
    create() {
        // Set the background image
        this.add.image(960, 540, 'gameScene-bg');

        // Create the vector line
        this.vectorLine = new vectorLine(this);

        // Spawn the gems
        this.spawnGems();
    
        // Add event listener for pointerup
        this.input.on('pointerup', this.onPointerUp, this);

        // Add the sidebar
        this.add.image(200, 540, 'sidebar');

        // Add the score text
        this.scoreText = this.add.text(180, 250, `${this.score}`, {
            fontSize: '50px',
            color: '#000',
            fontFamily: 'Quicksand',
            align: 'center'
        });

        // Add the rounds text
        this.roundsText = this.add.text(180, 530, `${this.rounds}`, {
            fontSize: '50px',
            color: '#000',
            fontFamily: 'Quicksand',
            align: 'center'
        });

        // Add the turns text
        this.turnsText = this.add.text(180, 810, `${this.turns}`, {
            fontSize: '50px',
            color: '#000',
            fontFamily: 'Quicksand',
            align: 'center'
        });

        // Loop the game music
        this.gameMusic = this.sound.add('gameMusic')
        this.gameMusic.play({ loop: true });
    }


    // Show the image saying "well done"
    private showWellDone() {
        const wellDoneImage = this.add.image(1160, 540, 'wellDone');
        wellDoneImage.setScale(2);
        wellDoneImage.setDepth(1);
        this.sound.play('wellDoneSound', { volume: 0.75 });
        this.time.delayedCall(2500, () => {
            wellDoneImage.destroy();
        });
    }

    // Spawn Gems Method
    private spawnGems() {
        // estimated size of the gem
        const gemSize = 720 * 0.07;
        // total number of gems to spawn
        const totalGemsToSpawn = Math.min(this.numGemsToSpawn, 50);
        const gemTypes = ['gem1', 'gem2', 'gem3', 'gem4', 'gem5'];
        let gemTypeDistribution;
    
        // Set the gem type distribution based on the number of gems to spawn
        if (this.numGemsToSpawn <= 10) {
            gemTypeDistribution = ['gem1', 'gem2'];
        } else if (this.numGemsToSpawn <= 15) {
            gemTypeDistribution = ['gem1', 'gem2', 'gem3'];
        } else if (this.numGemsToSpawn <= 20) {
            gemTypeDistribution = ['gem1', 'gem2', 'gem3', 'gem4'];
        } else {
            gemTypeDistribution = gemTypes;
        }

        // Spawn the gems
        for (let counter1 = 0; counter1 < totalGemsToSpawn; counter1++) {
            let xCord, yCord, gem, overlap;
    
            // Check if the gem is overlapping with any other gem
            // If it is, generate a new random position
            do {
                xCord = Phaser.Math.Between(400, 1900);
                yCord = Phaser.Math.Between(20, 1060);
                overlap = false;
    
                for (let counter2 = 0; counter2 < this.gems.length; counter2++) {
                    const existingGem = this.gems[counter2];
                    const distance = Phaser.Math.Distance.Between(xCord, yCord, existingGem.x, existingGem.y);
                    if (distance < gemSize) {
                        overlap = true;
                        break;
                    }
                }
            } while (overlap);
    
            // Setting the gem type
            const gemType = gemTypeDistribution[Math.floor(Math.random() * gemTypeDistribution.length)];
            gem = this.add.image(xCord, yCord, gemType);
            gem.setScale(0.07);
            gem.setInteractive();
            gem.setDepth(0)
            this.gems.push(gem);
    
            // Add the pointerdown event listener
            // when the gem is clicked
            gem.on('pointerdown', () => {
                this.isGemClicked = true;
                this.selectedGem = gem;
                this.time.delayedCall(150, () => {
                    this.sound.play('jewelSound');
                    // Start drawing the line
                    if (this.input.activePointer.isDown) {
                        this.isDrawingLine = true;
                        this.vectorLine.startDrawing(gem.x, gem.y);
                    } else {
                        // If the conditions are met, destroy the gem
                        if (this.isGemClicked && !this.isDrawingLine && this.selectedGem) {
                            this.selectedGem.destroy();
                            this.gems = this.gems.filter(g => g !== this.selectedGem);
                            this.selectedGem = null;
                            this.isGemClicked = false;
                            this.checkAndRespawnGems();
                        }
                    }
                });
            });
        }
    }

    // Update Method
    update() {
        /**
         * If the pointer is down and the gem is clicked
         * and the selected gem is not null,
         * Draw the line.
         */
        if (this.input.activePointer.isDown && this.isGemClicked && this.selectedGem) {
            this.isDrawingLine = true;
            this.vectorLine.onPointerMove(this.input.activePointer);
    
            const pointer = this.input.activePointer;
            let overlappingGem: Phaser.GameObjects.Image | null = null;
    
            // Check if the pointer is overlapping with any gem
            for (let counter = 0; counter < this.gems.length; counter++) {
                const gem = this.gems[counter];
                if (gem.getBounds().contains(pointer.x, pointer.y) && gem !== this.selectedGem) {
                    overlappingGem = gem;
                    break;
                }
            }
    
            // If there is an overlapping gem
            // Check if the gem types match
            if (overlappingGem && overlappingGem.texture.key === this.selectedGem.texture.key) {
                this.vectorLine.lockLine(overlappingGem.x, overlappingGem.y);
                this.isGemClicked = true;
                this.selectedGem = overlappingGem;
                this.sound.play('jewelSound');
                this.vectorLine.startDrawing(overlappingGem.x, overlappingGem.y);
            }
        } else {
            this.isDrawingLine = false;
        }

        // Update the score text
        this.scoreText.setText(`${this.score}`);
    }

    // Pointer Up Method
    private onPointerUp() {
        // If the gem is clicked and the selected gem is not null
        // Check if the line is formed
        if (this.isGemClicked && this.selectedGem) {
            let endX, endY;
            // If the line is locked, set the end point to the start point
            // Else set the end point to the pointer position
            if (this.vectorLine.isLocked) {
                endX = this.vectorLine.startPoint.x;
                endY = this.vectorLine.startPoint.y;
            } else {
                endX = this.input.activePointer.x;
                endY = this.input.activePointer.y;
            }
    
            const lines = this.vectorLine.lockedLines;
    
            // If the end point is not inside the selected gem
            // Clear the lines
            if (!this.selectedGem.getBounds().contains(endX, endY)) {
                this.vectorLine.stopDrawing();
                this.vectorLine.clearLines();
            } else {
                // If the lines length is 0, destroy the selected gem
                if (lines.length === 0) {
                    this.selectedGem.destroy();
                    this.gems = this.gems.filter(gem => gem !== this.selectedGem);
                    this.updateScore(1 * 100);
                    this.turns--;
                    this.checkAndRespawnGems();
                // If the triangle is formed, clear the gems and lines
                // and clear the gems if they are inside that triangle
                } else if (this.isTriangle(lines)) {
                    this.clearGemsAndLines(lines);
                    const clearedGemsInsideTriangle = this.clearGemsInsideTriangle(lines);
                    this.updateScore(3 * 300);
                    if (clearedGemsInsideTriangle > 0) {
                        this.turns += clearedGemsInsideTriangle;
                    } else {
                        this.turns -= 1;
                        this.sound.play('jewelClearSound');
                    }
                // If the line is formed, clear the gems and lines
                // Else clear the lines
                } else if (this.isLine(lines)) {
                    const clearedGems = this.clearGemsAndLines(lines);
                    this.updateScore(clearedGems * 200);
                    this.turns--;
                    this.sound.play('jewelClearSound');
                } else {
                    this.vectorLine.clearLines();
                }
            }
            this.isGemClicked = false;
            this.selectedGem = null;
            this.vectorLine.clearLines();
        }
    }

    // Update Score Method
    private updateScore(points: number) {
        this.score += points;
        this.scoreText.setText(`${this.score}`);
        this.turnsText.setText(`${this.turns}`);

        // Que GameOver
        if (this.turns === 0) {
            this.queGameOver();
        }
    }

    /**
     * isLine method
     * @param lines - the lines to check
     * @returns the boolean value of whether the lines form a line
     */
    private isLine(lines: { x1: number, y1: number, x2: number, y2: number }[]): boolean {
        return lines.length === 1;
    }

    /**
     * isTriangle method
     * @param lines - the lines to check
     * @returns the boolean value of whether the lines form a triangle
     */
    private isTriangle(lines: { x1: number, y1: number, x2: number, y2: number }[]): boolean {
        if (lines.length !== 3) return false;
        const [line1, line2, line3] = lines;
        const isTriangle = (
            line1.x1 === line3.x2 && line1.y1 === line3.y2 &&
            line2.x1 === line1.x2 && line2.y1 === line1.y2 &&
            line3.x1 === line2.x2 && line3.y1 === line2.y2
        );
    
        if (isTriangle) {
            this.clearGemsAndLines(lines);
            this.clearGemsInsideTriangle(lines);
        }
    
        return isTriangle;
    }

    /**
     * clearGemsAndLines method
     * @param lines - the lines to clear the gems and lines
     */
    private clearGemsAndLines(lines: { x1: number, y1: number, x2: number, y2: number }[]): number {
        let clearedGemsCount = 0;
        this.gems = this.gems.filter(gem => {
            const isGemInLine = lines.some(line => 
                (gem.x === line.x1 && gem.y === line.y1) || (gem.x === line.x2 && gem.y === line.y2)
            );
            if (isGemInLine) {
                gem.destroy();
                clearedGemsCount++;
            }
            return !isGemInLine;
        });
        this.vectorLine.clearLines();
        this.checkAndRespawnGems();
        return clearedGemsCount;
    }

    /**
     * clearGemsInsideTriangle method
     * @param lines - the lines to clear the gems inside the triangle
     */
    private clearGemsInsideTriangle(lines: { x1: number, y1: number, x2: number, y2: number }[]): number {
        const [line1, line2, line3] = lines;
        const area = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => {
            return Math.abs((x1*(y2-y3) + x2*(y3-y1) + x3*(y1-y2)) / 2.0);
        };
        const triangleArea = area(line1.x1, line1.y1, line2.x1, line2.y1, line3.x1, line3.y1);
        let insideGemsCount = 0;
    
        this.gems = this.gems.filter(gem => {
            const gemArea = area(gem.x, gem.y, line1.x1, line1.y1, line2.x1, line2.y1) +
                            area(gem.x, gem.y, line2.x1, line2.y1, line3.x1, line3.y1) +
                            area(gem.x, gem.y, line3.x1, line3.y1, line1.x1, line1.y1);
    
            if (gemArea === triangleArea) {
                gem.destroy();
                insideGemsCount++;
                return false;
            }
            return true;
        });
    
        // Remove the gems forming the triangle
        const triangleGems = this.gems.filter(gem => 
            (gem.x === line1.x1 && gem.y === line1.y1) ||
            (gem.x === line2.x1 && gem.y === line2.y1) ||
            (gem.x === line3.x1 && gem.y === line3.y1)
        );
    
        for (let counter = 0; counter < triangleGems.length; counter++) {
            triangleGems[counter].destroy();
        }
        this.gems = this.gems.filter(gem => !triangleGems.includes(gem));

        // Increment turns if there are gems inside the triangle
        if (insideGemsCount > 0) {
            this.turns += insideGemsCount + 1;
            this.sound.play('extraTurns');
            this.turnsText.setText(`${this.turns}`);
        }
    
        this.checkAndRespawnGems();
        return insideGemsCount;
    }

    // Check if all gems are cleared and respawn if necessary
    private checkAndRespawnGems() {
        if (this.gems.length === 0) {
            this.numGemsToSpawn++;
            this.showWellDone();
            this.spawnGems();
            this.rounds++;
            this.roundsText.setText(`${this.rounds}`);
        }
    }

    // Que GameOver Method
    private queGameOver() {
        setTimeout(() => {
            // Stop the game music
            this.gameMusic.stop();

            // Remove remaining gems
            for (let counter = 0; counter < this.gems.length; counter++) {
                this.gems[counter].destroy();
            }
            this.gems = [];

            // Display gameOver.png
            const gameOverImage = this.add.image(1160, 540, 'gameOver');
            gameOverImage.setOrigin(0.5, 0.5);
            gameOverImage.setScale(2);

            // Play the game over sound
            this.sound.play('gameOver');

            // Display quitButton
            const quitButton = this.add.image(1160, 800, 'quitButton');
            quitButton.setOrigin(0.5, 0.5);
            quitButton.setScale(0.5);
            quitButton.setInteractive();
            quitButton.on('pointerdown', () => {
                this.sound.play('UI-sound');
                window.location.reload();
            });
        }, 1500);
    }
}
