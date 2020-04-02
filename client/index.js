import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import RollButton from './components/RollButton';
import BarrageButton from './components/BarrageButton';
import Special from './components/Special';

import styles from './styles.css';
import { setTimeout } from 'timers';
const names = require('./names.js');

const WS_SERVER = 'ws://0.0.0.0:8081';
let ws = new WebSocket(WS_SERVER);

// console.log(ws)

class App extends Component {
  constructor(props) {
    super(props);
    this.wsInit();
    this.state = {
      isBoss: false,
      wsState: false,
      name: '???',
      isRolling: false,
      barrageInputValue: '',
      title: '',
      specialType: '',
      barrage: [],
    };
    this.index = 0;
    this.token = '';
  }

  wsInit = () => {
    ws.onopen = () => {
      this.setState({
        wsState: true,
      });
    };
    ws.onmessage = ({data}) => {
      // console.log('onmessage', data)
      try {
        const dataObj = JSON.parse(data);
        const {
          type,
          msg,
        } = dataObj;
        if (type === 'ACTION') {
          if (msg === 'WELCOME_BOSS') {
            this.setState({
              isBoss: true,
            });
            alert('欢迎老板！')
          } else if (msg === 'ROLL_START') {
            this.setState({
              isRolling: true,
            }, () => {
              this.roll();
            });
          } else if (msg === 'ROLL_STOP') {
            this.setState({
              isRolling: false,
            }, () => {
              this.setState({
                name: dataObj.name,
              });
            });
          } else if (msg === 'LATEST_STATE') {
            this.setState(dataObj.latestState);
            this.roll();
          } else if (msg === 'SHOW_SPECIAL_BUG') {
            this.setState({
              specialType: 'BUG',
            });
          } else if (msg === 'SHOW_SPECIAL_GOD') {
            this.setState({
              specialType: 'GOD',
            });
          } else if (msg === 'HIDE_SPECIAL') {
            this.setState({
              specialType: '',
            });
          }
        } else if (type === 'BARRAGE') {
          let barrage = this.state.barrage;
          if (barrage.length >= 8) {
            barrage = this.state.barrage.slice(-7);
          }
          barrage.push(msg);
          this.setState({
            barrage,
          });
        } else if (type === 'TITLE') {
          this.setState({
            title: msg,
          });
        }
        
      } catch (error) {
        // console.log(data);
        // console.log(error);
      }
    };
    ws.onclose = () => {
      // console.log('onclose');
      this.setState({
        wsState: false,
      }, () => {
        this.reConnect();
      });
    };
    ws.onerror = () => {
      // console.log('onerror');
      this.setState({
        wsState: false,
      });
    };
  }

  reConnect() {
    if (!this.state.wsState) {
      setTimeout(() => {
        ws = new WebSocket(WS_SERVER);
        this.wsInit();
      }, 1000);
    }
  }

  wsSendMsg(msg) {
    if (this.state.wsState) {
      ws.send(JSON.stringify({
        token: this.token,
        msg,
      }));
    }
  }

  onClickRollButton = () => {
    if (this.state.isRolling) {
      this.wsSendMsg('ROLL_STOP');
    } else {
      this.wsSendMsg('ROLL_START');
    }
  };

  roll = () => {
    setTimeout(() => {
      if (!this.state.isRolling) {
        return;
      }
      this.index += 1;

      if (this.index >= names.length) {
        this.index = 0;
      }

      this.setState({
        name: names[this.index],
      }, () => {
        this.roll();
      });
    }, 100);
  }

  onBarrageInputChange = (event) => {
    this.setState({
      barrageInputValue: event.target.value,
    });
  }
  onClickBarrageButton = () => {
    const value = this.state.barrageInputValue;
    if (!value) {
      return;
    }
    this.wsSendMsg(value);
    if (!this.state.isBoss) {
      this.token = value;
    }
    this.setState({
      barrageInputValue: '',
    });
  }

  render() {
    const {
      specialType,
      title,
    } = this.state;

    return (
      <div className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.h1}>便利蜂首家线上赌场</h1>
          {
            title ? (
              <h2 className={styles.h2}>{this.state.title}</h2>
            ) : null
          }
          {
            this.state.isBoss ? (
              <RollButton
                isRolling={this.state.isRolling}
                onClick={this.onClickRollButton}
              />
            ) : null
          }
          
        </header>
        <p className={styles.display}>{this.state.name}</p>
        {
          specialType ? (
            <Special type={specialType} />
          ) : null
        }
        
        <div className={styles.barrage}>
          <div>
            {
              this.state.barrage.map((item, index) => (
                <p key={index} className={styles.barrageItem}>{item}</p>
              ))
            }
          </div>
          <div className={styles.barrageCtr}>
            <input
              maxLength="140"
              className={styles.barrageInput}
              placeholder="一句话不说也不吼"
              onChange={this.onBarrageInputChange}
              value={this.state.barrageInputValue}
            />
            <BarrageButton
              disabled={!this.state.wsState}
              onClick={this.onClickBarrageButton}
            />
          </div>
        </div>
        <audio
          autoPlay
          loop
          muted={!this.state.isRolling}
          src="http://m10.music.126.net/20180204091648/91880f1bf14c871db785bb6688e8a34d/ymusic/d0a6/9b98/e66b/9af87545d3468170b948f42482b9f6a1.mp3"
        />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
