// Declaring all the variables that will be used in the code
let score = 0;
let scoreCounter;
let player;
let enemy;
let enemyRNG;
let enemyAttackRNG;
let enemyIdling;
let enemyMoving;
let enemyAttacking;
let enemyAttackStarted;
let ground;
let platforms;
let arrows;
let moveKeys;
let spacebar;
let jump = false;
let dash = false;
let dashReady = true;
let immune = false;
let playerGettingHurt = false;
let playerHealth = 3;



class slash extends Phaser.Scene {



    constructor() {
        super('slash');
    }


    // Loading all the images and spritesheets that will be used
    preload() {
        // The sky was made by GAMER247 and can be found in this link: https://gamer247.itch.io/sky
        this.load.image('sky', 'assets/environment/sky.png');
        // The nature assets were made by Cainos and can be found this link: https://cainos.itch.io/pixel-art-slash-village-props
        this.load.image('ground', 'assets/environment/ground.png');
        this.load.image('platform1', 'assets/environment/platform1.png');
        this.load.image('platform2', 'assets/environment/platform2.png');
        this.load.image('tree1', 'assets/environment/tree1.png');
        this.load.image('tree2', 'assets/environment/tree2.png');
        // A 'for' logic to load all the different types of grass in less code
        for (let i = 1; i <= 6; i++) {
            this.load.image('grass' + i, 'assets/environment/grass' + i + '.png');
        };
        // The little dinossaur sprites were made by DemChing and ScissorMarks and can be found in this link: https://demching.itch.io/dino-family
        this.load.spritesheet('playerIdle', 'assets/olaf/base/idle.png', { frameWidth: 72, frameHeight: 72 });
        this.load.spritesheet('playerMove', 'assets/olaf/base/move.png', { frameWidth: 72, frameHeight: 72 });
        this.load.spritesheet('playerJump', 'assets/olaf/base/jump.png', { frameWidth: 72, frameHeight: 72 });
        this.load.spritesheet('playerAttack', 'assets/olaf/base/bite.png', { frameWidth: 72, frameHeight: 72 });
        this.load.spritesheet('playerDash', 'assets/olaf/base/dash.png', { frameWidth: 72, frameHeight: 72 });
        this.load.spritesheet('playerHurt', 'assets/olaf/base/hurt.png', { frameWidth: 72, frameHeight: 72 });
        this.load.spritesheet('playerDead', 'assets/olaf/base/dead.png', { frameWidth: 72, frameHeight: 72 });
        // The medieval knight sprites were made by Aamatniekss and can be found in this link: https://aamatniekss.itch.io/fantasy-knight-free-pixelart-animated-character
        this.load.spritesheet('enemyIdle', 'assets/enemy/_Idle.png', { frameWidth: 360, frameHeight: 240 });
        this.load.spritesheet('enemyMove', 'assets/enemy/_Run.png', { frameWidth: 360, frameHeight: 240 });
        this.load.spritesheet('enemyFall', 'assets/enemy/_Fall.png', { frameWidth: 360, frameHeight: 240 });
        this.load.spritesheet('enemyAttack1', 'assets/enemy/_AttackNoMovement.png', { frameWidth: 360, frameHeight: 240 });
        this.load.spritesheet('enemyAttack2', 'assets/enemy/_Attack2NoMovement.png', { frameWidth: 360, frameHeight: 240 });
        this.load.spritesheet('enemyAttackCombo', 'assets/enemy/_AttackComboNoMovement.png', { frameWidth: 360, frameHeight: 240 });
        this.load.spritesheet('enemyHit', 'assets/enemy/_Hit.png', { frameWidth: 360, frameHeight: 240 });
        // This was made by Blue Rose Sonata and can be found in this link: https://bluerosesonata.itch.io/free-blood-splatter-cgsfx
        // This was an attempt to make it scary somehow, but probably turned out pretty lame
        this.load.image('...', 'assets/environment/death.png')
    }



