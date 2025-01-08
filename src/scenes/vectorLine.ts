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
    public isDrawing: boolean;
    public isLocked: boolean;
    private startPoint: Phaser.Geom.Point;

    // Constructor
    constructor(scene: Phaser.Scene) {
        super(scene, { lineStyle: { width: 4, color: 0xffffff } });
        scene.add.existing(this);

        // Initialize the properties
        this.startPoint = new Phaser.Geom.Point();
        this.isDrawing = false;
        this.isLocked = false;
    }

    // The event when the pointer is down
    public startDrawing(xCord: number, yCord: number) {
        this.isDrawing = true;
        this.isLocked = false;
        this.startPoint.setTo(xCord, yCord);
    }

    // The event when the line is locked at a gem's position
    public lockLine(xCord: number, yCord: number) {
        this.isLocked = true;
        this.startPoint.setTo(xCord, yCord);
    }

    // The event when the pointer is moving
    public onPointerMove(pointer: Phaser.Input.Pointer) {
        this.update(pointer);
    }

    // Update the line
    public update(pointer: Phaser.Input.Pointer) {
        if (this.isDrawing) {
            this.clear();
            let endX, endY;

            // If the line is locked, the end point is the same as the start point
            if (this.isLocked) {
                endX = this.startPoint.x;
                endY = this.startPoint.y;
            } else {
                // Else, the end point is the current pointer position
                endX = pointer.x;
                endY = pointer.y;
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

    public clearLines() {
        this.isDrawing = false;
        this.isLocked = false;
        super.clear();
    }
}