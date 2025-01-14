/**
 * The game scene. (WIP)
 * 
 * By: Sam Corbett
 * Version: 0.6
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
        this.load.image('gem1', 'assets/gem1.png');
        this.load.image('gem2', 'assets/gem2.png');
    }

    // Create Method
    create() {
        // Create the vector line
        this.vectorLine = new vectorLine(this);
        // Spawn the gems
        this.spawnGems();
    
        // Add event listener for pointerup
        this.input.on('pointerup', this.onPointerUp, this);
    }

    // Spawn Gems Method
    private spawnGems() {
        const gemSize = 720 * 0.07; // estimated size of the gem
    
        for (let counter1 = 0; counter1 < this.numGemsToSpawn; counter1++) {
            let xCord, yCord, gem, overlap;
            const gemType = Phaser.Math.Between(1, 2) === 1 ? 'gem1' : 'gem2';
    
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
    
            gem = this.add.image(xCord, yCord, gemType);
            gem.setData('type', gemType);
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
            // Lock the line and start drawing a new line on the overlapping gem
            if (overlappingGem) {
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

            if (!this.selectedGem.getBounds().contains(endX, endY)) {
                this.vectorLine.stopDrawing();
                this.vectorLine.clearLines();
            } else {
                if (lines.length === 0) {
                    this.selectedGem.destroy();
                    this.gems = this.gems.filter(gem => gem !== this.selectedGem);
                    this.checkAndRespawnGems(); // Ensure gems are respawned if necessary
                } else if (this.isTriangle(lines)) {
                    this.clearGemsAndLines(lines);
                    this.clearGemsInsideTriangle(lines);
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

    private isSameType(gem1: Phaser.GameObjects.Image, gem2: Phaser.GameObjects.Image): boolean {
        return gem1.getData('type') === gem2.getData('type');
    }

    private isLine(lines: { x1: number, y1: number, x2: number, y2: number }[]): boolean {
        if (lines.length !== 1) return false;
        const [line] = lines;
        const gem1 = this.gems.find(gem => gem.x === line.x1 && gem.y === line.y1);
        const gem2 = this.gems.find(gem => gem.x === line.x2 && gem.y === line.y2);
        return !!gem1 && !!gem2 && this.isSameType(gem1, gem2);
    }
    
    private isTriangle(lines: { x1: number, y1: number, x2: number, y2: number }[]): boolean {
        if (lines.length !== 3) return false;
        const [line1, line2, line3] = lines;
        const gem1 = this.gems.find(gem => gem.x === line1.x1 && gem.y === line1.y1);
        const gem2 = this.gems.find(gem => gem.x === line2.x1 && gem.y === line2.y1);
        const gem3 = this.gems.find(gem => gem.x === line3.x1 && gem.y === line3.y1);
        return !!gem1 && !!gem2 && !!gem3 && this.isSameType(gem1, gem2) && this.isSameType(gem2, gem3);
    }

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
                this.numGemsToSpawn++;
                this.spawnGems();
            }
        }
}