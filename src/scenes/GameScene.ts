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

        // Pointer up event
        this.input.on('pointerup', () => {
            if (this.vectorLine.isDrawing) {
                this.vectorLine.clearLines();
                this.isGemClicked = false;
                this.selectedGem = null;
            }
        });
    }

    /**
     * Spawns the gems on the screen.
     * 
     * @returns void
     */
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
            // Check if the pointer is overlapping with another gem
            const overlappingGem = this.gems.find(
                gem => gem.getBounds().contains(
                    pointer.x, pointer.y
                ) && gem !== this.selectedGem
            );

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