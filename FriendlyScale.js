var isConnected = false;
var connectedChannel = '';
var jonnyEntrance = false;
var chaosEntrance = false;
var overallPercent = 0;
var previousPercent = 0;
var channelPointModifier = { value: 0 };
var depletionRateModifier = { value: 0 };
var bitsModifier = { value: 0 };
var depetionTimer;
var lastSound;
var soundActivate = false;
var c;
var ctx;
var rectangleStart = 452;
var rectangleHeight = 60;
var rectanglePositionTop = 122;

const { chat, api } = new TwitchJs({
  log: { enabled: false },
});

function DisconnectTwitchChat() {
  chat.disconnect();
  document.getElementById('status').innerHTML = 'disconnected';
  document.getElementById('status').style.color = 'red';
}

function ConnectTwitchChat() {
  const channel = 'ceremor';
  chat
    .connect()
    .then(() => {
      chat
        .join(channel)
        .then(() => {
          isConnected = true;
          jonnyEntrance = true;
          chaosEntrance = true;
          connectedChannel = channel;
          document.getElementById('status').innerHTML = 'connected';
          document.getElementById('status').style.color = 'green';
          console.log('connected boy');
        })
        .catch(function (err) {
          console.log(err);
          document.getElementById('status').innerHTML =
            'Error: Edgar fucked up';
          document.getElementById('status').style.color = 'red';
        });
    })
    .catch(function (err) {
      console.log(err);
      document.getElementById('status').innerHTML =
        'Error: Cant connect right now';
      document.getElementById('status').style.color = 'red';
    });

  chat.on('*', (message) => {
    var clean_message = DOMPurify.sanitize(message.message, {
      ALLOWED_TAGS: ['b'],
    });

    var clean_username = DOMPurify.sanitize(message.username, {
      ALLOWED_TAGS: ['b'],
    });

    if ('bits' in message) {
      bitDecision(message.bits, clean_message, clean_username);
    }
    if (
      message.tags['customRewardId'] === '17a85bbf-e287-44d2-a88e-27cfc0edb649'
    ) {
      channelPointDecision(1000, clean_message, clean_username);
      console.log(message.username);
    }
    if (
      message.tags['customRewardId'] === '46f5996e-bec3-407b-a3c3-3d1e782eb559'
    ) {
      channelPointDecision(10000, clean_message, clean_username);
    }
    if (message.tags['username'] === 'jonnyhaull' && jonnyEntrance === true) {
      jonny();
    } else if (
      message.tags['username'] === 'chaosshield' &&
      chaosEntrance === true
    ) {
      chaos();
    }
  });
}

function channelPointDecision(pointNumber, message, username) {
  var uppercaseMessage = message.toUpperCase();

  if (uppercaseMessage.includes('EVIL') && uppercaseMessage.includes('GOOD')) {
    channelPointsAdd(pointNumber);
    showUserName(username);
  } else if (uppercaseMessage.includes('GOOD')) {
    channelPointsSub(pointNumber);
    showUserName(username);
  } else if (uppercaseMessage.includes('EVIL')) {
    channelPointsAdd(pointNumber);
    showUserName(username);
  }
}

function bitDecision(bitNumber, message, username) {
  var uppercaseMessage = message.toUpperCase();
  if (uppercaseMessage.includes('EVIL') && uppercaseMessage.includes('GOOD')) {
    bitsAdd(bitNumber);
    showUserName(username);
  } else if (uppercaseMessage.includes('GOOD')) {
    bitsSubtract(bitNumber);
    showUserName(username);
  } else if (uppercaseMessage.includes('EVIL')) {
    bitsAdd(bitNumber);
    showUserName(username);
  }
}

function setUpDepletion() {
  return setInterval(function () {
    if (overallPercent > 0) {
      if (overallPercent < depletionRateModifier.value) {
        subtractPercent(overallPercent);
      } else {
        subtractPercent(depletionRateModifier.value);
      }
    }
    if (overallPercent < 0) {
      if (-Math.abs(depletionRateModifier.value) < overallPercent) {
        subtractPercent(overallPercent);
      } else {
        subtractPercent(-Math.abs(depletionRateModifier.value));
      }
    }
  }, 60000);
}

