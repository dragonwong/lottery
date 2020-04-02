const WebSocket = require('ws');
const fs = require('fs');

const PSWD = '9998877';
let luckyDogs = [];

const wss = new WebSocket.Server({
  port: 8081,
});

console.log('running...')

// Broadcast to all.
wss.broadcast = function(data) {
  console.log(`[broadcast] ${wss.clients.size}`);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const latestState = {
  title: '',
  name: '???',
  isRolling: false,
}

wss.on('connection', function connection(ws) {
  function send({
    type,
    msg,
    isBroadcast = true,
    ...other
  }) {
    const str = JSON.stringify({
      type,
      msg,
      ...other
    });
    if (isBroadcast) {
      wss.broadcast(str);
    } else {
      ws.send(str);
    }
  }
  
  console.log(`[connect]`);

  send({
    type: 'ACTION',
    msg: 'LATEST_STATE',
    latestState,
    isBroadcast: false,
  });

  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);
      const {
        msg,
        token,
      } = data;
      if (msg === PSWD) {
        send({
          type: 'ACTION',
          msg: 'WELCOME_BOSS',
          isBroadcast: false,
        });
      } else if (token === PSWD) {
        if (msg === 'ROLL_START') {
          latestState.isRolling = true;
          send({
            type: 'ACTION',
            msg: 'ROLL_START',
          });
        } else if (msg === 'ROLL_STOP') {
          const luckyDog = lottery();

          latestState.isRolling = false;
          latestState.name = luckyDog;
          send({
            type: 'ACTION',
            msg: 'ROLL_STOP',
            name: luckyDog,
          });
        } else if (msg === '清空名单') {
          luckyDogs = [];
        } else if (msg === '展示克星') {
          send({
            type: 'ACTION',
            msg: 'SHOW_SPECIAL_BUG',
          });
        } else if (msg === '展示修仙') {
          send({
            type: 'ACTION',
            msg: 'SHOW_SPECIAL_GOD',
          });
        } else if (msg === '展示关闭') {
          send({
            type: 'ACTION',
            msg: 'HIDE_SPECIAL',
          });
        } else {
          latestState.title = msg;
          send({
            type: 'TITLE',
            msg,
          });
        }
      } else {
        send({
          type: 'BARRAGE',
          msg,
        });
      }

      console.log(`[receive] msg: ${msg}, token: ${token}`);
    } catch (error) {
      console.log(error);
    }
  });
  ws.on('error', () => console.log('errored'));
});

function lottery() {
  const namesFile = fs.readFileSync('./server/names.json', 'utf-8');
  let name = '';
  let names = [];
  try {
    names = JSON.parse(namesFile);
    const index = Math.floor(Math.random() * names.length);
    name = names[index];
  } catch (error) {
    console.log(error);
    return;
  }

  const luckyDogsLength = luckyDogs.length;
  const namesLength = names.length;

  if (luckyDogsLength >= namesLength) {
    console.log('all luckyDogs!!!');
    luckyDogs = [];
  }

  if (luckyDogs.includes(name)) {
    return lottery();
  } else {
    luckyDogs.push(name);
    console.log(`[luckyDogs/all] ${luckyDogs.length}/${namesLength}`);
    return name;
  }
}
