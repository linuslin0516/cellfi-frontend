/**
 * 遊戲渲染器
 * 負責 Canvas 繪製
 * Binance 主題配色 + 平滑插值
 */
class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    // 攝影機 (視野中心) - 使用平滑跟蹤
    this.cameraX = 0;
    this.cameraY = 0;
    this.targetCameraX = 0;
    this.targetCameraY = 0;
    this.scale = 1;
    this.targetScale = 1;

    // 玩家位置插值緩存
    this.playerPositions = new Map();

    // Binance 主題配色
    this.colors = {
      background: '#0B0E11',
      grid: '#1E2329',
      gridAccent: '#2B3139',
      bnbYellow: '#F0B90B',
      bnbGreen: '#03A66D',
      bnbRed: '#CF304A',
      white: '#EAECEF',
      gray: '#848E9C',
    };

    // 網格配置
    this.gridSize = 50;

    // 插值參數
    this.cameraSmoothing = 0.08;
    this.playerSmoothing = 0.15;
    this.scaleSmoothing = 0.015; // 視野縮放速度 (比質量變化慢很多)

    // 食物顏色 (Binance 風格)
    this.foodColors = [
      '#F0B90B', // BNB Yellow
      '#03A66D', // BNB Green
      '#00B8D9', // Cyan
      '#FF6B6B', // Coral
      '#A855F7', // Purple
      '#F59E0B', // Amber
      '#10B981', // Emerald
      '#EC4899', // Pink
    ];
  }

  lerp(current, target, factor) {
    return current + (target - current) * factor;
  }

  updateCamera(player) {
    if (!player) return;

    this.targetCameraX = player.x;
    this.targetCameraY = player.y;

    this.cameraX = this.lerp(this.cameraX, this.targetCameraX, this.cameraSmoothing);
    this.cameraY = this.lerp(this.cameraY, this.targetCameraY, this.cameraSmoothing);

    // 視野縮放 - 比質量變化更慢，讓玩家有更好的空間感
    this.targetScale = Math.max(0.35, Math.min(1, 25 / player.radius));
    this.scale = this.lerp(this.scale, this.targetScale, this.scaleSmoothing);
  }

  updatePlayerPosition(player) {
    const id = player.id;

    if (!this.playerPositions.has(id)) {
      this.playerPositions.set(id, {
        x: player.x,
        y: player.y,
        radius: player.radius
      });
    } else {
      const cached = this.playerPositions.get(id);
      cached.x = this.lerp(cached.x, player.x, this.playerSmoothing);
      cached.y = this.lerp(cached.y, player.y, this.playerSmoothing);
      cached.radius = this.lerp(cached.radius, player.radius, this.playerSmoothing);
    }

    return this.playerPositions.get(id);
  }

  cleanupPlayerCache(activePlayers) {
    const activeIds = new Set();

    // 收集所有活動的 ID (玩家和細胞)
    for (const p of activePlayers) {
      activeIds.add(p.id);
      if (p.cells) {
        for (const cell of p.cells) {
          activeIds.add(cell.id);
        }
      }
    }

    // 清理不活動的緩存
    for (const id of this.playerPositions.keys()) {
      if (!activeIds.has(id)) {
        this.playerPositions.delete(id);
      }
    }
  }

  worldToScreen(x, y) {
    const screenX = (x - this.cameraX) * this.scale + this.width / 2;
    const screenY = (y - this.cameraY) * this.scale + this.height / 2;
    return { x: screenX, y: screenY };
  }

  screenToWorld(screenX, screenY) {
    const x = (screenX - this.width / 2) / this.scale + this.cameraX;
    const y = (screenY - this.height / 2) / this.scale + this.cameraY;
    return { x, y };
  }

  clear() {
    const ctx = this.ctx;

    // 漸層背景
    const gradient = ctx.createRadialGradient(
      this.width / 2, this.height / 2, 0,
      this.width / 2, this.height / 2, Math.max(this.width, this.height)
    );
    gradient.addColorStop(0, '#181A20');
    gradient.addColorStop(1, this.colors.background);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  drawGrid(mapWidth, mapHeight) {
    const ctx = this.ctx;

    // 計算可見區域
    const startX = Math.floor((this.cameraX - this.width / 2 / this.scale) / this.gridSize) * this.gridSize;
    const startY = Math.floor((this.cameraY - this.height / 2 / this.scale) / this.gridSize) * this.gridSize;
    const endX = this.cameraX + this.width / 2 / this.scale;
    const endY = this.cameraY + this.height / 2 / this.scale;

    // 繪製網格
    ctx.strokeStyle = this.colors.grid;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;

    // 垂直線
    for (let x = startX; x <= endX; x += this.gridSize) {
      if (x >= 0 && x <= mapWidth) {
        const screen = this.worldToScreen(x, 0);
        ctx.beginPath();
        ctx.moveTo(screen.x, 0);
        ctx.lineTo(screen.x, this.height);
        ctx.stroke();
      }
    }

    // 水平線
    for (let y = startY; y <= endY; y += this.gridSize) {
      if (y >= 0 && y <= mapHeight) {
        const screen = this.worldToScreen(0, y);
        ctx.beginPath();
        ctx.moveTo(0, screen.y);
        ctx.lineTo(this.width, screen.y);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;

    // 繪製地圖邊界 (BNB Yellow)
    this.drawMapBorder(mapWidth, mapHeight);
  }

  drawMapBorder(mapWidth, mapHeight) {
    const ctx = this.ctx;

    const topLeft = this.worldToScreen(0, 0);
    const bottomRight = this.worldToScreen(mapWidth, mapHeight);

    // 發光邊框效果
    ctx.shadowColor = this.colors.bnbYellow;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = this.colors.bnbYellow;
    ctx.lineWidth = 3;

    ctx.strokeRect(
      topLeft.x,
      topLeft.y,
      bottomRight.x - topLeft.x,
      bottomRight.y - topLeft.y
    );

    ctx.shadowBlur = 0;
  }

  drawFood(foods) {
    const ctx = this.ctx;

    for (const food of foods) {
      const screen = this.worldToScreen(food.x, food.y);
      const radius = food.radius * this.scale;

      // 視野檢查
      if (screen.x < -radius || screen.x > this.width + radius ||
          screen.y < -radius || screen.y > this.height + radius) {
        continue;
      }

      ctx.shadowColor = food.color || this.foodColors[0];
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.arc(screen.x, screen.y, Math.max(radius, 4), 0, Math.PI * 2);
      ctx.fillStyle = food.color || this.foodColors[Math.floor(Math.random() * this.foodColors.length)];
      ctx.fill();

      ctx.shadowBlur = 0;
    }
  }

  drawPlayer(player, isSelf = false) {
    const ctx = this.ctx;

    // 如果玩家有多個細胞，繪製每個細胞
    if (player.cells && player.cells.length > 0) {
      for (const cell of player.cells) {
        this.drawCell(cell, player, isSelf);
      }
    } else {
      // 向後兼容：沒有 cells 數據時使用舊方法
      this.drawSingleCell(player, isSelf);
    }
  }

  /**
   * 繪製單個細胞
   */
  drawCell(cell, player, isSelf) {
    const ctx = this.ctx;

    // 獲取插值位置
    const smoothed = this.updateCellPosition(cell);
    const screen = this.worldToScreen(smoothed.x, smoothed.y);
    const radius = smoothed.radius * this.scale;

    // 視野檢查
    if (screen.x < -radius * 2 || screen.x > this.width + radius * 2 ||
        screen.y < -radius * 2 || screen.y > this.height + radius * 2) {
      return;
    }

    // 護盾效果 (只在主細胞顯示)
    if (player.shield && cell === player.cells[0]) {
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius + 12 * this.scale, 0, Math.PI * 2);
      ctx.strokeStyle = '#00B8D9';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00B8D9';
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 繪製細胞圓球
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);

    // 漸層填充
    const gradient = ctx.createRadialGradient(
      screen.x - radius * 0.3,
      screen.y - radius * 0.3,
      0,
      screen.x,
      screen.y,
      radius
    );

    if (isSelf) {
      gradient.addColorStop(0, '#FFD54F');
      gradient.addColorStop(1, this.colors.bnbYellow);
      ctx.shadowColor = this.colors.bnbYellow;
    } else {
      gradient.addColorStop(0, '#FF8A8A');
      gradient.addColorStop(1, this.colors.bnbRed);
      ctx.shadowColor = this.colors.bnbRed;
    }

    ctx.shadowBlur = 15;
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowBlur = 0;

    // 邊框
    ctx.strokeStyle = isSelf ? '#E6A800' : '#A02040';
    ctx.lineWidth = Math.max(2, radius * 0.05);
    ctx.stroke();

    // 速度加成特效
    if (player.speedBoost) {
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = this.colors.bnbYellow;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 繪製名稱和分數 (每個細胞都顯示)
    const fontSize = Math.max(10, Math.min(radius * 0.35, 20));
    ctx.fillStyle = this.colors.white;
    ctx.font = `bold ${fontSize}px 'Inter', 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillText(player.name, screen.x, screen.y);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Cash Out 進度條 (只在主細胞顯示)
    if (player.isCashingOut && cell === player.cells[0]) {
      this.drawCashOutProgress(screen.x, screen.y, radius, player.cashOutProgress);
    }
  }

  /**
   * 更新細胞插值位置
   */
  updateCellPosition(cell) {
    const id = cell.id;

    if (!this.playerPositions.has(id)) {
      this.playerPositions.set(id, {
        x: cell.x,
        y: cell.y,
        radius: cell.radius
      });
    } else {
      const cached = this.playerPositions.get(id);
      cached.x = this.lerp(cached.x, cell.x, this.playerSmoothing);
      cached.y = this.lerp(cached.y, cell.y, this.playerSmoothing);
      cached.radius = this.lerp(cached.radius, cell.radius, this.playerSmoothing);
    }

    return this.playerPositions.get(id);
  }

  /**
   * 繪製單個玩家 (向後兼容)
   */
  drawSingleCell(player, isSelf) {
    const ctx = this.ctx;

    const smoothed = this.updatePlayerPosition(player);
    const screen = this.worldToScreen(smoothed.x, smoothed.y);
    const radius = smoothed.radius * this.scale;

    if (screen.x < -radius * 2 || screen.x > this.width + radius * 2 ||
        screen.y < -radius * 2 || screen.y > this.height + radius * 2) {
      return;
    }

    if (player.shield) {
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius + 12 * this.scale, 0, Math.PI * 2);
      ctx.strokeStyle = '#00B8D9';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00B8D9';
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.beginPath();
    ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);

    const gradient = ctx.createRadialGradient(
      screen.x - radius * 0.3,
      screen.y - radius * 0.3,
      0,
      screen.x,
      screen.y,
      radius
    );

    if (isSelf) {
      gradient.addColorStop(0, '#FFD54F');
      gradient.addColorStop(1, this.colors.bnbYellow);
      ctx.shadowColor = this.colors.bnbYellow;
    } else {
      gradient.addColorStop(0, '#FF8A8A');
      gradient.addColorStop(1, this.colors.bnbRed);
      ctx.shadowColor = this.colors.bnbRed;
    }

    ctx.shadowBlur = 15;
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = isSelf ? '#E6A800' : '#A02040';
    ctx.lineWidth = Math.max(2, radius * 0.05);
    ctx.stroke();

    if (player.speedBoost) {
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = this.colors.bnbYellow;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    const fontSize = Math.max(12, Math.min(radius * 0.4, 24));
    ctx.fillStyle = this.colors.white;
    ctx.font = `bold ${fontSize}px 'Inter', 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillText(player.name, screen.x, screen.y - fontSize * 0.3);

    if (player.score) {
      ctx.font = `${fontSize * 0.7}px 'Inter', 'Segoe UI', sans-serif`;
      ctx.fillStyle = this.colors.gray;
      ctx.fillText(player.score.toLocaleString(), screen.x, screen.y + fontSize * 0.5);
    }

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    if (player.isCashingOut) {
      this.drawCashOutProgress(screen.x, screen.y, radius, player.cashOutProgress);
    }
  }

  drawCashOutProgress(x, y, radius, progress) {
    const ctx = this.ctx;
    const barWidth = radius * 2;
    const barHeight = 8;
    const barY = y + radius + 20;

    // 背景
    ctx.fillStyle = this.colors.gridAccent;
    ctx.beginPath();
    ctx.roundRect(x - barWidth / 2, barY, barWidth, barHeight, 4);
    ctx.fill();

    // 進度 (漸層)
    const progressGradient = ctx.createLinearGradient(x - barWidth / 2, 0, x + barWidth / 2, 0);
    progressGradient.addColorStop(0, this.colors.bnbYellow);
    progressGradient.addColorStop(1, this.colors.bnbGreen);

    ctx.fillStyle = progressGradient;
    ctx.beginPath();
    ctx.roundRect(x - barWidth / 2, barY, barWidth * progress, barHeight, 4);
    ctx.fill();

    // 邊框
    ctx.strokeStyle = this.colors.bnbYellow;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - barWidth / 2, barY, barWidth, barHeight, 4);
    ctx.stroke();

    // 文字
    ctx.fillStyle = this.colors.bnbYellow;
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CASHING OUT...', x, barY - 8);
  }

  drawMinimap(player, players, mapWidth, mapHeight) {
    const ctx = this.ctx;
    const mapSize = 150;
    const padding = 10;
    const x = this.width - mapSize - padding;
    const y = padding;

    // 背景 (毛玻璃效果)
    ctx.fillStyle = 'rgba(30, 35, 41, 0.8)';
    ctx.beginPath();
    ctx.roundRect(x, y, mapSize, mapSize, 8);
    ctx.fill();

    // 邊框
    ctx.strokeStyle = 'rgba(240, 185, 11, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 計算比例
    const scaleX = mapSize / mapWidth;
    const scaleY = mapSize / mapHeight;

    // 繪製其他玩家
    ctx.fillStyle = this.colors.bnbRed;
    for (const p of players) {
      const px = x + p.x * scaleX;
      const py = y + p.y * scaleY;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 繪製自己
    if (player) {
      ctx.fillStyle = this.colors.bnbYellow;
      ctx.shadowColor = this.colors.bnbYellow;
      ctx.shadowBlur = 8;
      const px = x + player.x * scaleX;
      const py = y + player.y * scaleY;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 標題
    ctx.fillStyle = this.colors.gray;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MINIMAP', x + mapSize / 2, y + mapSize + 15);
  }

  drawLeaderboard(leaderboard) {
    const ctx = this.ctx;
    const padding = 10;
    const x = padding;
    const y = padding;
    const width = 200;
    const lineHeight = 28;
    const headerHeight = 40;

    // 背景
    ctx.fillStyle = 'rgba(30, 35, 41, 0.85)';
    ctx.beginPath();
    ctx.roundRect(x, y, width, headerHeight + lineHeight * leaderboard.length + 10, 12);
    ctx.fill();

    // 邊框
    ctx.strokeStyle = 'rgba(240, 185, 11, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 標題
    ctx.fillStyle = this.colors.bnbYellow;
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('LEADERBOARD', x + 15, y + 26);

    // 排名
    ctx.font = '13px Inter, sans-serif';
    leaderboard.forEach((entry, index) => {
      const entryY = y + headerHeight + index * lineHeight + 5;

      // 排名圓圈
      const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
      const rankColor = rankColors[index] || this.colors.gray;

      ctx.fillStyle = rankColor;
      ctx.beginPath();
      ctx.arc(x + 25, entryY + 8, 10, 0, Math.PI * 2);
      ctx.fill();

      // 排名數字
      ctx.fillStyle = index < 3 ? '#000' : '#fff';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(entry.rank, x + 25, entryY + 12);

      // 名稱
      ctx.fillStyle = this.colors.white;
      ctx.font = '13px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(entry.name, x + 45, entryY + 12);

      // 分數
      ctx.fillStyle = this.colors.bnbYellow;
      ctx.textAlign = 'right';
      ctx.fillText(entry.score.toLocaleString(), x + width - 15, entryY + 12);
    });
  }

  render(gameState) {
    if (!gameState) return;

    const { self, players, food, leaderboard, mapSize } = gameState;

    // 更新攝影機
    this.updateCamera(self);

    // 清理緩存
    const allPlayers = self ? [self, ...players] : players;
    this.cleanupPlayerCache(allPlayers);

    // 清除畫布
    this.clear();

    // 繪製網格
    this.drawGrid(mapSize.width, mapSize.height);

    // 繪製食物
    this.drawFood(food);

    // 繪製其他玩家
    for (const player of players) {
      this.drawPlayer(player, false);
    }

    // 繪製自己
    if (self) {
      this.drawPlayer(self, true);
    }

    // 繪製 UI
    this.drawMinimap(self, players, mapSize.width, mapSize.height);
    this.drawLeaderboard(leaderboard);
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
  }
}

export default Renderer;
