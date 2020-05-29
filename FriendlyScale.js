var isConnected = false;
var connectedChannel = '';
var jonnyEntrance = false;
var chaosEntrance = false;
var overallPercent = 0;
var channelPointModifier = 0;
var depletionRateModifier = 0;
var bitsModifier = 0;
var depetionTimer;
var lastSound;
var soundActivate = false;
var c;
var ctx;
var rectangle;
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
  // Connect to Twitch
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

    //console.log(message.tags['customRewardId']);

    //1000 points 17a85bbf-e287-44d2-a88e-27cfc0edb649
    //10000 points 46f5996e-bec3-407b-a3c3-3d1e782eb559

    if ('bits' in message) {
      bitDecision(message.bits, clean_message);
    }
    if (
      message.tags['customRewardId'] === '17a85bbf-e287-44d2-a88e-27cfc0edb649'
    ) {
      channelPointDecision(1000, clean_message);
    }
    if (
      message.tags['customRewardId'] === '46f5996e-bec3-407b-a3c3-3d1e782eb559'
    ) {
      channelPointDecision(10000, clean_message);
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

function channelPointDecision(pointNumber, message) {
  var uppercaseMessage = message.toUpperCase();

  if (uppercaseMessage.includes('EVIL') && uppercaseMessage.includes('GOOD')) {
    channelPointsAdd(pointNumber);
  } else if (uppercaseMessage.includes('GOOD')) {
    channelPointsSub(pointNumber);
  } else if (uppercaseMessage.includes('EVIL')) {
    channelPointsAdd(pointNumber);
  }
}

function bitDecision(bitNumber, message) {
  var uppercaseMessage = message.toUpperCase();

  if (uppercaseMessage.includes('EVIL') && uppercaseMessage.includes('GOOD')) {
    bitsAdd(bitNumber);
  } else if (uppercaseMessage.includes('GOOD')) {
    bitsSubtract(bitNumber);
  } else if (uppercaseMessage.includes('EVIL')) {
    bitsAdd(bitNumber);
  }
}

function setUpDepletion() {
  return setInterval(function () {
    if (overallPercent > 0) {
      if (overallPercent < depletionRateModifier) {
        subtractPercent(overallPercent);
      } else {
        subtractPercent(depletionRateModifier);
      }
    }
    if (overallPercent < 0) {
      if (-Math.abs(depletionRateModifier) < overallPercent) {
        subtractPercent(overallPercent);
      } else {
        subtractPercent(-Math.abs(depletionRateModifier));
      }
    }
  }, 60000);
}

function setUpCanvas() {
  setUpBox();
  setUpFill();
  drawPicture(0);
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

function fillRect(number) {
  ctx.clearRect(202, rectanglePositionTop, 500, rectangleHeight);
  var rectangleBody = number * 2.5;
  ctx.fillRect(
    rectangleStart,
    rectanglePositionTop,
    rectangleBody,
    rectangleHeight
  );
}

function setInitial() {
  setUpCanvas();
  winSound = document.getElementById('emptySound');
  lastSound = document.getElementById('emptySound');
  soundActivate = false;
  var rangeInput = document.getElementById('channelPointSlider');
  var depletionRateSlider = document.getElementById('depletionRateSlider');
  var bitsModiferSlider = document.getElementById('bitsModifierSlider');

  var channelPointsModifierLabel = document.getElementById(
    'channelPointsModifierLabel'
  );

  var depletionRateLabel = document.getElementById('depletionRateLabel');
  var bitsModifierLabel = document.getElementById('bitsModifierLabel');

  channelPointModifier = rangeInput.value;
  channelPointsModifierLabel.innerHTML = `1,000 channel points is worth: ${channelPointModifier} %`;

  depletionRateModifier = depletionRateSlider.value;
  depletionRateLabel.innerHTML = `${depletionRateModifier}% will deplete every minute`;

  bitsModifier = bitsModiferSlider.value;
  bitsModifierLabel.innerHTML = `100 bits (1$) is worth: ${bitsModifier} %`;

  depletionTimer = setUpDepletion();

  rangeInput.addEventListener('mouseup', function () {
    channelPointModifier = rangeInput.value;
    channelPointsModifierLabel.innerHTML = `1,000 channel points is worth: ${channelPointModifier} %`;
  });

  depletionRateSlider.addEventListener('mouseup', function () {
    depletionRateModifier = depletionRateSlider.value;
    depletionRateLabel.innerHTML = `${depletionRateModifier}% will deplete every minute`;
  });

  bitsModiferSlider.addEventListener('mouseup', function () {
    bitsModifier = bitsModiferSlider.value;
    bitsModifierLabel.innerHTML = `100 bits (1$) is worth: ${bitsModifier} %`;
  });
}

function bitsAdd(number) {
  var bitsToPercent = (number / 100) * bitsModifier;
  addPercent(Math.round(bitsToPercent));
}
function bitsSubtract(number) {
  var bitsToPercent = (number / 100) * bitsModifier;
  subtractPercent(Math.round(bitsToPercent));
}

function channelPointsAdd(number) {
  var channelPointToPercent = (number / 1000) * channelPointModifier;
  addPercent(channelPointToPercent);
}

function channelPointsSub(number) {
  var channelPointToPercent = (number / 1000) * channelPointModifier;
  subtractPercent(channelPointToPercent);
}

function addPercent(number) {
  if (overallPercent + number > 100) {
    overallPercent = 100;
    fillRect(overallPercent);
    drawPicture(overallPercent);
  } else {
    overallPercent += number;
    fillRect(overallPercent);
    drawPicture(overallPercent);
  }
}

function subtractPercent(number) {
  if (overallPercent - number < -100) {
    overallPercent = -100;
    fillRect(overallPercent);
    drawPicture(overallPercent);
  } else {
    overallPercent -= number;
    fillRect(overallPercent);
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
