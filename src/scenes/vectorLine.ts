/**
 * The code for the vector lines in the game.
 * 
 * By: Sam Corbett
 * Version: 1.0
 * Since: 2025/01/07
 */

import Phaser from 'phaser'

export class vectorLine extends Phaser.GameObjects.Line {
    // Properties
    private graphics: Phaser.GameObjects.Graphics;
    private isDrawing: boolean
    private startXCord: number;
    private startYCord: number;


    // Constructor
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene = scene 
        this.graphics = this.scene.add.graphics(
            { lineStyle: { width: 4, color: 0xffffff } }
        )
        scene.add.existing(this)

    }

    // Methods
    // The event when the pointer is down
    public startDrawing(xCord: number, yCord: number) {
        this.isDrawing = true;
        this.startXCord = xCord;
        this.startYCord = yCord;
    }

    // The event when the pointer is up
    public stopDrawing () {
        this.isDrawing = false
        this.graphics.clear()
    }

    // Update the line
    update() {
        if (this.isDrawing) {
            this.graphics.clear()
            this.graphics.lineBetween(
                this.startXCord,
                this.startYCord,
                this.scene.input.x,
                this.scene.input.y
            )
        }
    }
}