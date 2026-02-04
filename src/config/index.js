// BSC 網路配置
export const BSC_TESTNET = {
  id: 97,
  name: 'BSC Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'tBNB',
  },
  rpcUrls: {
    default: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
  testnet: true,
};

export const BSC_MAINNET = {
  id: 56,
  name: 'BSC',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: { http: ['https://bsc-dataseed.binance.org/'] },
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com' },
  },
};

// 合約地址 (部署後填入)
export const CONTRACTS = {
  CELL_TOKEN: import.meta.env.VITE_CELL_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  GAME_VAULT: import.meta.env.VITE_GAME_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000',
};

// 向後兼容 (舊代碼可能還在用 AGAR_TOKEN)
CONTRACTS.AGAR_TOKEN = CONTRACTS.CELL_TOKEN;

// Debug: 顯示載入的合約地址
console.log('=== Contract Config ===');
console.log('CELL_TOKEN:', CONTRACTS.CELL_TOKEN);
console.log('GAME_VAULT:', CONTRACTS.GAME_VAULT);
console.log('ENV VITE_CELL_TOKEN_ADDRESS:', import.meta.env.VITE_CELL_TOKEN_ADDRESS);
console.log('=======================');

// 服務器配置
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

// 遊戲配置
export const GAME_CONFIG = {
  CANVAS_WIDTH: 1920,
  CANVAS_HEIGHT: 1080,
  MAP_WIDTH: 5000,
  MAP_HEIGHT: 5000,
  CASHOUT_DURATION: 10000, // 10 秒
};

// ABI (JSON 格式) - ERC20 with tax
export const CELL_TOKEN_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
];

export const GAME_VAULT_ABI = [
  {
    name: 'payEntryFee',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'claim',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'getPlayerBalance',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'player', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getVaultBalance',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'entryFee',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
];

// 向後兼容
export const AGAR_TOKEN_ABI = CELL_TOKEN_ABI;
