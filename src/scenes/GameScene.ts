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
        this.gem.setScale(0.25);
        this.gem.setInteractive();
        this.gem.setInteractive();

        // Set the gem properties
        this.gem.on('pointerdown', () => this.onGemPointerDown(this.gem));
    }

    private onGemPointerDown (gem: Phaser.GameObjects.Image) {
        // Set gem tint when pointer is down
        if (this.input.activePointer.isDown) {
            gem.setTint(0xffffff);
        } else {
            gem.clearTint();
        }
    }

    // Update method
    update () {
        // Check if the pointer is down for vector line
        if (this.input.activePointer.isDown) {
            this.vectorLine.onPointerMove(this.input.activePointer);
            if (this.gem) {
                this.gem.setTint(0xffffff);
            }
        } else {
            this.vectorLine.onPointerUp();
            if (this.gem) {
                this.gem.clearTint();
            }
        }
    }
}
