/**
 * The main container for all scenes
 *
 * By: Sam Corbett
 * Version: 1.0
 * Since: 2024/12/13
 */

// Scenes
import { HelloWorld } from './scenes/HelloWorld';

// Phaser
import { Game, Types } from "phaser";

// Game Configuration
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#00007d',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        HelloWorld
    ]
};

export default new Game(config);