    create() {
        // Creating the environment the game takes place in
        this.add.image(600, 450, 'sky').setScale(3).setDepth(-10);
        ground = this.physics.add.staticImage(600, 835, 'ground');
        // A list so that all platforms can be referenced at once in the future
        platforms = [this.physics.add.staticImage(200, 300, 'platform1'),
        this.physics.add.staticImage(600, 600, 'platform2'),
        this.physics.add.staticImage(1050, 400, 'platform2')]
        // Creating the patches of grass in random positions on top os the platforms
        for (let i = 1; i <= 10; i++) {
            this.add.image(Phaser.Math.Between(1200, 0), 757, 'grass' + Phaser.Math.Between(1, 6));
        };
        for (let i = 1; i <= 2; i++) {
            this.add.image(Phaser.Math.Between(136, 264), 254, 'grass' + Phaser.Math.Between(1, 6));
        };
        for (let i = 1; i <= 3; i++) {
            this.add.image(Phaser.Math.Between(760, 440), 554, 'grass' + Phaser.Math.Between(1, 6));
        };
        for (let i = 1; i <= 3; i++) {
            this.add.image(Phaser.Math.Between(1200, 890), 354, 'grass' + Phaser.Math.Between(1, 6));
        };
        this.add.image(1050, 636, 'tree1').setDepth(-1);
        this.add.image(500, 433, 'tree1').setDepth(-1);
        this.add.image(900, 209, 'tree2').setDepth(-1).setFlipX(true);
        this.add.image(250, 612, 'tree2').setDepth(-1);

        // Setting up the text that shows the number of enemies killed
        scoreCounter = this.add.text(50, 50, 'Enemies killed: ' + score, { fontSize: '30px', fill: '#000000' });

        // Adding the enemy and its properties
        enemy = this.physics.add.sprite(600, 450).setScale(1);
        enemy.body.setSize(50, 90).setOffset(155, 150);
        enemy.setCollideWorldBounds(true);

        // Adding the player and its properties
        player = this.physics.add.sprite(200, 650).setScale(1);
        player.body.setSize(26, 44).setOffset(23, 15);
        player.setCollideWorldBounds(true);

        // Setting up all the colisions and overlaps
        this.physics.add.collider(player, ground);
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(enemy, ground);
        this.physics.add.collider(enemy, platforms);
        this.physics.add.overlap(player, enemy, () => {
            // In human language, this basically says that, if the player isn't immune at the moment, they should take damage, play the hurt animation and movement and be immune for a while, to prevent multiple damages at once
            if (!immune) {
                immune = true;
                playerGettingHurt = true;
                player.anims.play('playerHurt');
                // Player is thrown in a random direction 
                player.setVelocityX(Phaser.Utils.Array.GetRandom([-100, 100])).setVelocityY(-100).setAccelerationY(-800);
                this.time.delayedCall(600, () => {
                    player.setAccelerationY(0);
                });
                // Player takes damage but doesn't die
                if (playerHealth > 1) {
                    playerHealth -= 1
                    this.time.delayedCall(600, () => {
                        playerGettingHurt = false;
                        player.anims.play('playerIdle');
                    });
                    this.time.delayedCall(1200, () => {
                        immune = false;
                    });
                } // Player takes damage and dies
                else { 
                    this.time.delayedCall(600, () => {
                        player.anims.play('playerDead');
                        player.setVelocityX(0)
                    });
                    this.time.delayedCall(1600, () => {
                        this.scene.stop('slash');
                        this.scene.start('gameOver');
                    });
                }
            } // If the player is dashing during the overlap, the enemy dies and the score goes up by one
            else if (dash) { 
                enemy.x = Phaser.Math.Between(50, 1150);
                enemy.y = 50;
                score += 1;
                scoreCounter.setText('Enemies killed: ' + score)
                if (score > 4) {
                    this.add.image(600, 450, '...').setAlpha(0.4).setDepth(100).setScale(1.4)
                }
            }
        });

// Creating all the animations of the player and the enemy
        this.anims.create({
            key: 'playerIdle',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerMove',
            frames: this.anims.generateFrameNumbers('playerMove', { start: 0, end: 5 }),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerJump',
            frames: this.anims.generateFrameNumbers('playerJump', { start: 2, end: 2 }),
            frameRate: 1,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerDash',
            frames: this.anims.generateFrameNumbers('playerDash', { start: 1, end: 1 }),
            frameRate: 1,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerHurt',
            frames: this.anims.generateFrameNumbers('playerHurt', { start: 1, end: 3 }),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerDead',
            frames: this.anims.generateFrameNumbers('playerDead', { start: 1, end: 4 }),
            frameRate: 4,
            repeat: 0,
        });

        player.anims.play('playerIdle');



        this.anims.create({
            key: 'enemyIdle',
            frames: this.anims.generateFrameNumbers('enemyIdle', { start: 0, end: 9 }),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: 'enemyMove',
            frames: this.anims.generateFrameNumbers('enemyMove', { start: 0, end: 9 }),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: 'enemyFall',
            frames: this.anims.generateFrameNumbers('enemyFall', { start: 0, end: 2 }),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: 'enemyAttack1',
            frames: this.anims.generateFrameNumbers('enemyAttack1', { start: 0, end: 3 }),
            frameRate: 16,
            repeat: 0,
        });
        this.anims.create({
            key: 'enemyAttack2',
            frames: this.anims.generateFrameNumbers('enemyAttack2', { start: 0, end: 5 }),
            frameRate: 16,
            repeat: 0,
        });
        this.anims.create({
            key: 'enemyAttackCombo',
            frames: this.anims.generateFrameNumbers('enemyAttackCombo', { start: 0, end: 9 }),
            frameRate: 16,
            repeat: 0,
        });

        enemy.anims.play('enemyIdle')

        // Adding all the keys that the player can use
        arrows = this.input.keyboard.createCursorKeys();
        spacebar = this.keySpacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }



