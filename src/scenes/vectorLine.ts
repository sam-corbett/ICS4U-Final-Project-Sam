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
    private startPoint: Phaser.Geom.Point
    private endPoint: Phaser.Geom.Point
    private isDrawing: boolean


    // Constructor
    constructor (scene: Phaser.Scene) {
        super(scene, { lineStyle: { width: 4, color: 0xffffff } })
        scene.add.existing(this)

        // Set the properties
        this.startPoint = new Phaser.Geom.Point()
        this.endPoint = new Phaser.Geom.Point()
        this.isDrawing = false

        // Set the scene input properties
        scene.input.on('pointerdown',
            (pointer: Phaser.Input.Pointer) =>
                this.onPointerDown(pointer))
        scene.input.on('pointerup',
            () => this.onPointerUp())
        scene.input.on('pointermove',
            (pointer: Phaser.Input.Pointer) =>
                this.onPointerMove(pointer))
    }

    // Methods
    // The event when the pointer is down
    public onPointerDown (pointer: Phaser.Input.Pointer) {
        this.isDrawing = true
        this.startPoint.setTo(pointer.x, pointer.y)
    }

    // The event when the pointer is up
    public onPointerUp () {
        this.isDrawing = false
        this.clear()
    }

    // The event when the pointer is moving
    public onPointerMove (pointer: Phaser.Input.Pointer) {
        if (this.isDrawing) {
            this.endPoint.setTo(pointer.x, pointer.y)
            this.clear()
            this.strokeLineShape(new Phaser.Geom.Line(
                this.startPoint.x, this.startPoint.y,
                this.endPoint.x, this.endPoint.y))
        }
    }
}