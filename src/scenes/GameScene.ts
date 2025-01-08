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
        

        // Add pointerdown event to the gem.
        gem.on('pointerdown', () => {
            if (this.isGemClicked) {
                this.vectorLine.lockLine(xCord, yCord);
            } else {
                this.isGemClicked = true;
                this.vectorLine.startDrawing(xCord, yCord);
            }
        });

        // Add pointerup event to the input manager to 
        // stop drawing when clicking anywhere.
        this.input.on('pointerup', () => {
            this.vectorLine.stopDrawing();
        });
        // Add the gem to the gems array
        this.gems.push(gem);
    }
}

    // Update method
    update () {
        this.vectorLine.update();
    }
}