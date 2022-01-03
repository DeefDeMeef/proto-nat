const config = {
  type: Phaser.AUTO,
  width: 1800,
  height: 900,
  parent: "game-container",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },

  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);
let cursors;
let player;
let showDebug = false;

function preload() {
  this.load.image(
    "tiles",
    "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/tilesets/tuxmon-sample-32px-extruded.png"
  );
  this.load.tilemapTiledJSON(
    "map",
    "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/tilemaps/tuxemon-town.json"
  );

  this.load.atlas(
    "atlas",
    "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.png",
    "https://mikewesthad.github.io/phaser-3-tilemap-blog-posts/post-1/assets/atlas/atlas.json"
  );
}

function create() {
  const map = this.make.tilemap({ key: "map" });
  const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

  const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
  const worldLayer = map.createLayer("World", tileset, 0, 0);
  const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);

  worldLayer.setCollisionByProperty({ collides: true });

  aboveLayer.setDepth(10);

  const spawnPoint = map.findObject("Objects", (obj) => obj.name === "Spawn Point");

  player = this.physics.add
    .sprite(spawnPoint.x, spawnPoint.y, "atlas", "misa-front")
    .setSize(30, 40)
    .setOffset(0, 24);

  this.physics.add.collider(player, worldLayer);

  const anims = this.anims;
  anims.create({
    key: "misa-left-walk",
    frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "misa-right-walk",
    frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "misa-front-walk",
    frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  anims.create({
    key: "misa-back-walk",
    frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  const camera = this.cameras.main;
  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  cursors = this.input.keyboard.createCursorKeys();

  this.input.keyboard.once("keydown-D", (event) => {
    this.physics.world.createDebugGraphic();

    const graphics = this.add.graphics().setAlpha(0.75).setDepth(20);
    worldLayer.renderDebug(graphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });
  });
}

// https://pablo.gg/en/blog/coding/i-made-a-top-down-game-version-of-my-blog-with-phaser-and-react/

function update(time, delta) {
  const speed = 175;
  const prevVelocity = player.body.velocity.clone();

  player.body.setVelocity(0);

  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed);
  }

  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed);
  }

  player.body.velocity.normalize().scale(speed);

  if (cursors.left.isDown) {
    player.anims.play("misa-left-walk", true);
  } else if (cursors.right.isDown) {
    player.anims.play("misa-right-walk", true);
  } else if (cursors.up.isDown) {
    player.anims.play("misa-back-walk", true);
  } else if (cursors.down.isDown) {
    player.anims.play("misa-front-walk", true);
  } else {
    player.anims.stop();

    if (prevVelocity.x < 0) player.setTexture("atlas", "misa-left");
    else if (prevVelocity.x > 0) player.setTexture("atlas", "misa-right");
    else if (prevVelocity.y < 0) player.setTexture("atlas", "misa-back");
    else if (prevVelocity.y > 0) player.setTexture("atlas", "misa-front");
  }
}
