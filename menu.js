// Innicializes the variable
let startButton;

class menu extends Phaser.Scene {

    constructor() {
        super('menu');
    }

    preload() {
        // This button was made by Gowl and can be found in this link: https://gowldev.itch.io/ui-buttons-scrolling-bars-pixel-art
        // Loads the start button
        this.load.image('startButton', 'assets/environment/button.png');
    }

    create() {
        // Adds the button to the screen
        startButton = this.add.image(600, 450, 'startButton').setInteractive().setDepth(1);
        // Adds a black background
        this.add.rectangle(600, 450, 1200, 900, 0x000000).setDepth(0);

        // When button is pressed, start the game
        startButton.on('pointerdown', () => {
            game.scene.stop('menu');
            game.scene.start('slash');
        });

        // Adds the text that tells the player the basic controls
        this.add.text(50, 50,
            'Controls:\n' +
            'Arrows or WASD to move\n' +
            'Spacebar to dash\n' +
            '(If you dash on an enemy, the enemy dies\n' +
            'and you get a point!)\n' + 
            '\n' + 
            'you only have 3 HP, so be careful', 
            { fontSize: '40px', fill: '#ffffff' });
    }
}