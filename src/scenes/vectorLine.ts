/**
 * The code for the vector lines in the game.
 * 
 * By: Sam Corbett
 * Version: 1.0
 * Since: 2025/01/07
 */

import Phaser from 'phaser';

export class vectorLine extends Phaser.GameObjects.Graphics {
    public isDrawing: boolean;
    public isLocked: boolean;
    private startPoint: Phaser.Geom.Point;

    constructor(scene: Phaser.Scene) {
        super(scene, { lineStyle: { width: 4, color: 0xffffff } });
        scene.add.existing(this);

        this.startPoint = new Phaser.Geom.Point();
        this.isDrawing = false;
        this.isLocked = false;
    }

    public startDrawing(xCord: number, yCord: number) {
        this.isDrawing = true;
        this.isLocked = false;
        this.startPoint.setTo(xCord, yCord);
    }

    public lockLine(xCord: number, yCord: number) {
        this.isLocked = true;
        this.startPoint.setTo(xCord, yCord);
    }

    public onPointerMove(pointer: Phaser.Input.Pointer) {
        this.update(pointer);
    }

    public update(pointer: Phaser.Input.Pointer) {
        if (this.isDrawing) {
            this.clear();
            let endX, endY;

            if (this.isLocked) {
                endX = this.startPoint.x;
                endY = this.startPoint.y;
            } else {
                endX = pointer.x;
                endY = pointer.y;
            }

            this.lineBetween(this.startPoint.x, this.startPoint.y, endX, endY);
        }
    }

    public clearLines() {
        this.isDrawing = false;
        this.isLocked = false;
        super.clear();
    }
}