function setUpCanvas() {
  setUpBox();
  setUpFill();
  drawPicture(0);
}

function showUserName(userName) {
  userNameUpper = userName.toUpperCase();
  c = document.getElementById('myCanvas');
  ctx = c.getContext('2d');
  ctx.clearRect(195, 60, 500, 40);
  ctx.font = '35px Monospace';
  ctx.textAlign = 'left';
  ctx.strokeText(userNameUpper, 200, 95);
}

function setUpBox() {
  c = document.getElementById('myCanvas');
  ctx = c.getContext('2d');
  ctx.lineWidth = '4';
  ctx.strokeStyle = 'lightgrey';
  ctx.rect(200, 118, 504, 67);
  ctx.stroke();

  bitsImage = document.getElementById('bitsImage');
  ctx.drawImage(bitsImage, 710, 115);

  ctx.beginPath();
  ctx.moveTo(452, 100);
  ctx.lineTo(452, 118);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(452, 184);
  ctx.lineTo(452, 202);
  ctx.stroke();
}

function setUpFill() {
  c = document.getElementById('myCanvas');
  ctx = c.getContext('2d');
  var grd = ctx.createLinearGradient(150, 0, 650, 0);

  grd.addColorStop(0, '#5353ff');
  grd.addColorStop(0.2, '#48fff6');
  grd.addColorStop(0.4, '#d6f8ff');
  grd.addColorStop(0.6, '#fff7b2');
  grd.addColorStop(0.8, '#ffa21e');
  grd.addColorStop(1, '#ff0000');
  ctx.fillStyle = grd;
  ctx.fillRect(rectangleStart, rectanglePositionTop, 0, rectangleHeight);
}

function drawPicture(number) {
  c = document.getElementById('myCanvas');
  ctx = c.getContext('2d');
  ctx.clearRect(5, 30, 192, 192);
  var statusImage = document.getElementById('ceremorFaceChill');
  if (number >= -30 && number <= 30) {
    statusImage = document.getElementById('ceremorFaceChill');
    var emptySound = document.getElementById('emptySound');
    if (soundActivate === false) {
    } else {
      PlaySound(emptySound);
    }
  }
  if (number >= 31 && number <= 70) {
    statusImage = document.getElementById('ceremorFaceTense');
  }
  if (number >= 71 && number <= 100) {
    statusImage = document.getElementById('ceremorFaceCrazy');
    var evilSound = document.getElementById('evilSound');
    PlaySound(evilSound);
  }
  if (number <= -31 && number >= -70) {
    statusImage = document.getElementById('ceremorFaceLove');
  }
  if (number <= -71 && number >= -100) {
    statusImage = document.getElementById('ceremorFaceAngel');
    var goodSound = document.getElementById('goodSound');
    PlaySound(goodSound);
  }

  ctx.drawImage(statusImage, 5, 30);
}

function fillRect(newNumber, previousNumber) {
  ctx.clearRect(202, rectanglePositionTop, 500, rectangleHeight);
  var rectangleBodyEnd = Math.round(newNumber * 2.5);
  var rectangleBodyStart = Math.round(previousNumber * 2.5);

  window.requestAnimationFrame(function loop() {
    if (rectangleBodyStart > rectangleBodyEnd) {
      if (rectangleBodyStart > rectangleBodyEnd + 15) {
        console.log('faster');
        rectangleBodyStart -= 2;
      } else {
        console.log('slower');
        rectangleBodyStart -= 1;
      }
      ctx.clearRect(202, rectanglePositionTop, 500, rectangleHeight);
      ctx.fillRect(
        rectangleStart,
        rectanglePositionTop,
        rectangleBodyStart,
        rectangleHeight
      );
      window.requestAnimationFrame(loop);
    } else if (rectangleBodyStart < rectangleBodyEnd) {
      if (rectangleBodyStart < rectangleBodyEnd - 15) {
        console.log('faster');
        rectangleBodyStart += 2;
      } else {
        console.log('slower');
        rectangleBodyStart += 1;
      }
      ctx.clearRect(202, rectanglePositionTop, 500, rectangleHeight);
      ctx.fillRect(
        rectangleStart,
        rectanglePositionTop,
        rectangleBodyStart,
        rectangleHeight
      );
      window.requestAnimationFrame(loop);
    } else if (rectangleBodyEnd === rectangleBodyStart) {
      ctx.clearRect(202, rectanglePositionTop, 500, rectangleHeight);
      ctx.fillRect(
        rectangleStart,
        rectanglePositionTop,
        rectangleBodyEnd,
        rectangleHeight
      );
    }
  });
}

