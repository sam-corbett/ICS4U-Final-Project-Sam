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
                this.isDrawingLine = true;
                this.vectorLine.startDrawing(gem.x, gem.y);
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
            for (let i = 0; i < this.gems.length; i++) {
                const gem = this.gems[i];
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
        }
    }
}
