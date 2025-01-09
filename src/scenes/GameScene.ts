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
    
        // Add event listener for pointerup
        this.input.on('pointerup', this.onPointerUp, this);
    
        // Pointer up event for single gem destruction
        this.input.on('pointerup', () => {
            console.log('Pointer up event triggered');
            console.log('Single gem destruction logic triggered');
            console.log('isGemClicked:', this.isGemClicked);
            console.log('isDrawingLine:', this.isDrawingLine);
            console.log('selectedGem:', this.selectedGem);
            if (this.isGemClicked && !this.isDrawingLine && this.selectedGem) {
                console.log('Single gem destruction logic triggered');
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
        if (this.isGemClicked) {
            // Flag to indicate if a shape has been detected
            let shapeDetected = false;

            // Check for triangle first
            if (this.isTriangle(this.vectorLine.lockedLines)) {
                console.log('Triangle detected');
                this.clearGemsAndLines(this.vectorLine.lockedLines);
                shapeDetected = true;
            }

            // Check for line if no triangle was detected
            if (!shapeDetected && this.isLine(this.vectorLine.lockedLines)) {
                console.log('Line detected');
                this.clearGemsAndLines(this.vectorLine.lockedLines);
            }

            // Reset the state
            this.isGemClicked = false;
            this.selectedGem = null;
        }
    }

    private isLine(lines: { x1: number, y1: number, x2: number, y2: number }[]): boolean {
        console.log('Checking if lines form a line:', lines);
        if (lines.length !== 1) return false;
        const line = lines[0];
        // Check if the line has two distinct points
        const isLine = (line.x1 !== line.x2 || line.y1 !== line.y2);
        console.log('isLine:', isLine);
        return isLine;
    }

    private isTriangle(lines: { x1: number, y1: number, x2: number, y2: number }[]): boolean {
        if (lines.length !== 3) return false;
        const points = new Set(lines.flatMap(line => [`${line.x1},${line.y1}`, `${line.x2},${line.y2}`]));
        if (points.size !== 3) return false;

        const pointArray = Array.from(points).map(point => point.split(',').map(Number));
        const [p1, p2, p3] = pointArray;

        const isConnected = (a: number[], b: number[]) => 
            lines.some(line => 
                (line.x1 === a[0] && line.y1 === a[1] && line.x2 === b[0] && line.y2 === b[1]) ||
                (line.x1 === b[0] && line.y1 === b[1] && line.x2 === a[0] && line.y2 === a[1])
            );

        return isConnected(p1, p2) && isConnected(p2, p3) && isConnected(p3, p1);
    }

    /**
     * Clear the gems and lines that form a line or triangle.
     * 
     * @param lines The lines to check.
     */
    private clearGemsAndLines(lines: { x1: number, y1: number, x2: number, y2: number }[]) {
        // Filter out gems that are part of the lines
        this.gems = this.gems.filter(gem => {
            const isGemInLine = lines.some(line => 
                (gem.x === line.x1 && gem.y === line.y1) || (gem.x === line.x2 && gem.y === line.y2)
            );
            if (isGemInLine) {
                gem.destroy(); // Destroy the gem if it is part of the lines
            }
            return !isGemInLine; // Keep gems that are not part of the lines
        });

        // Clear the lines from the vectorLine object
        this.vectorLine.clearLines();
    }
}
