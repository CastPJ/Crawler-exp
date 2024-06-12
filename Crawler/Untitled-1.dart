let idleInterval;
let idleAnimationStart;

function startIdleAnimation() {
  clearInterval(idleInterval); // clear before each use
  clearInterval(idleAnimationStart);

  let framesCounter = 0;
  idleInterval = setInterval(() => {
    framesCounter++;
    console.log('klatka');

    if (framesCounter >= 4) {
      clearInterval(idleInterval);
      console.log('Zakończona animacja');
    }
  }, 1000);

  idleAnimationStart = setInterval(() => {
    console.log('Początek animacji');
    startIdleAnimation();
  }, 6000);
}

function clearIdleAnimation() {
  clearInterval(idleInterval);
}



startIdleAnimation();
else {
    clearIdleAnimation();