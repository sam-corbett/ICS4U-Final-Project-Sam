/**
 * The Title Screen Scene
 *
 * By: Sam Corbett
 * Version: 1.0
 * Since: 2024/12/13
 */

// Import the Phaser Scene and GameObjects
import { Scene, GameObjects } from 'phaser';

// Create the ShowImage Scene
export class TitleScreen extends Scene {
    // Image Property
    private image: GameObjects.Image;

    // Constructor
    constructor () {
        super('TitleScreen');
    }

    // Preload Method
    preload () {
    // Load the title image
        this.load.image('title-bg', 'assets/titleScreen-bg.jpg');
    // Load the JewelBondz Logo
        this.load.image('jewelbondz-logo', 'assets/jewelbondz-logo.png');
    // Load the Start Button
        this.load.image('start-button', 'assets/startButton.png');
    // Load the Credits Button
        this.load.image('credits-button', 'assets/creditsButton.png');
    // Load the Main Music
        this.load.audio('mainMusic', 'assets/sound/mainMusic.mp3');
    }
    
    // Create Method
    create () {
        // Set the background image
        this.add.image(960, 540, 'title-bg');

        // Create the Jewel Bondz Image GameObject
        this.image = this.add.image(960, 540, 'jewelbondz-logo');
        this.image.setOrigin(0.5, 0.5);

        // Create the Start Button GameObject
        const startButton = this.add.image(800, 940, 'start-button').setInteractive();
        startButton.setScale(0.5);

        // Set the Start Button to direct to the mainMenu Scene
        startButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        // Create the Credits Button GameObject
        const creditsButton = this.add.image(1120, 940, 'credits-button').setInteractive();
        creditsButton.setScale(0.5);

        // Set the Credits Button to direct to the Credits Scene
        creditsButton.on('pointerdown', () => {
            this.scene.start('CreditsScene');
        });

        // Play the Main Menu Music
        if(!this.sound.get('mainMusic')) {
            const mainMusic = this.sound.add('mainMusic', { loop: true });
            mainMusic.play();
            (this.game as any).mainMusic = mainMusic;
        }
    }
}
