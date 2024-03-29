class Main extends Phaser.Scene {

    // This function essentially loads things into our game
    //В функції preload() завантажимо всі ресурси на нашу сцену:
    preload() {
        this.load.spritesheet('plane', 'assets/planesheet.png', { frameWidth: 96, frameHeight: 83 });
        this.load.image('pipe', 'assets/pipe.png');
        this.load.audio('jump', 'assets/jump.wav');

    }

    //  it runs once at the beginning of the game and
    //  allows the user to place the things that they’ve preloaded with preload() and
    //  create objects within our game such as animations, collision detectors, text, groups, and much more
    create() {
        //Додаємо літак на сцену
        this.plane = this.physics.add.sprite(69, 69, 'plane')
        //Масштабуємо літак
        this.plane.setScale(0.70, 0.70);
        //Встановлюємо опорну точку літака
        this.plane.setOrigin(0, 0.5);


        // Створимо анімацію
        this.anims.create({
            key: "planeAnimation",
            frames: this.anims.generateFrameNumbers('plane', { frames: [0, 1, 3, 2] }),
            frameRate: 10,
            repeat: -1
        });
        this.plane.play("planeAnimation");

        this.plane.body.gravity.y = 1000;

        //створимо об’єкт
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Створимо текстовий напис для рахунку (функція create()):
        this.score = 0;
        this.labelScore = this.add.text(20, 20, "0", { fontSize: 24, color: "black" });
        this.score = 0;
        this.labelScore = this.add.text(40, 40, "0", { fontSize: 24, color: "black" });

        //Створимо труби. Ідея полягає в тому, що кожна труба буде створюватись циклічно через кожні 1.5 секунди. Додаємо групу фізичних об’єктів та обробляємо циклічну подію:
        this.pipes = this.physics.add.group();

        this.timedEvent = this.time.addEvent({
            delay: 1500,
            callback: this.addRowOfPipes, //Цю функцію реалізуємо на наступному кроці
            callbackScope: this,
            loop: true
        });
    
        
        
        }
    }

    // While preload() and create() run only once at the start of the game, update() runs constantly.
    update() 
    {
        // В функції update() зробимо нахил літака на кут 20, а також перезапустимо гру, якщо літак вилетить за межі сцени:
        if (this.plane.angle < 20) {
            this.plane.angle += 1;
        }

        if (this.plane.y < 0 || this.plane.y > 800) {
            this.scene.restart();
            // jump
            (this.spaceBar.isDown)
            {
                this.jump();
            }
        }



        //
        jump()
        {
            this.tweens.add({
                targets: this.plane,
                angle: -20,
                duration: 100,
                repeat: 1
            });
            this.plane.body.velocity.y = -350;
        }
        //Функція для створення блоку труби
        addOnePipe(x, y)
        {
            var pipe = this.physics.add.sprite(x, y, 'pipe');
            pipe.setOrigin(0, 0);
            this.pipes.add(pipe);
            pipe.body.velocity.x = -300;

            pipe.collideWorldBounds = true;
            pipe.outOfBoundsKill = true;
        }
        //Функція створення труби (стовпчик блоків)
        addRowOfPipes()
        {
            var hole = Math.floor(Math.random() * 5) + 1;
            this.score += 1;
            this.labelScore.text = this.score;
            for (var i = 0; i < 8; i++) {
                if (!(i >= hole && i <= hole + 2))
                    this.addOnePipe(400, i * 60 + 10);
            }
        }

    }
// Зіткнення
this.physics.add.overlap(this.plane, this.pipes, this.hitPipe, null, this);




    //Створимо файл game.js, задамо для нашої гри конфігурацію та створимо новий об’єкт Гри з конфігурацією нашої сцени:
    const config = {
        type: Phaser.AUTO,
        width: 400,
        height: 490,
        scene: Main, // Цю сцену ми створимо на 4-му кроці
        backgroundColor: '#71c5cf',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 }
            }
        }
    };

    const game = new Phaser.Game(config);
