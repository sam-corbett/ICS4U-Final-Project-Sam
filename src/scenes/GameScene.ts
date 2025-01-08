/**
 * The game scene. (WIP)
 * 
 * By: Sam Corbett
 * Version: 0.2
 * Since: 2025/01/07
 */

import { Scene } from 'phaser';
import { vectorLine } from './vectorLine';

export class GameScene extends Scene {

    camera: Phaser.Cameras.Scene2D.Camera;
    private vectorLine: vectorLine;
    private isGemClicked: boolean = false;
    private selectedGem: Phaser.GameObjects.Image | null = null;
    private gems: Phaser.GameObjects.Image[] = [];

    // Constructor
    constructor () {
        super({ key: 'GameScene'});
    }

    // Preload method
    preload () {
        // Load the first gem
        this.load.image('gem1', 'assets/gem1.png');
    }

    // Create method
    create () {
        this.camera = this.cameras.main
        this.vectorLine = new vectorLine(this);
        this.spawnGems();
    }

    /**
     * Spawns 2 gems on the screen in random coordinates.
     * 
     * @returns void
     */
    private spawnGems () {
        for (let counter = 0; counter < 2; counter++) {
            const xCord = Phaser.Math.Between(400, 1900);
            const yCord = Phaser.Math.Between(20, 1060);
            const gem = this.add.image(xCord, yCord, 'gem1');
            gem.setScale(0.07);
            gem.setInteractive();
            this.gems.push(gem);
        

        // Add pointerdown event to the gem.
            gem.on('pointerdown', () => {
                this.isGemClicked = true;
                this.selectedGem = gem;
                this.vectorLine.startDrawing(gem.x, gem.y);
            });
        }
    }

    // Update method
    update () {
        // Check if the pointer is down for vector line and gem is clicked
        if (this.input.activePointer.isDown && this.isGemClicked && this.selectedGem) {
            this.vectorLine.onPointerMove(this.input.activePointer);

            // Check if the pointer is over another gem
            const pointer = this.input.activePointer;
            const overlappingGem = this.gems.find(
                gem => gem.getBounds().contains(
                    pointer.x, pointer.y
                ) && gem !== this.selectedGem);

            if (overlappingGem) {
                this.vectorLine.lockLine(
                    overlappingGem.x, overlappingGem.y
                );
                this.isGemClicked = false;
                this.selectedGem = null;
            }
        }

        // Handle pointer up event
        this.input.on('pointerup', () => {
            if (this.vectorLine.isDrawing &&
                !this.vectorLine.isLocked) {
                this.vectorLine.clear();
                this.isGemClicked = false;
                this.selectedGem = null;
            }
        });
    }
}