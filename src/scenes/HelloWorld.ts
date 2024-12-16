/**
 * Hello World Scene
 *
 * By: Sam Corbett
 * Version: 1.0
 * Since: 2024/12/13
 */

// Import the Phaser Scene and GameObjects
import { Scene, GameObjects } from 'phaser';

// Create the HelloWorld Scene
export class HelloWorld extends Scene
{
    // Title Property
    title: GameObjects.Text;

    // Constructor
    constructor () {
        super('HelloWorld');
    }

    // Create Method
    create () {
        // Create the Title (Hello, World!)
        this.title = this.add.text(512, 384, 'Hello, World!', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#028af8', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
    }
}
