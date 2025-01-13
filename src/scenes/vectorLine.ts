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
    public startPoint: { xCord: number, yCord: number } = { xCord: 0, yCord: 0 };
    public lines: { 
        x1: number, y1: number, 
        x2: number, y2: number 
    }[] = [];
    private line: Phaser.GameObjects.Line | null = null;

    // Constructor
    constructor(scene: Phaser.Scene) {
        super(scene, { lineStyle: { width: 4, color: 0xffffff } });
        scene.add.existing(this);

        this.isDrawing = false;
        this.isLocked = false;
    }

    // Start drawing the line
    public startDrawing(xCord: number, yCord: number) {
        this.isDrawing = true;
        this.isLocked = false;
        this.startPoint = { xCord, yCord };
    }

    // Lock the line
    public lockLine(xCord: number, yCord: number) {
        this.isLocked = true;
        this.lines.push({
            x1: this.startPoint.xCord,
            y1: this.startPoint.yCord,
            x2: xCord,
            y2: yCord
        });
    }

    public stopDrawing() {
        if (this.line) {
            this.line.destroy();
            this.line = null;
            this.isLocked = false;
        }
    }

    getLines() {
        return this.line;
    }

    // Update the line
    public onPointerMove(pointer: Phaser.Input.Pointer) {
        if (!this.isLocked) {
            const endPoint = { x: pointer.x, y: pointer.y };
            this.lines.push({
                x1: this.startPoint.xCord,
                y1: this.startPoint.yCord,
                x2: endPoint.x,
                y2: endPoint.y });
        }
    }

    // Finish drawing the line
    public update(pointer: Phaser.Input.Pointer) {
        if (this.isDrawing) {
            this.clear();
            this.lineStyle(4, 0xffffff);

            // Draw the locked lines
            for (let counter = 0;
                counter < this.lines.length;
                counter++
            ) {
                const line = this.lines[counter];
                this.lineBetween(line.x1, line.y1, line.x2, line.y2);
            }

            // Draw the current line
            let endX, endY;
            if (this.isLocked) {
                endX = this.startPoint.xCord;
                endY = this.startPoint.yCord;
            } else {
                endX = pointer.x;
                endY = pointer.y;
            }

            // Draw the line between the start and end points
            this.lineBetween(
                this.startPoint.xCord,
                this.startPoint.yCord,
                endX,
                endY
            );
        }
    }

    // Clear the line
    public clearLines() {
        this.isDrawing = false;
        this.isLocked = false;
        this.lines = [];
        super.clear();
    }
}