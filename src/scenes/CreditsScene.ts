/**
 * The Credits Scene
 *
 * By: Sam Corbett
 * Version: 1.5
 * Since: 2024/12/13
 */

// Import the Phaser Scene and GameObjects
import { Scene, GameObjects } from 'phaser';

// Create the mainMenu Scene
export class CreditsScene extends Scene {
    // Image Property
    image: GameObjects.Image;

    // Constructor
    constructor () {
        super('CreditsScene');
    }

    // Preload Method
    preload () {
    // Load the title image
        this.load.image('credits-bg', 'assets/creditsScene-bg.png');
    // Load the back button
        this.load.image('back-button', 'assets/backButton.png');
    // Load the UI Sound
        this.load.audio('UI-sound', 'assets/sound/UI.mp3');
    }
    
    // Create Method
    create () {
        // Set the background image
        this.add.image(960, 540, 'credits-bg');

        // Create the Back Button GameObject
        const backButton = this.add.image(960, 880, 'back-button').setInteractive();
        backButton.setScale(0.5);

        // Set the Back Button to direct to the Title Scene
        backButton.on('pointerdown', () => {
            this.sound.play('UI-sound');
            this.scene.start('TitleScreen');
        });
    }
}
