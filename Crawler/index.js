const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1980;
canvas.height = 1080;
// Searching for last key clicked
let lastKey = '';
let turned = 'right'; // To track the last horizontal direction

window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true;
      lastKey = 'w';
      break;
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      turned = 'left'; // Update turned direction
      break;
    case 's':
      keys.s.pressed = true;
      lastKey = 's';
      break;
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      turned = 'right'; // Update turned direction
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }

  // Reset to idle image after movement stops
  if (
    !keys.w.pressed &&
    !keys.a.pressed &&
    !keys.s.pressed &&
    !keys.d.pressed
  ) {
    player.image =
      turned === 'right' ? player.sprites.idle : player.sprites.idleLeft;
    player.frames.max = 4;
  }
});
// Adjustment for boundaries collisions with player image
var leftOffsetX = 10;
var rightOffsetX = 28;
var upperOffsetY = 40;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 42) {
  collisionsMap.push(collisions.slice(i, 42 + i));
}
const boundaries = [];
const offset = {
  x: 200,
  y: -50,
};
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1251 || symbol === 1252) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
      // Shorter collision blocks with offsetY - 32 px
    } else if (symbol === 1253) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y - 32,
          },
        })
      );
    }
  });
});
const mapImage = new Image();
mapImage.src = './Images/Map-images/project_C_map_startingZone.png';
const foregroundImage = new Image();
foregroundImage.src =
  './Images/Map-images/project_C_map_startingZone-foregroundObjects.png';

const playerImage = new Image();
playerImage.src = '/Images/Knight-idle.png';

const playerImageLeft = new Image();
playerImageLeft.src = '/Images/Knight-idle-left.png';

const playerUpImage = new Image();
playerUpImage.src = '/Images/Knight-run-right.png';

const playerDownImage = new Image();
playerDownImage.src = '/Images/Knight-run-right.png';

const playerLeftImage = new Image();
playerLeftImage.src = '/Images/Knight-run-left.png';

const playerRightImage = new Image();
playerRightImage.src = '/Images/Knight-run-right.png';

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 320 / 4 / 2,
    y: canvas.height / 2 - 80 / 2,
  },
  image: playerImage,
  frames: {
    max: 4,
  },
  sprites: {
    idle: playerImage,
    idleLeft: playerImageLeft,
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
});
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: mapImage,
});
const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});
// Variables //
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};
const movables = [background, ...boundaries, foreground];
// Functions //
function rectangularCollision({ rect1, rect2 }) {
  return (
    rect1.position.x + leftOffsetX + rect1.width - rightOffsetX >=
      rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width - leftOffsetX &&
    rect1.position.y + upperOffsetY <= rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height >= rect2.position.y
  );
}
function animate() {
  requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  player.draw();
  foreground.draw();
  let moving = true;
  player.moving = false;
  if (keys.w.pressed && lastKey === 'w') {
    player.moving = true;
    player.image = turned === 'right' ? player.sprites.up : player.sprites.left;
    player.frames.max = 6;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y + 2 },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 2;
      });
  } else if (keys.a.pressed && lastKey === 'a') {
    player.moving = true;
    player.image = player.sprites.left;
    player.frames.max = 6;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: { x: boundary.position.x + 2, y: boundary.position.y },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 2;
      });
  } else if (keys.s.pressed && lastKey === 's') {
    player.moving = true;
    player.image =
      turned === 'right' ? player.sprites.down : player.sprites.left;
    player.frames.max = 6;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y - 2 },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 2;
      });
  } else if (keys.d.pressed && lastKey === 'd') {
    player.moving = true;
    player.image = player.sprites.right;
    player.frames.max = 6;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: { x: boundary.position.x - 2, y: boundary.position.y },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 2;
      });
  }
}

animate();
