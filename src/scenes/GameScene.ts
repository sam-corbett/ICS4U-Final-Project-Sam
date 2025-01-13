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

    // Constructor Method
    constructor() {
        super({ key: 'GameScene' });
    }

    // Preload Assets
    preload() {
        this.load.image('gem1', 'assets/gem1.png');
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
        const gemSize = 720 * 0.07; // Effective size of the gem after scaling
    
        for (let counter = 0; counter < 4; counter++) {
            let xCord, yCord, gem, overlap;
    
            do {
                xCord = Phaser.Math.Between(400, 1900);
                yCord = Phaser.Math.Between(20, 1060);
                overlap = false;
    
                for (let i = 0; i < this.gems.length; i++) {
                    const existingGem = this.gems[i];
                    const distance = Phaser.Math.Distance.Between(xCord, yCord, existingGem.x, existingGem.y);
                    if (distance < gemSize) {
                        overlap = true;
                        break;
                    }
                }
            } while (overlap);
    
            gem = this.add.image(xCord, yCord, 'gem1');
            gem.setScale(0.07);
            gem.setInteractive();
            this.gems.push(gem);
    
            gem.on('pointerdown', () => {
                this.isGemClicked = true;
                this.selectedGem = gem;
                this.time.delayedCall(150, () => {
                    if (this.input.activePointer.isDown && this.selectedGem && !this.selectedGem.getBounds().contains(this.input.activePointer.x, this.input.activePointer.y)) {
                        this.isDrawingLine = true;
                        this.vectorLine.startDrawing(gem.x, gem.y);
                    } else {
                        if (this.isGemClicked && !this.isDrawingLine && this.selectedGem) {
                            this.selectedGem.destroy();
                            this.gems = this.gems.filter(g => g !== this.selectedGem);
                            this.selectedGem = null;
                            this.isGemClicked = false;
                        }
                    }
                });
            });
    
            gem.on('pointermove', () => {
                if (this.isGemClicked && this.selectedGem && !this.selectedGem.getBounds().contains(this.input.activePointer.x, this.input.activePointer.y)) {
                    this.isDrawingLine = true;
                    this.vectorLine.startDrawing(gem.x, gem.y);
                }
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
        }
    }
    
    private isLine(lines: { x1: number, y1: number, x2: number, y2: number }[]): boolean {
        return lines.length === 1;
    }
    
    private isTriangle(lines: { x1: number, y1: number, x2: number, y2: number }[]): boolean {
        if (lines.length !== 3) return false;
        const [line1, line2, line3] = lines;
        return (
            line1.x1 === line3.x2 && line1.y1 === line3.y2 &&
            line2.x1 === line1.x2 && line2.y1 === line1.y2 &&
            line3.x1 === line2.x2 && line3.y1 === line2.y2
        );
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
    }
}
