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
    private vectorLine: vectorLine;
    private isGemClicked: boolean = false;
    private selectedGem: Phaser.GameObjects.Image | null = null;
    private gems: Phaser.GameObjects.Image[] = [];

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('gem1', 'assets/gem1.png');
    }

    create() {
        this.vectorLine = new vectorLine(this);
        this.spawnGems();

        this.input.on('pointerup', () => {
            if (this.vectorLine.isDrawing) {
                this.vectorLine.clearLines();
                this.isGemClicked = false;
                this.selectedGem = null;
            }
        });
    }

    private spawnGems() {
        for (let counter = 0; counter < 2; counter++) {
            const xCord = Phaser.Math.Between(400, 1900);
            const yCord = Phaser.Math.Between(20, 1060);
            const gem = this.add.image(xCord, yCord, 'gem1');
            gem.setScale(0.07);
            gem.setInteractive();
            this.gems.push(gem);

            gem.on('pointerdown', () => {
                this.isGemClicked = true;
                this.selectedGem = gem;
                this.vectorLine.startDrawing(gem.x, gem.y);
            });
        }
    }

    update() {
        if (this.input.activePointer.isDown && this.isGemClicked && this.selectedGem) {
            this.vectorLine.onPointerMove(this.input.activePointer);

            const pointer = this.input.activePointer;
            const overlappingGem = this.gems.find(
                gem => gem.getBounds().contains(pointer.x, pointer.y) && gem !== this.selectedGem
            );

            if (overlappingGem) {
                this.vectorLine.lockLine(overlappingGem.x, overlappingGem.y);
                this.isGemClicked = true;
                this.selectedGem = overlappingGem;
                this.vectorLine.startDrawing(overlappingGem.x, overlappingGem.y);
            }
        }
    }
}