class gameOver extends Phaser.Scene {

    constructor() {
        super('gameOver');
    }

    // Adds the Game Over text
    create() {
        this.add.text(410, 420, 'Game Over', { fontSize: '70px', fill: '#ffffff' });
    }
}