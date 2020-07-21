//just for connectTwitchChat
var isConnected = false;
//just for connectTwitchChat
var connectedChannel = '';
//shared ConnectTwitchChat and Jonny
var jonnyEntrance = false;
//shared ConnectTwitchChat and Chaos
var chaosEntrance = false;
// shared depletion addPercent and SubtractPercent
var overallPercent = 0;
// shared addPercent and SubtractPercent
var previousPercent = 0;
//setInitial channelPointsAdd and ChannelPointsSub
var channelPointModifier = { value: 0 };
//setInital and setUpDepletion
var depletionRateModifier = { value: 0 };
//setInital bitsAdd and bitsSubtract
var bitsModifier = { value: 0 };
//setInitial
var depetionTimer;
//setInitial and playsound
var lastSound;
//drawPicture setInitial and playSound
var soundActivate = false;
//showUserNAme, seupBox, setUpFill etc
var c;
var ctx;
//setupFill, Fillrect
var rectangleStart = 452;
var rectangleHeight = 60;
var rectanglePositionTop = 122;
var subsOnly = false;
const { chat, api } = new TwitchJs({
  log: { enabled: false },
});

//Move to new twitch file
function DisconnectTwitchChat() {
  chat.disconnect();
  document.getElementById('status').innerHTML = 'disconnected';
  document.getElementById('status').style.color = 'red';
}

//MOVED TO A NEW TWITCH FILE
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
      channelPointDecision(
        1000,
        clean_message,
        clean_username,
        message.tags['badgeInfo']
      );
    }
    if (
      message.tags['customRewardId'] === '46f5996e-bec3-407b-a3c3-3d1e782eb559'
    ) {
      channelPointDecision(
        10000,
        clean_message,
        clean_username,
        message.tags['badgeInfo']
      );
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
//V5 NEW
function subCheck(subscriber) {
  if (subscriber !== '') {
    return true;
  } else {
    return false;
  }
}

function channelPointDecision(pointNumber, message, username, subscriber) {
  var uppercaseMessage = message.toUpperCase();
  //CHECK SUB MODE HERE
  //V5 NEW
  //

  if (subsOnly === true) {
    if (subCheck(subscriber)) {
      if (
        uppercaseMessage.includes('EVIL') &&
        uppercaseMessage.includes('GOOD')
      ) {
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
  } else {
    if (
      uppercaseMessage.includes('EVIL') &&
      uppercaseMessage.includes('GOOD')
    ) {
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
}
//MOVED
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
//MOVED
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
//MOVED
function setUpCanvas() {
  setUpFill();
  drawPicture(0);
}
//MOVED
function showUserName(userName) {
  userNameUpper = userName.toUpperCase();
  c = document.getElementById('myCanvas');
  ctx = c.getContext('2d');
  ctx.fillRect(195, 55, 500, 50);
  ctx.font = '35px Monospace';
  ctx.textAlign = 'left';
  ctx.strokeStyle = 'white';
  ctx.strokeText(userNameUpper, 200, 90);
}
//MOVED
function setUpBox() {
  c = document.getElementById('myCanvas');
  ctx = c.getContext('2d');
  ctx.lineWidth = '4';
  if (subsOnly === true) {
    ctx.strokeStyle = '#9966cc';
  } else {
    ctx.strokeStyle = 'white';
  }

  ctx.rect(200, 118, 504, 67);
  ctx.stroke();

  //bitsImage = document.getElementById('bitsImage');
  //ctx.drawImage(bitsImage, 710, 115);

  ctx.beginPath();
  ctx.moveTo(452, 100);
  ctx.lineTo(452, 118);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(452, 184);
  ctx.lineTo(452, 202);
  ctx.stroke();
}
//MOVED
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
//MOVED
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
//MOVED
function fillRect(newNumber, previousNumber) {
  ctx.clearRect(202, rectanglePositionTop, 500, rectangleHeight);
  var rectangleBodyEnd = Math.round(newNumber * 2.5);
  var rectangleBodyStart = Math.round(previousNumber * 2.5);

  window.requestAnimationFrame(function loop() {
    if (rectangleBodyStart > rectangleBodyEnd) {
      if (rectangleBodyStart > rectangleBodyEnd + 15) {
        rectangleBodyStart -= 2;
      } else {
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
        rectangleBodyStart += 2;
      } else {
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

function setUpToggle() {
  var subsOnlyToggle = document.getElementById('subsOnlyCheckBox');
  if (subsOnlyToggle.checked) {
    subsOnly = true;
    setUpSubscribe();
  } else {
    subsOnly = false;
    setUpSubscribe();
  }

  subsOnlyToggle.addEventListener('change', function () {
    if (subsOnlyToggle.checked) {
      subsOnly = true;
      setUpSubscribe();
    } else {
      subsOnly = false;
      setUpSubscribe();
    }
    setUpBox();
  });
  setUpBox();
}

function setUpSubscribe() {
  c = document.getElementById('myCanvas');
  ctx = c.getContext('2d');
  if (subsOnly === true) {
    var subImage = document.getElementById('subscribe');
    ctx.drawImage(subImage, 198, 187);
  } else {
    ctx.clearRect(198, 187, 200, 40);
  }
}
//MOVED
function setInitial() {
  setUpToggle();
  setUpCanvas();
  setUpSubscribe();
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
//MOVED
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
