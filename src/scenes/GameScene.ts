/**
 * The game scene. (WIP)
 * 
 * By: Sam Corbett
 * Version: 0.4
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

        // Pointer up event
        this.input.on('pointerup', () => {
            if (this.isGemClicked && !this.isDrawingLine && this.selectedGem) {
                this.selectedGem.destroy();
                // Remove the gem from the array
                for (let counter = 0; counter < this.gems.length; counter++) {
                    if (this.gems[counter] === this.selectedGem) {
                        this.gems.splice(counter, 1);
                        break;
                    }
                }
                this.selectedGem = null;
                this.isGemClicked = false;
            }
            this.isDrawingLine = false;
            this.vectorLine.stopDrawing();
        });
    }

    // Spawn Gems Method
    private spawnGems() {
        // For loop to spawn the gems
        for (let counter = 0; counter < 3; counter++) {
            const xCord = Phaser.Math.Between(400, 1900);
            const yCord = Phaser.Math.Between(20, 1060);
            const gem = this.add.image(xCord, yCord, 'gem1');
            gem.setScale(0.07);
            gem.setInteractive();
            this.gems.push(gem);

            // Pointer down event
            gem.on('pointerdown', () => {
                this.isGemClicked = true;
                this.selectedGem = gem;

                // Check if the pointer is still down after a short delay
                this.time.delayedCall(150, () => {
                    if (this.input.activePointer.isDown) {
                        this.isDrawingLine = true;
                        this.vectorLine.startDrawing(gem.x, gem.y);
                    } else {
                        // Remove the gem immediately if the pointer is not down
                        if (this.isGemClicked && !this.isDrawingLine && this.selectedGem) {
                            this.selectedGem.destroy();
                            // Remove the gem from the array
                            for (let counter = 0; counter < this.gems.length; counter++) {
                                if (this.gems[counter] === this.selectedGem) {
                                    this.gems.splice(counter, 1);
                                    break;
                                }
                            }
                            this.selectedGem = null;
                            this.isGemClicked = false;
                        }
                    }
                });
            });
        }
    }

    // Update Method
    update() {
        // If the pointer is down and the gem is clicked
        if (this.input.activePointer.isDown &&
            this.isGemClicked &&
            this.selectedGem) {
            this.vectorLine.onPointerMove(this.input.activePointer);

            const pointer = this.input.activePointer;
            let overlappingGem: Phaser.GameObjects.Image | null = null;

            // Check if the pointer is overlapping with another gem
            for (let counter = 0; counter < this.gems.length; counter++) {
                const gem = this.gems[counter];
                if (gem.getBounds().contains(
                    pointer.x, pointer.y
                ) && gem !== this.selectedGem) {
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
            }

            // Debugging: Log lockedLines
            console.log('Locked Lines:', this.vectorLine.lockedLines);

            // Check for line
            if (this.isLine(this.vectorLine.lockedLines)) {
                console.log('Line detected');
                this.clearGemsAndLines(this.vectorLine.lockedLines);
            }

            // Check for triangle
            if (this.isTriangle(this.vectorLine.lockedLines)) {
                console.log('Triangle detected');
                this.clearGemsAndLines(this.vectorLine.lockedLines);
            }
        }
    }

    /**
     * Check if the lines are valid.
     * 
     * @param lines The lines to check.
     * @returns True if the lines are valid, false otherwise.
     */
    private isLine(lines: { x1: number, y1: number, x2: number, y2: number }[]): boolean {
        return lines.length === 1 && (lines[0].x1 === lines[0].x2 || lines[0].y1 === lines[0].y2);
    }

    /**
     * Check if the lines form a triangle.
     * 
     * @param lines The lines to check.
     * @returns True if the lines form a triangle, false otherwise
     */
    private isTriangle(lines: { x1: number, y1: number, x2: number, y2: number }[]): boolean {
        if (lines.length !== 3) return false;
        const points = new Set(lines.flatMap(line => [`${line.x1},${line.y1}`, `${line.x2},${line.y2}`]));
        return points.size === 3;
    }

    /**
     * Clear the gems and lines that form a triangle.
     * 
     * @param lines The lines to check.
     */
    private clearGemsAndLines(lines: { x1: number, y1: number, x2: number, y2: number }[]) {
        // Clear the gems and lines
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
}
