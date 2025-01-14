/**
 * Main Menu Scene
 *
 * By: Sam Corbett
 * Version: 1.0
 * Since: 2024/12/13
 */

// Import the Phaser Scene and GameObjects
import { Scene, GameObjects } from 'phaser';

// Create the mainMenu Scene
export class MainMenu extends Scene
{
    // Image Property
    image: GameObjects.Image;

    // Constructor
    constructor () {
        super('MainMenu');
    }

    // Preload Method
    preload () {
    // Load the title image
        this.load.image('mainMenu-bg', 'assets/mainMenu-bg.png');
    // Load the play button
        this.load.image('play-button', 'assets/playButton.png');
    }
    
    // Create Method
    create () {
        // Set the background image
        this.add.image(960, 540, 'mainMenu-bg');

        // Create the Play Button GameObject
        const playButton = this.add.image(960, 440, 'play-button').setInteractive();

        // Set the Play Button to direct to the Game Scene
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
