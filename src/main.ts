/**
 * The main container for all scenes
 *
 * By: Sam Corbett
 * Version: 1.0
 * Since: 2024/12/13
 */

// Scenes
import Phaser from 'phaser';
import { TitleScreen } from './scenes/TitleScreen';
import { CreditsScene } from './scenes/CreditsScene';
import { MainMenu } from './scenes/MainMenu';
import { GameScene } from './scenes/GameScene';
import { HelpMenu } from './scenes/HelpMenu';

// Phaser
import { Game, Types } from "phaser";

// Game Configuration
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#00007d',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [TitleScreen, MainMenu, GameScene, CreditsScene, HelpMenu],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

export default new Game(config);
