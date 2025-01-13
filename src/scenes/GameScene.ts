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
        // For loop to spawn the gems
        for (let counter = 0; counter < 4; counter++) {
            const xCord = Phaser.Math.Between(400, 1900);
            const yCord = Phaser.Math.Between(20, 1060);
            const gem = this.add.image(xCord, yCord, 'gem1');
            gem.setScale(0.07);
            gem.setInteractive();
            this.gems.push(gem);

            gem.on('pointerdown', () => {
                this.isGemClicked = true;
                this.selectedGem = gem;

                this.time.delayedCall(150, () => {
                    if (this.input.activePointer.isDown) {
                        this.vectorLine.startDrawing(gem.x, gem.y);
                    }
                });
            });
        }
    }

    // Update Method
    update() {
        if (this.input.activePointer.isDown && this.isGemClicked && this.selectedGem) {
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

            if (overlappingGem) {
                this.vectorLine.lockLine(overlappingGem.x, overlappingGem.y);
                this.isGemClicked = true;
                this.selectedGem = overlappingGem;
                this.vectorLine.startDrawing(overlappingGem.x, overlappingGem.y);
            }
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
    
            const lines = this.vectorLine.getLines();
    
            if (!this.selectedGem.getBounds().contains(endX, endY)) {
                this.vectorLine.stopDrawing();
                this.vectorLine.clearLines();
            } else if (lines) {
                if (Array.isArray(lines) && lines.length === 0) {
                    this.selectedGem.destroy();
                    this.gems = this.gems.filter(gem => gem !== this.selectedGem);
                } else if (Array.isArray(lines) && this.isTriangle(lines)) {
                    this.clearGemsAndLines(lines);
                } else if (Array.isArray(lines) && this.isTriangle(lines)) {
                    this.clearGemsAndLines(lines);
                } else {
                    this.vectorLine.clearLines();
                }
            }
            this.isGemClicked = false;
            this.selectedGem = null;
        }
    }

    // Method to check if the lines form a valid triangle
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

    // Method to check if a point is inside a triangle
    private isPointInTriangle(px: number, py: number, ax: number, ay: number, bx: number, by: number, cx: number, cy: number): boolean {
        const areaOrig = Math.abs((ax*(by-cy) + bx*(cy-ay) + cx*(ay-by))/2.0);
        const area1 = Math.abs((px*(ay-by) + ax*(by-py) + bx*(py-ay))/2.0);
        const area2 = Math.abs((px*(by-cy) + bx*(cy-py) + cx*(py-by))/2.0);
        const area3 = Math.abs((px*(cy-ay) + cx*(ay-py) + ax*(py-cy))/2.0);
        return (area1 + area2 + area3 === areaOrig);
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

        // Check if any gem is inside the triangle
        if (lines.length === 3) {
            const [line1, line2, line3] = lines;
            const [ax, ay] = [line1.x1, line1.y1];
            const [bx, by] = [line2.x1, line2.y1];
            const [cx, cy] = [line3.x1, line3.y1];

            this.gems = this.gems.filter(gem => {
                const isInTriangle = this.isPointInTriangle(gem.x, gem.y, ax, ay, bx, by, cx, cy);
                if (isInTriangle) {
                    gem.destroy(); // Destroy the gem if it is inside the triangle
                }
                return !isInTriangle; // Keep gems that are not inside the triangle
            });
        }

        // Clear the lines from the vectorLine object
        this.vectorLine.clearLines();
    }
}
