const config = 
    {
        type: Phaser.AUTO,
        width: 1200,
        height: 900,

        physics: 
        {
            default: 'arcade',
            arcade: 
            {
                gravity:  { y: 1000 },
                debug: true,
            }
        },

        scene: [menu,slash,gameOver]

    };

    const game = new Phaser.Game(config);  