function setInitial() {
  setUpCanvas();

  winSound = document.getElementById('emptySound');
  lastSound = document.getElementById('emptySound');
  soundActivate = false;
  setUpSlider(
    'channelPointModifierSlider',
    'channelPointModifierLabel',
    '1,000 channel points is worth:',
    channelPointModifier
  );
  setUpSlider(
    'depletionRateSlider',
    'depletionRateLabel',
    'Depletion rate per minute:',
    depletionRateModifier
  );
  setUpSlider(
    'bitsModifierSlider',
    'bitsModifierLabel',
    '100 bits ($1) is worth:',
    bitsModifier
  );

  depletionTimer = setUpDepletion();
}

function setUpSlider(sliderName, labelName, labelMessage, modifier) {
  var slider = document.getElementById(sliderName);
  var label = document.getElementById(labelName);
  modifier.value = slider.value;
  label.innerHTML = `${labelMessage} ${modifier.value} %`;
  slider.addEventListener('mouseup', function () {
    modifier.value = slider.value;
    label.innerHTML = `${labelMessage} ${modifier.value} %`;
  });
}

function bitsAdd(number) {
  var bitsToPercent = (number / 100) * bitsModifier.value;
  addPercent(Math.round(bitsToPercent));
}
function bitsSubtract(number) {
  var bitsToPercent = (number / 100) * bitsModifier.value;
  subtractPercent(Math.round(bitsToPercent));
}

function channelPointsAdd(number) {
  var channelPointToPercent = (number / 1000) * channelPointModifier.value;
  addPercent(channelPointToPercent);
}

function channelPointsSub(number) {
  var channelPointToPercent = (number / 1000) * channelPointModifier.value;
  subtractPercent(channelPointToPercent);
}

function addPercent(number) {
  previousPercent = overallPercent;
  if (overallPercent + number > 100) {
    overallPercent = 100;
    fillRect(overallPercent, previousPercent);
    drawPicture(overallPercent);
  } else {
    overallPercent += number;
    fillRect(overallPercent, previousPercent);
    drawPicture(overallPercent);
  }
}

function subtractPercent(number) {
  previousPercent = overallPercent;
  if (overallPercent - number < -100) {
    overallPercent = -100;
    fillRect(overallPercent, previousPercent);
    drawPicture(overallPercent);
  } else {
    overallPercent -= number;
    fillRect(overallPercent, previousPercent);
    drawPicture(overallPercent);
  }
}

function jonny() {
  var intro = document.getElementById('jonnyintro');
  intro.volume = 0.4;
  intro.play();
  jonnyEntrance = false;
}

function chaos() {
  var intro = document.getElementById('chaosLaugh');
  intro.volume = 0.2;
  intro.play();
  chaosEntrance = false;
}

function PlaySound(passedSound) {
  var lastSoundId = lastSound['id'];

  if (lastSoundId !== passedSound['id']) {
    winSound.pause();
    winSound = passedSound;
    winSound.load();
    if (passedSound['id'] !== 'emptySound') {
      winSound.volume = 0.4;
      winSound.play();
    }
    lastSound = passedSound;
    soundActivate = true;
  }
}
