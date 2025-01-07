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
        // Create the gem
        let gem = this.add.image(960, 540, 'gem1');
        gem.setInteractive();

        // Set the gem properties
        gem.on('pointerdown', () => this.onGemPointerDown(gem));
    }

    private onGemPointerDown (gem: Phaser.GameObjects.Image) {
        // Set the gem properties
        gem.setTint(0xff0000);
    }

    // Update method
    update () {
        // Check if the pointer is down
        if (this.input.activePointer.isDown)
        {
            this.vectorLine.onPointerMove(this.input.activePointer);
        }
    }
}
