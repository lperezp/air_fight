let flight
let timeBullets = 400
let bullets
let time = 0
let enemies
let timer
let points
let life
let txtPoints
let txtLife


const game = new Phaser.Game(370, 550, Phaser.CANVAS, 'container')

const statePrincipal = {
    preload: function () {
        game.load.image('background', './img/space.png')
        game.load.image('flight', './img/nave.png')
        game.load.image('enemy', './img/pajaro2.png')
        game.load.image('laser', './img/laser.png')

    },
    create: function () {
        game.add.tileSprite(0, 0, 400, 540, 'background')
        game.physics.startSystem(Phaser.Physics.ARCADE)
        flight = game.add.sprite(game.width / 2, 485, 'flight')
        flight.anchor.setTo(0.5)
        game.physics.arcade.enable(flight, true)

        bullets = game.add.group();
        bullets.enableBody = true
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(20, 'laser')
        bullets.setAll('anchor.x', 0, 5)
        bullets.setAll('anchor.y', 1)
        bullets.setAll('outOfBoundsKill', true)
        bullets.setAll('checkWorldBounds', true)

        enemies = game.add.group();
        enemies.enableBody = true
        enemies.physicsBodyType = Phaser.Physics.ARCADE;
        enemies.createMultiple(20, 'enemy')
        enemies.setAll('anchor.x', 0, 5)
        enemies.setAll('anchor.y', 1)
        enemies.setAll('outOfBoundsKill', true)
        enemies.setAll('checkWorldBounds', true)

        timer = game.time.events.loop(2000, this.createEnemy, this)

        point = 0
        game.add.text(20, 20, 'Puntos:', { font: '14px Arial', fill: '#fff' })
        txtPoints = game.add.text(80, 20, '0', { font: '14px Arial', fill: '#fff' })

        life = 3
        game.add.text(310, 20, 'Vidas:', { font: '14px Arial', fill: '#fff' })
        textLife = game.add.text(360, 20, '3', { font: '14px Arial', fill: '#fff' })
    },
    update: function () {
        flight.rotation = game.physics.arcade.angleToPointer(flight) + Math.PI / 2;
        if (game.input.activePointer.isDown) {
            soundShoot.currentTime = 0
            soundShoot.play()
            this.shoot()
        }
        game.physics.arcade.overlap(bullets, enemies, this.collision, null, this)
        enemies.forEachAlive(function (m) {
            if (m.position.y > 520 && m.position.y > 521) {
                life -= 1;
            }
        });

        if (life === 0) {
            game.state.start('Terminado')
        }
    }, collision: function (bullet, enemy) {
        soundEnemy.currentTime = 0
        soundEnemy.play()
        bullet.kill();
        enemy.kill();
        points++;
        txtPoints.text = points
    },
    shoot: function () {
        if (game.time.now > time && bullets.countDead() > 0) {
            time = game.time.now + timeBullets;
            const bullet = bullets.getFirstDead();
            bullet.anchor.setTo(0.5)
            bullet.reset(flight.x, flight.y)
            game.physics.arcade.angleToPointer(bullet) + Math.PI / 2;
            game.physics.arcade.moveToPointer(bullet, 200)
        }
    },
    createEnemy: function () {
        const _enemies = enemies.getFirstDead()
        const num = Math.floor(Math.random() * 10 + 1)
        _enemies.reset(num * 38, 0)
        _enemies.anchor.setTo(0.5)
        _enemies.body.velocity.y = 100;
        _enemies.checkWorldBounds = true
        _enemies.outOfBoundsKill = true
    }
}

const loadSound = function (resource) {
    const sound = document.createElement("audio");
    sound.src = resource;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);
    return sound;
};

game.state.add('principal', statePrincipal);
game.state.start('principal');
const soundShoot = loadSound('./music/shoot.mp3')
const soundEnemy = loadSound('./music/dead_chicken.mp3')