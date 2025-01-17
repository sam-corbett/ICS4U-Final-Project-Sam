/**
 * The Help Menu Scene when a play is 
 * stuck of what to do in the gameScene
 *
 * By: Sam Corbett
 * Version: 1.0
 * Since: 2025/1/17
 */

// Import the Phaser Scene and GameObjects
import { Scene, GameObjects } from 'phaser';

// Create the HelpMenu Scene
export class HelpMenu extends Scene {
    // Image Property
    image: GameObjects.Image;

    // Constructor
    constructor () {
        super('HelpMenu');
    }

    // Preload Method
    preload () {
    // Load the helpMenu image
        this.load.image('helpMenu-bg', 'assets/helpMenu-bg.png');
    // Load the back button
        this.load.image('back-button', 'assets/backButton.png');
    // Load the UI Sound
        this.load.audio('UI-sound', 'assets/sound/UI.mp3');
    }
    
    // Create Method
    create () {
        // Set the background image
        this.add.image(960, 540, 'helpMenu-bg');

        // Create the Back Button GameObject
        const backButton = this.add.image(960, 1000, 'back-button').setInteractive();
        backButton.setScale(0.5);

        // Set the Back Button to direct back to the Game Scene
        backButton.on('pointerdown', () => {
            this.sound.play('UI-sound');
            this.scene.start('MainMenu');
        });
    }
}
