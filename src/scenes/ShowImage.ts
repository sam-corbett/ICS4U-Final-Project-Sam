/**
 * Hello World Scene
 *
 * By: Sam Corbett
 * Version: 1.0
 * Since: 2024/12/13
 */

// Import the Phaser Scene and GameObjects
import { Scene, GameObjects } from 'phaser';

// Create the ShowImage Scene
export class ShowImage extends Scene
{
    // Image Property
    image: GameObjects.Image;

    // Constructor
    constructor () {
        super('ShowImage');
    }

    // Preload Method
    preload () {
    // Load the JewelBondz Logo
        this.load.image('jewelbondz-logo', 'assets/jewelbondz-logo.png');
    }
    
    // Create Method
    create () {
        // Create an Image GameObject
        this.image = this.add.image(960, 540, 'jewelbondz-logo');
        this.image.setOrigin(0.5, 0.5);
    }
}
