/**
 * The game scene. (WIP)
 * 
 * By: Sam Corbett
 * Version: 0.8
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

    // Constructor Method
    constructor() {
        super({ key: 'GameScene' });
    }

    // Preload Assets
    preload() {
        // Load the sidebar
        this.load.image('sidebar', 'assets/sidebar.png');

        // Load the images with text
        this.load.image('getReady', 'assets/getReady.png');
        this.load.image('wellDone', 'assets/wellDone.png');

        // Load the gems
        this.load.image('gem1', 'assets/gem1.png');
        this.load.image('gem2', 'assets/gem2.png');
        this.load.image('gem3', 'assets/gem3.png');
        this.load.image('gem4', 'assets/gem4.png');
        this.load.image('gem5', 'assets/gem5.png');
    }

    // Create Method
    create() {
        // Create the vector line
        this.vectorLine = new vectorLine(this);

        // Show the get ready image
        this.showGetReady();
    
        // Add event listener for pointerup
        this.input.on('pointerup', this.onPointerUp, this);

        // Add the sidebar
        this.add.image(200, 540, 'sidebar');
    }

    // Show the image saying "get ready"
    private showGetReady() {
        const getReadyImage = this.add.image(1160, 540, 'getReady');
        this.time.delayedCall(2500, () => {
            getReadyImage.destroy();
            this.spawnGems();
        });
    }

    // Show the image saying "well done"
    private showWellDone() {
        const wellDoneImage = this.add.image(1160, 540, 'wellDone');
        wellDoneImage.setScale(2);
        this.time.delayedCall(2500, () => {
            wellDoneImage.destroy();
            this.showGetReady();
            this.numGemsToSpawn++;
            this.spawnGems();
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
    
        if (this.numGemsToSpawn <= 10) {
            gemTypeDistribution = ['gem1', 'gem2'];
        } else if (this.numGemsToSpawn <= 15) {
            gemTypeDistribution = ['gem1', 'gem2', 'gem3'];
        } else if (this.numGemsToSpawn <= 20) {
            gemTypeDistribution = ['gem1', 'gem2', 'gem3', 'gem4'];
        } else {
            gemTypeDistribution = gemTypes;
        }

        for (let counter1 = 0; counter1 < totalGemsToSpawn; counter1++) {
            let xCord, yCord, gem, overlap;
    
            do {
                xCord = Phaser.Math.Between(500, 1900);
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
    
            const gemType = gemTypeDistribution[Math.floor(Math.random() * gemTypeDistribution.length)];
            gem = this.add.image(xCord, yCord, gemType);
            gem.setScale(0.07);
            gem.setInteractive();
            this.gems.push(gem);
    
            gem.on('pointerdown', () => {
                this.isGemClicked = true;
                this.selectedGem = gem;
                this.time.delayedCall(150, () => {
                    if (this.input.activePointer.isDown) {
                        this.isDrawingLine = true;
                        this.vectorLine.startDrawing(gem.x, gem.y);
                    } else {
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
        if (this.input.activePointer.isDown && this.isGemClicked && this.selectedGem) {
            this.isDrawingLine = true;
            this.vectorLine.onPointerMove(this.input.activePointer);
    
            const pointer = this.input.activePointer;
            let overlappingGem: Phaser.GameObjects.Image | null = null;
    
            for (let i = 0; i < this.gems.length; i++) {
                const gem = this.gems[i];
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
                this.vectorLine.startDrawing(overlappingGem.x, overlappingGem.y);
    
                // Debugging: Log the locked lines
                console.log('Locked Lines:', this.vectorLine.lockedLines);
            }
        } else {
            this.isDrawingLine = false;
        }
    }

    // Pointer Up Method
    private onPointerUp() {
        if (this.isGemClicked && this.selectedGem) {
            let endX, endY;
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
                    this.checkAndRespawnGems();
                // If the triangle is formed, clear the gems and lines
                // and clear the gems if they are inside that triangle
                } else if (this.isTriangle(lines)) {
                    this.clearGemsAndLines(lines);
                    this.clearGemsInsideTriangle(lines);
                // If the line is formed, clear the gems and lines
                // Else clear the lines
                } else if (this.isLine(lines)) {
                    this.clearGemsAndLines(lines);
                } else {
                    this.vectorLine.clearLines();
                }
            }
            this.isGemClicked = false;
            this.selectedGem = null;
            this.vectorLine.clearLines();
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
    private clearGemsAndLines(lines: { x1: number, y1: number, x2: number, y2: number }[]) {
        this.gems = this.gems.filter(gem => {
            const isGemInLine = lines.some(line => 
                (gem.x === line.x1 && gem.y === line.y1) || (gem.x === line.x2 && gem.y === line.y2)
            );
            if (isGemInLine) {
                gem.destroy();
            }
            return !isGemInLine;
        });
        this.vectorLine.clearLines();
        this.checkAndRespawnGems();
    }

    /**
     * clearGemsInsideTriangle method
     * @param lines - the lines to clear the gems inside the triangle
     */
    private clearGemsInsideTriangle(lines: { x1: number, y1: number, x2: number, y2: number }[]) {
        const [line1, line2, line3] = lines;
    
        const area = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => {
            return Math.abs((x1*(y2-y3) + x2*(y3-y1) + x3*(y1-y2)) / 2.0);
        };
    
        const triangleArea = area(line1.x1, line1.y1, line2.x1, line2.y1, line3.x1, line3.y1);
    
        this.gems = this.gems.filter(gem => {
            const gemArea = area(gem.x, gem.y, line1.x1, line1.y1, line2.x1, line2.y1) +
                            area(gem.x, gem.y, line2.x1, line2.y1, line3.x1, line3.y1) +
                            area(gem.x, gem.y, line3.x1, line3.y1, line1.x1, line1.y1);
    
            if (gemArea === triangleArea) {
                gem.destroy();
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
    
        this.checkAndRespawnGems();
    }

        // Check if all gems are cleared and respawn if necessary
        private checkAndRespawnGems() {
            if (this.gems.length === 0) {
                this.showWellDone();
            }
        }
}