/**
 * The code for the vector lines in the game.
 * 
 * By: Sam Corbett
 * Version: 1.0
 * Since: 2025/01/07
 */

import Phaser from 'phaser'

export class vectorLine extends Phaser.GameObjects.Graphics {
    // Properties
    private startPoint: Phaser.Geom.Point;
    private isDrawing: boolean
    private isLocked: boolean

    // Constructor
    constructor(scene: Phaser.Scene) {
        super(scene, { lineStyle: { width: 4, color: 0xffffff } });
        scene.add.existing(this);

        // Initialize the properties
        this.startPoint = new Phaser.Geom.Point();
        this.isDrawing = false;
        this.isLocked = false;
    }

    // Methods
    // The event when the pointer is down
    public startDrawing(xCord: number, yCord: number) {
        this.isDrawing = true;
        this.isLocked = false;
        this.startPoint.setTo(xCord, yCord);
    }

    // The event when the line is locked a gem's position
    // while the point is still down
    public lockLine(xCord: number, yCord: number) {
        this.isLocked = true;
        this.startPoint.setTo(xCord, yCord);
    }

    // The event when the pointer is up
    public stopDrawing () {
        this.isDrawing = false;
        this.isLocked = false;
        this.clear();
    }

    // Update the line
    update() {
        if (this.isDrawing) {
            this.clear();
            let endX, endY
            
            // If the line is locked, the end point is 
            // the same as the start point
            if (this.isLocked) {
                endX = this.startPoint.x;
                endY = this.startPoint.y;
            // Else, the end point is the current pointer position
            } else {
                endX = this.scene.input.activePointer.x;
                endY = this.scene.input.activePointer.y;
            }
            
            // Draw the line
            this.lineBetween(
                this.startPoint.x,
                this.startPoint.y,
                endX,
                endY
            );
        }
    }
}