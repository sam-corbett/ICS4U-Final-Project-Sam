/**
 * Main Menu Scene
 *
 * By: Sam Corbett
 * Version: 1.5
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
    // Load the back button
        this.load.image('back-button', 'assets/backButton.png');
    // Load the UI Sound
        this.load.audio('UI-sound', 'assets/sound/UI.mp3');
    // Load the playButtonSound Sound
        this.load.audio('playButtonSound', 'assets/sound/playButtonSound.mp3');
    }
    
    // Create Method
    create () {
        // Set the background image
        this.add.image(960, 540, 'mainMenu-bg');

        // Create the Play Button GameObject
        const playButton = this.add.image(1200, 840, 'play-button').setInteractive();
        playButton.setScale(1.5);

        // Set the Play Button to direct to the Game Scene
        playButton.on('pointerdown', () => {
            const mainMusic = (this.game as any).mainMusic;
            if (mainMusic) {
                mainMusic.stop();
            }
            this.sound.play('playButtonSound');
            this.scene.start('GameScene');
        });

        // Create the Back Button GameObject
        const backButton = this.add.image(800, 840, 'back-button').setInteractive();
        backButton.setScale(0.5);

        // Set the Back Button to direct to the Title Scene
        backButton.on('pointerdown', () => {
            this.sound.play('UI-sound');
            this.scene.start('TitleScreen');
        });
    }
}
