var isConnected = false;
var connectedChannel = '';
var jonnyEntrance = false;
var overallPercent = 0;
var channelPointModifier = 0;
var depletionRateModifier = 0;
var depetionTimer;
var c;
var ctx;
var rectangle;
var rectangleStart = 400;
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

console.log(channelPointModifier);

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
          connectedChannel = channel;
          document.getElementById('status').innerHTML = 'connected';
          document.getElementById('status').style.color = 'green';
          console.log('connected boy');
          // document.getElementById("connect_btn").style.background = "#32CD32"
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
    //9d0e9bf9-d2dc-4ed3-b4bc-c048c0a2794d
    console.log(channelPointModifier);
    if (
      message.tags['customRewardId'] === '9d0e9bf9-d2dc-4ed3-b4bc-c048c0a2794d'
    ) {
      addPoints();
    } else if (
      message.tags['username'] === 'jonnyhaull' &&
      jonnyEntrance === true
    ) {
      console.log('jonny');
      jonny();
    } else {
    }
  });
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
  }, 6000);
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
  ctx.rect(148, 118, 504, 67);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(400, 100);
  ctx.lineTo(400, 118);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(400, 184);
  ctx.lineTo(400, 202);
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
  ctx.clearRect(10, 90, 128, 128);
  var statusImage = document.getElementById('ceremorFaceChill');
  if (number >= -30 && number <= 30) {
    statusImage = document.getElementById('ceremorFaceChill');
  }
  if (number >= 31 && number <= 70) {
    statusImage = document.getElementById('ceremorFaceTense');
  }
  if (number >= 71 && number <= 100) {
    statusImage = document.getElementById('ceremorFaceCrazy');
  }

  ctx.drawImage(statusImage, 10, 90);
}

function fillRect(number) {
  //given percentage
  ctx.clearRect(150, rectanglePositionTop, 500, rectangleHeight);
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
  var rangeInput = document.getElementById('channelPointSlider');
  var depletionRateSlider = document.getElementById('depletionRateSlider');

  var channelPointsModifierLabel = document.getElementById(
    'channelPointsModifierLabel'
  );

  var depletionRateLabel = document.getElementById('depletionRateLabel');

  channelPointModifier = rangeInput.value * 2;
  channelPointsModifierLabel.innerHTML = `1,000 channel points is worth: ${channelPointModifier} %`;

  depletionRateModifier = depletionRateSlider.value;
  depletionRateLabel.innerHTML = `${depletionRateModifier}% will deplete every minute`;

  depletionTimer = setUpDepletion();

  rangeInput.addEventListener('mouseup', function () {
    channelPointModifier = rangeInput.value * 2;
    channelPointsModifierLabel.innerHTML = `1,000 channel points is worth: ${channelPointModifier} %`;
  });

  depletionRateSlider.addEventListener('mouseup', function () {
    depletionRateModifier = depletionRateSlider.value;
    depletionRateLabel.innerHTML = `${depletionRateModifier}% will deplete every minute`;
  });
}

function channelPointsAdd(number) {
  var channelPointToPercent = (number / 1000) * channelPointModifier;
  console.log(channelPointToPercent);
  addPercent(channelPointToPercent);
}

function channelPointsSub(number) {
  var channelPointToPercent = (number / 1000) * channelPointModifier;
  subtractPercent(channelPointToPercent);
}

function addPercent(number) {
  if (overallPercent + number > 100) {
    overallPercent = 100;
  } else {
    overallPercent += number;
    console.log(`overall percent: ${overallPercent}`);
    fillRect(overallPercent);
    drawPicture(overallPercent);
  }
}

function subtractPercent(number) {
  if (overallPercent - number < -100) {
    overallPercent = -100;
  } else {
    overallPercent -= number;
    console.log(overallPercent);
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

function PlaySound(passedSound) {
  var winSound = passedSound;
  console.log(winSound);
  winSound.volume = 0.5;
  winSound.play();
}
