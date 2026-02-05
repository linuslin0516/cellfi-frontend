import { io } from 'socket.io-client';
import { SERVER_URL } from '../config';

/**
 * 網路管理器
 * 處理 Socket.io 連接和通訊
 */
class Network {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.playerId = null;
    this.roomId = null;
    this.roomType = null;

    // 回調函數
    this.onStateUpdate = null;
    this.onJoined = null;
    this.onError = null;
    this.onDeath = null;
    this.onCashOutComplete = null;
    this.onPlayerDeath = null;
    this.onEntryFeeInfo = null;
    this.onVerifying = null;
    this.onRecentWin = null;
  }

  /**
   * 連接到服務器
   */
  connect() {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupListeners();
    return this.socket;
  }

  /**
   * 設置事件監聽器
   */
  setupListeners() {
    const socket = this.socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      this.connected = true;
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.connected = false;
    });

    socket.on('joined', (data) => {
      console.log('Joined game:', data);
      this.playerId = data.playerId;
      this.roomId = data.roomId || null;
      this.roomType = data.roomType || null;
      if (this.onJoined) this.onJoined(data);
    });

    socket.on('state', (data) => {
      if (this.onStateUpdate) this.onStateUpdate(data);
    });

    socket.on('error', (data) => {
      console.error('Server error:', data);
      if (this.onError) this.onError(data);
    });

    socket.on('death', (data) => {
      console.log('You died!', data);
      if (this.onDeath) this.onDeath(data);
    });

    socket.on('cashoutComplete', (data) => {
      console.log('Cash out complete:', data);
      if (this.onCashOutComplete) this.onCashOutComplete(data);
    });

    socket.on('playerDeath', (data) => {
      if (this.onPlayerDeath) this.onPlayerDeath(data);
    });

    socket.on('upgradeSuccess', (data) => {
      console.log('Upgrade success:', data);
    });

    socket.on('cashoutStarted', (data) => {
      console.log('Cash out started:', data);
    });

    socket.on('cashoutCancelled', () => {
      console.log('Cash out cancelled');
    });

    socket.on('entryFeeInfo', (data) => {
      console.log('Entry fee info:', data);
      if (this.onEntryFeeInfo) this.onEntryFeeInfo(data);
    });

    socket.on('verifying', (data) => {
      console.log('Verifying payment:', data);
      if (this.onVerifying) this.onVerifying(data);
    });

    socket.on('recentWin', (data) => {
      if (this.onRecentWin) this.onRecentWin(data);
    });
  }

  /**
   * 加入遊戲 (訪客或開發模式)
   */
  join(address, name, signature = null) {
    if (!this.socket || !this.connected) {
      console.error('Not connected to server');
      return;
    }

    this.socket.emit('join', { address, name, signature });
  }

  /**
   * 使用付款加入遊戲 (錢包用戶 - 生產環境)
   * @param {string} address - 錢包地址
   * @param {string} name - 玩家名稱
   * @param {string} txHash - 入場費交易哈希
   */
  joinWithPayment(address, name, txHash) {
    if (!this.socket || !this.connected) {
      console.error('Not connected to server');
      return;
    }

    this.socket.emit('joinWithPayment', { address, name, txHash });
  }

  /**
   * 獲取入場費資訊
   */
  getEntryFeeInfo() {
    if (!this.socket || !this.connected) {
      console.error('Not connected to server');
      return;
    }

    this.socket.emit('getEntryFeeInfo');
  }

  /**
   * 發送移動指令
   */
  move(x, y) {
    if (!this.socket || !this.connected) return;
    this.socket.emit('move', { x, y });
  }

  /**
   * 購買升級
   */
  upgrade(type) {
    if (!this.socket || !this.connected) return;
    this.socket.emit('upgrade', { type });
  }

  /**
   * 開始 Cash Out
   */
  startCashOut() {
    if (!this.socket || !this.connected) return;
    this.socket.emit('cashoutStart');
  }

  /**
   * 取消 Cash Out
   */
  cancelCashOut() {
    if (!this.socket || !this.connected) return;
    this.socket.emit('cashoutCancel');
  }

  /**
   * 分裂
   */
  split() {
    if (!this.socket || !this.connected) return;
    this.socket.emit('split');
  }

  /**
   * 請求遊戲狀態
   */
  requestState() {
    if (!this.socket || !this.connected) return;
    this.socket.emit('getState');
  }

  /**
   * 斷開連接
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * 是否已連接
   */
  isConnected() {
    return this.connected;
  }
}

// 單例
const network = new Network();
export default network;
