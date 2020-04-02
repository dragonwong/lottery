# Lottery

年会抽奖神器

现已支持：

- websocket 多屏同步
- 弹幕
- 管理员登录
- 已中奖者不再参与后续抽奖

## 开始

### 安装依赖

```bash
npm install
```

### 开启服务

```bash
# 开启客户端程序
npm start
# 开启服务端程序
npm run server
```

### 修改名单

- 抽奖名单：`./server/names.json`
- 展示名单：`./client/names.js` （可以实现展示的人，但抽不到他（一般是老板））

### 多用户模式

需修改 `lottery/client/index.js` 中的 `WS_SERVER` 为本机的 IP 地址

## 使用

- 用户端界面底部弹幕输入框输入 `9998877` 进入管理员模式
- 点击开始按钮开始抽奖，点击结束按钮结束抽奖
- 输入 `清空名单` 重置已中奖名单
- 输入其它任意字符修改页面子标题
