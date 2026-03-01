/**
 * 輸入管理器
 * 處理滑鼠和鍵盤輸入
 */
class Input {
  constructor(canvas, renderer) {
    this.canvas = canvas;
    this.renderer = renderer;

    // 滑鼠位置 (世界座標)
    this.mouseX = 0;
    this.mouseY = 0;

    // 按鍵狀態
    this.keys = {};

    // Cash Out 按鍵
    this.cashOutKey = 'KeyC';
    this.cashOutPressed = false;
    this.cashOutPressTime = 0;

    // 分裂按鍵 (防止重複觸發)
    this.splitPressed = false;

    // 回調函數
    this.onMove = null;
    this.onCashOutStart = null;
    this.onCashOutCancel = null;
    this.onSplit = null;

    this.setupListeners();
  }

  /**
   * 設置事件監聽器
   */
  setupListeners() {
    // 滑鼠移動
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      // 轉換為世界座標
      const world = this.renderer.screenToWorld(screenX, screenY);
      this.mouseX = world.x;
      this.mouseY = world.y;

      if (this.onMove) {
        this.onMove(this.mouseX, this.mouseY);
      }
    });

    // 觸控移動 (手機支援)
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const screenX = touch.clientX - rect.left;
      const screenY = touch.clientY - rect.top;

      const world = this.renderer.screenToWorld(screenX, screenY);
      this.mouseX = world.x;
      this.mouseY = world.y;

      if (this.onMove) {
        this.onMove(this.mouseX, this.mouseY);
      }
    });

    // 鍵盤按下
    document.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Cash Out 按鍵
      if (e.code === this.cashOutKey && !this.cashOutPressed) {
        this.cashOutPressed = true;
        this.cashOutPressTime = Date.now();
        if (this.onCashOutStart) {
          this.onCashOutStart();
        }
      }

      // 分裂快捷鍵 (空白鍵) - 只在第一次按下時觸發
      if (e.code === 'Space' && !this.splitPressed) {
        e.preventDefault(); // 防止頁面滾動
        this.splitPressed = true;
        if (this.onSplit) {
          this.onSplit();
        }
      }
    });

    // 鍵盤釋放
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;

      // Cash Out 按鍵釋放
      if (e.code === this.cashOutKey && this.cashOutPressed) {
        this.cashOutPressed = false;
        this.cashOutPressTime = 0;
        if (this.onCashOutCancel) {
          this.onCashOutCancel();
        }
      }

      // 分裂按鍵釋放
      if (e.code === 'Space') {
        this.splitPressed = false;
      }
    });
  }

  /**
   * 檢查 Cash Out 是否持續按住
   */
  isCashOutHeld() {
    return this.cashOutPressed;
  }

  /**
   * 獲取 Cash Out 持續時間
   */
  getCashOutHoldTime() {
    if (!this.cashOutPressed) return 0;
    return Date.now() - this.cashOutPressTime;
  }

  /**
   * 檢查按鍵是否按下
   */
  isKeyDown(code) {
    return this.keys[code] || false;
  }

  /**
   * 獲取當前滑鼠位置
   */
  getMousePosition() {
    return { x: this.mouseX, y: this.mouseY };
  }

  /**
   * 獲取 WASD / 方向鍵的移動方向 (標準化)
   * 返回 { dx, dy }，範圍 -1 ~ 1
   */
  getWASDDirection() {
    const right = (this.keys['KeyD'] || this.keys['ArrowRight']) ? 1 : 0;
    const left  = (this.keys['KeyA'] || this.keys['ArrowLeft'])  ? 1 : 0;
    const down  = (this.keys['KeyS'] || this.keys['ArrowDown'])  ? 1 : 0;
    const up    = (this.keys['KeyW'] || this.keys['ArrowUp'])    ? 1 : 0;
    return { dx: right - left, dy: down - up };
  }

  /**
   * 是否有任何 WASD / 方向鍵被按住
   */
  isWASDActive() {
    return !!(
      this.keys['KeyW'] || this.keys['KeyA'] ||
      this.keys['KeyS'] || this.keys['KeyD'] ||
      this.keys['ArrowUp'] || this.keys['ArrowLeft'] ||
      this.keys['ArrowDown'] || this.keys['ArrowRight']
    );
  }
}

export default Input;
