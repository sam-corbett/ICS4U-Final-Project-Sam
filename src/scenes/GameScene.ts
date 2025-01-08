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
    private gem: Phaser.GameObjects.Image;
    private isGemClicked: boolean = false;

    // Constructor
    constructor () {
        super({ key: 'GameScene'});
    }

    // Preload method
    preload () {
        // Load the first gem
        this.load.image('gem1', 'assets/gem1.png');
    }
    create () {
        this.camera = this.cameras.main
        this.vectorLine = new vectorLine(this);
        this.spawnGem();
    }

    private spawnGem () {
        this.gem = this.add.image(960, 540, 'gem1');
        this.gem.setScale(0.07);
        this.gem.setInteractive();

        // Add pointerdown event to the gem
        this.gem.on('pointerdown', () => {
            this.isGemClicked = true;
        });

        // Add pointerup event to the input manager to reset the flag when clicking anywhere
        this.input.on('pointerup', () => {
            this.isGemClicked = false;
        });
    }

    // Update method
    update () {
        // Check if the pointer is down for vector line and gem is clicked
        if (this.input.activePointer.isDown && this.isGemClicked) {
            this.vectorLine.onPointerMove(this.input.activePointer);
        } else {
            this.vectorLine.onPointerUp();
        }
    }
}