    update() {
        // First, the player logic:

        // If player tries to dash and nothing else is happening, then they dash
        if (!playerGettingHurt && Phaser.Input.Keyboard.JustDown(spacebar) && dashReady && (arrows.right.isDown || this.keyD.isDown || arrows.left.isDown || this.keyA.isDown || arrows.up.isDown || this.keyW.isDown || arrows.down.isDown || this.keyS.isDown)) {
            dash = true
        }

        // Adding what should happen during a dash, depending on what key the player is holding
        if (!playerGettingHurt && dash) {
            player.anims.play('playerDash', true);
            immune = true; // Makes player temporarily immune to damage
            dashReady = false; // Makes player unable to dash repeatedly
            if ((arrows.right.isDown || this.keyD.isDown) && (arrows.up.isDown || this.keyW.isDown)) {
                player.setVelocityX(800).setVelocityY(-800).setFlipX(false);
            }
            else if ((arrows.left.isDown || this.keyA.isDown) && (arrows.up.isDown || this.keyW.isDown)) {
                player.setVelocityX(-800).setVelocityY(-800).setFlipX(true);
            }
            else if ((arrows.right.isDown || this.keyD.isDown) && (arrows.down.isDown || this.keyS.isDown)) {
                player.setVelocityX(800).setVelocityY(800).setFlipX(false);
            }
            else if ((arrows.left.isDown || this.keyA.isDown) && (arrows.down.isDown || this.keyS.isDown)) {
                player.setVelocityX(-800).setVelocityY(800).setFlipX(true);
            }
            else if (arrows.right.isDown || this.keyD.isDown) {
                player.setVelocityX(1132).setVelocityY(0).setFlipX(false);
            }
            else if (arrows.left.isDown || this.keyA.isDown) {
                player.setVelocityX(-1132).setVelocityY(0).setFlipX(true);
            }
            else if (arrows.up.isDown || this.keyW.isDown) {
                player.setVelocityX(0).setVelocityY(-1132).setFlipX(false);
            }
            else if (arrows.down.isDown || this.keyS.isDown) {
                player.setVelocityX(0).setVelocityY(1132).setFlipX(false);
            }
            this.time.delayedCall(150, () => {
                dash = false; // Ends the dash
                immune = false;
                player.setVelocity(0);
            }, [], this);
            this.time.delayedCall(800, () => {
                dashReady = true; // Defines that the player is able to dash again
            }, [], this);

        } else if (!playerGettingHurt) {
            // Defines all the normal movement the player can perform dempending on what key is being held
            if (arrows.right.isDown || this.keyD.isDown) {
                player.setVelocityX(250).setFlipX(false);
                player.anims.play('playerMove', true);
            }
            else if (arrows.left.isDown || this.keyA.isDown) {
                player.setVelocityX(-250).setFlipX(true);
                player.anims.play('playerMove', true);
            }
            else {
                player.setVelocityX(0);
                player.anims.play('playerIdle', true);
            }

            
            if (!player.body.touching.down) {
                player.anims.play('playerJump', true);
            }

            // Adds the jump logic
            if ((arrows.up.isDown || this.keyW.isDown) && player.body.touching.down && !jump) {
                jump = true; // Makes it so that the player cannot jump in the air
                player.setVelocityY(-500);
            }
            else if (jump && player.body.velocity.y < -100 && !arrows.up.isDown && !this.keyW.isDown) {
                player.setVelocityY(-100); // Makes the jump's height up to the player to decide
                jump = false;
            }
            else if (player.body.velocity.y > -100) {
                jump = false;
            }
            else if (player.body.touching.down && jump === true) {
                jump = false; // This was added just in the off chance that the player bugs the game and manages to land before ending the jump.
            }
        }

        // Now, the enemy logic:

        // Enemy is always falling if not in contact with the ground
        if (!enemy.body.touching.down) {
            enemy.anims.play('enemyFall', true)
            enemyIdling = false;
            enemyMoving = false;
            enemyAttacking = false;
        } else {
            // Randomizing the enemy's decisions, those being to idle, to walk or to attack
            enemyRNG = Phaser.Math.Between(1, 3)
            if (!enemyMoving && !enemyIdling && !enemyAttacking) {
                enemyMoving = false;
                enemyIdling = false;
                enemyAttacking = false;

                if (enemyRNG === 1) {
                    enemyMoving = true;
                    enemy.setVelocityX(Phaser.Utils.Array.GetRandom([-250, 250]))
                    enemy.anims.play('enemyMove', true)
                    if (enemy.body.velocity.x >= 0) {
                        enemy.setFlipX(false)
                    } else {
                        enemy.setFlipX(true)
                    }
                    // Ends the movement after a random amount of time
                    this.time.delayedCall(Phaser.Math.Between(200, 1000), () => {
                        enemy.setVelocityX(0)
                        enemy.setFlipX(false)
                        enemyMoving = false
                        enemy.anims.play('enemyIdle', true)
                    }, [], this);

                } else if (enemyRNG === 2) {
                    enemyIdling = true;
                    enemy.anims.play('enemyIdle', true)
                    enemy.setVelocityX(0)
                    // Ends the idling after a random amount of time
                    this.time.delayedCall(Phaser.Math.Between(200, 1000), () => {
                        enemyIdling = false
                    }, [], this);

                } else {
                    enemyAttacking = true;
                    enemyAttackStarted = true;
                    if (enemyAttackStarted === true) {
                        enemyAttackStarted = false;
                        enemy.body.setSize(170, 90); // This resizing is used to simulate an attack, making it so that the player takes damage when in the attack's area
                        if (player.x >= enemy.x) {
                            enemy.setFlipX(false)
                            enemy.body.setOffset(155, 150);
                        } else {
                            enemy.setFlipX(true)
                            enemy.body.setOffset(40, 150);
                        }
                        // Randomizes which of the 3 different attacks the enemy will perform and defines their duration
                        enemyAttackRNG = Phaser.Math.Between(1, 3)
                        if (enemyAttackRNG === 1) {
                            enemy.anims.play('enemyAttack1', true)
                            this.time.delayedCall(300, () => {
                                enemy.body.setSize(50, 90).setOffset(155, 150);
                                enemyAttacking = false;
                            }, [], this);
                        }
                        else if (enemyAttackRNG === 2) {
                            enemy.anims.play('enemyAttack2', true)
                            this.time.delayedCall(400, () => {
                                enemy.body.setSize(50, 90).setOffset(155, 150);
                                enemyAttacking = false;
                            }, [], this);
                        }
                        else {
                            enemy.anims.play('enemyAttackCombo', true)
                            this.time.delayedCall(700, () => {
                                enemy.body.setSize(50, 90).setOffset(155, 150);
                                enemyAttacking = false;
                            }, [], this);
                        }
                    }
                }
            }
        }
    }
}