/**
 * The class for the vector lines in the game.
 * 
 * By: Sam Corbett
 * Version: 1.5
 * Since: 2025/01/07
 */

import Phaser from 'phaser';

export class vectorLine extends Phaser.GameObjects.Graphics {
    // Properties
    public isDrawing: boolean;
    public isLocked: boolean;
    public startPoint: Phaser.Geom.Point;
    public lockedLines: { 
        x1: number, y1: number, 
        x2: number, y2: number 
    }[] = [];
    private line: Phaser.GameObjects.Line | null = null;
    private connectedGems: Phaser.GameObjects.Image[];

    // Constructor
    constructor(scene: Phaser.Scene) {
        super(scene, { lineStyle: { width: 4, color: 0xffffff } });
        scene.add.existing(this);

        this.startPoint = new Phaser.Geom.Point();
        this.isDrawing = false;
        this.isLocked = false;
        this.connectedGems = [];
    }

    // Start drawing the line
    public startDrawing(xCord: number, yCord: number) {
        this.isDrawing = true;
        this.isLocked = false;
        this.startPoint.setTo(xCord, yCord);
    }

    // Lock the line
    public lockLine(xCord: number, yCord: number) {
        this.isLocked = true;
        this.lockedLines.push({
            x1: this.startPoint.x,
            y1: this.startPoint.y,
            x2: xCord,
            y2: yCord
        });
        this.startPoint.setTo(xCord, yCord);
    }

    // Stop drawing the line
    public stopDrawing() {
        if (this.line) {
            this.line.destroy();
            this.line = null;
        }
    }

    // Get the line
    public getLines() {
        return this.line;
    }

    // Set the line opacity
    public setOpacity(opacity: number) {
        this.alpha = opacity;
    }

    // Get the connected gems
    public getConnectedGems() {
        return this.connectedGems;
    }

    // Add a connected gem
    public addConnectedGem(gem: Phaser.GameObjects.Image) {
        this.connectedGems.push(gem);
    }

    // Update the line
    public onPointerMove(pointer: Phaser.Input.Pointer) {
        this.update(pointer);
    }

    // Finish drawing the line
    public update(pointer: Phaser.Input.Pointer) {
        if (this.isDrawing) {
            this.clear();
            this.lineStyle(4, 0xffffff);

            // Draw the locked lines
            for (let counter = 0;
                counter < this.lockedLines.length;
                counter++
            ) {
                const line = this.lockedLines[counter];
                this.lineBetween(line.x1, line.y1, line.x2, line.y2);
            }

            // Draw the current line
            let endX, endY;
            if (this.isLocked) {
                endX = this.startPoint.x;
                endY = this.startPoint.y;
            } else {
                endX = pointer.x;
                endY = pointer.y;
            }

            // Draw the line between the start and end points
            this.lineBetween(
                this.startPoint.x,
                this.startPoint.y,
                endX,
                endY
            );
        }
    }

    // Clear the line
    public clearLines() {
        this.isDrawing = false;
        this.isLocked = false;
        this.lockedLines = [];
        super.clear();
    }
}