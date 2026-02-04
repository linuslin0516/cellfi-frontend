import { http, createConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

/**
 * EIP-6963: Multi Injected Provider Discovery
 * 這是新的標準，讓錢包主動宣告自己，而不是搶佔 window.ethereum
 */
let eip6963Providers = [];
let eip6963Initialized = false;

function initEIP6963() {
  if (typeof window === 'undefined' || eip6963Initialized) return;
  eip6963Initialized = true;

  // 監聽錢包宣告事件
  window.addEventListener('eip6963:announceProvider', (event) => {
    const { info, provider } = event.detail;
    // 避免重複
    if (!eip6963Providers.find(p => p.info.uuid === info.uuid)) {
      eip6963Providers.push({ info, provider });
      console.log('[EIP-6963] Wallet announced:', info.name);
    }
  });

  // 請求所有錢包宣告自己
  window.dispatchEvent(new Event('eip6963:requestProvider'));
}

// 初始化 EIP-6963
if (typeof window !== 'undefined') {
  initEIP6963();
}

/**
 * 從 EIP-6963 providers 中找特定錢包
 */
function findEIP6963Provider(walletId) {
  const mapping = {
    'metaMask': ['metamask', 'io.metamask'],
    'okxWallet': ['okx', 'com.okex.wallet'],
    'phantom': ['phantom', 'app.phantom'],
    'trustWallet': ['trust', 'com.trustwallet.app'],
    'coinbaseWallet': ['coinbase', 'com.coinbase.wallet'],
    'rabby': ['rabby', 'io.rabby'],
    'bitget': ['bitget', 'bitkeep', 'com.bitget.web3'],
    'tokenPocket': ['tokenpocket', 'pro.tokenpocket'],
    'binanceWallet': ['binance', 'com.binance'],
    'brave': ['brave', 'com.brave.wallet'],
  };

  const keywords = mapping[walletId] || [walletId.toLowerCase()];

  for (const { info, provider } of eip6963Providers) {
    const rdns = (info.rdns || '').toLowerCase();
    const name = (info.name || '').toLowerCase();

    for (const keyword of keywords) {
      if (rdns.includes(keyword) || name.includes(keyword)) {
        return provider;
      }
    }
  }
  return null;
}

/**
 * 從 providers 陣列中找到特定錢包
 * EIP-5749: 多個錢包會將自己加入 window.ethereum.providers 陣列
 */
function findProviderInArray(providers, checkFn) {
  if (!providers || !Array.isArray(providers)) return undefined;
  return providers.find(checkFn);
}

/**
 * 取得特定錢包的 provider，處理多錢包衝突
 * 優先順序: EIP-6963 > 錢包專屬物件 > providers 陣列 > window.ethereum
 */
function getWalletProvider(win, walletId) {
  // 1. 優先使用 EIP-6963 (最可靠)
  const eip6963Provider = findEIP6963Provider(walletId);
  if (eip6963Provider) {
    console.log(`[Wallet] Using EIP-6963 provider for ${walletId}`);
    return eip6963Provider;
  }

  const providers = win.ethereum?.providers;

  switch (walletId) {
    case 'metaMask': {
      // 優先從 providers 陣列找 MetaMask
      if (providers) {
        const mmProvider = findProviderInArray(providers, p =>
          p.isMetaMask && !p.isOKExWallet && !p.isBitKeep && !p.isBraveWallet && !p.isRabby
        );
        if (mmProvider) return mmProvider;
      }
      // 檢查 window.ethereum 是否是純 MetaMask
      if (win.ethereum?.isMetaMask &&
          !win.ethereum?.isOKExWallet &&
          !win.ethereum?.isBitKeep &&
          !win.ethereum?.isBraveWallet &&
          !win.ethereum?.isRabby) {
        return win.ethereum;
      }
      return undefined;
    }

    case 'okxWallet': {
      // OKX 有自己的全域物件，優先使用
      if (win.okxwallet) return win.okxwallet;
      // 從 providers 陣列找
      if (providers) {
        const okxProvider = findProviderInArray(providers, p => p.isOKExWallet);
        if (okxProvider) return okxProvider;
      }
      if (win.ethereum?.isOKExWallet) return win.ethereum;
      return undefined;
    }

    case 'phantom': {
      // Phantom EVM 有自己的路徑
      return win.phantom?.ethereum;
    }

    case 'trustWallet': {
      if (win.trustwallet?.ethereum) return win.trustwallet.ethereum;
      if (providers) {
        const trustProvider = findProviderInArray(providers, p => p.isTrust || p.isTrustWallet);
        if (trustProvider) return trustProvider;
      }
      if (win.ethereum?.isTrust || win.ethereum?.isTrustWallet) return win.ethereum;
      return undefined;
    }

    case 'coinbaseWallet': {
      if (win.coinbaseWalletExtension) return win.coinbaseWalletExtension;
      if (providers) {
        const cbProvider = findProviderInArray(providers, p => p.isCoinbaseWallet);
        if (cbProvider) return cbProvider;
      }
      if (win.ethereum?.isCoinbaseWallet) return win.ethereum;
      return undefined;
    }

    case 'rabby': {
      if (win.rabby) return win.rabby;
      if (providers) {
        const rabbyProvider = findProviderInArray(providers, p => p.isRabby);
        if (rabbyProvider) return rabbyProvider;
      }
      if (win.ethereum?.isRabby) return win.ethereum;
      return undefined;
    }

    case 'bitget': {
      if (win.bitkeep?.ethereum) return win.bitkeep.ethereum;
      if (providers) {
        const bitgetProvider = findProviderInArray(providers, p => p.isBitKeep);
        if (bitgetProvider) return bitgetProvider;
      }
      if (win.ethereum?.isBitKeep) return win.ethereum;
      return undefined;
    }

    case 'tokenPocket': {
      if (win.tokenpocket?.ethereum) return win.tokenpocket.ethereum;
      if (providers) {
        const tpProvider = findProviderInArray(providers, p => p.isTokenPocket);
        if (tpProvider) return tpProvider;
      }
      if (win.ethereum?.isTokenPocket) return win.ethereum;
      return undefined;
    }

    case 'binanceWallet': {
      return win.BinanceChain;
    }

    case 'safepal': {
      if (win.safepal) return win.safepal;
      if (win.ethereum?.isSafePal) return win.ethereum;
      return undefined;
    }

    case 'mathWallet': {
      if (providers) {
        const mathProvider = findProviderInArray(providers, p => p.isMathWallet);
        if (mathProvider) return mathProvider;
      }
      if (win.ethereum?.isMathWallet) return win.ethereum;
      return undefined;
    }

    case 'imToken': {
      if (providers) {
        const imTokenProvider = findProviderInArray(providers, p => p.isImToken);
        if (imTokenProvider) return imTokenProvider;
      }
      if (win.ethereum?.isImToken) return win.ethereum;
      return undefined;
    }

    case 'brave': {
      if (providers) {
        const braveProvider = findProviderInArray(providers, p => p.isBraveWallet);
        if (braveProvider) return braveProvider;
      }
      if (win.ethereum?.isBraveWallet) return win.ethereum;
      return undefined;
    }

    case 'gate': {
      if (win.gatewallet) return win.gatewallet;
      if (win.ethereum?.isGateWallet) return win.ethereum;
      return undefined;
    }

    case 'bybit': {
      if (win.bybitWallet) return win.bybitWallet;
      if (win.ethereum?.isBybit) return win.ethereum;
      return undefined;
    }

    default:
      return undefined;
  }
}

/**
 * 錢包偵測配置
 * 定義所有支援的錢包及其偵測方式
 */
export const WALLET_LIST = [
  {
    id: 'metaMask',
    name: 'MetaMask',
    icon: '🦊',
    color: '#E2761B',
    detect: (win) => {
      // 優先檢查 EIP-6963
      if (findEIP6963Provider('metaMask')) return true;

      const providers = win.ethereum?.providers;
      if (providers) {
        return providers.some(p => p.isMetaMask && !p.isOKExWallet && !p.isBitKeep && !p.isRabby);
      }
      return win.ethereum?.isMetaMask && !win.ethereum?.isOKExWallet && !win.ethereum?.isBitKeep && !win.ethereum?.isRabby;
    },
    getProvider: (win) => getWalletProvider(win, 'metaMask'),
  },
  {
    id: 'okxWallet',
    name: 'OKX Wallet',
    icon: '⭕',
    color: '#000000',
    detect: (win) => {
      if (findEIP6963Provider('okxWallet')) return true;
      return !!win.okxwallet || win.ethereum?.isOKExWallet ||
        (win.ethereum?.providers?.some(p => p.isOKExWallet));
    },
    getProvider: (win) => getWalletProvider(win, 'okxWallet'),
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '👻',
    color: '#AB9FF2',
    detect: (win) => {
      if (findEIP6963Provider('phantom')) return true;
      return !!win.phantom?.ethereum;
    },
    getProvider: (win) => getWalletProvider(win, 'phantom'),
  },
  {
    id: 'trustWallet',
    name: 'Trust Wallet',
    icon: '🛡️',
    color: '#3375BB',
    detect: (win) => {
      if (findEIP6963Provider('trustWallet')) return true;
      return !!win.trustwallet || win.ethereum?.isTrust || win.ethereum?.isTrustWallet;
    },
    getProvider: (win) => getWalletProvider(win, 'trustWallet'),
  },
  {
    id: 'coinbaseWallet',
    name: 'Coinbase Wallet',
    icon: '🔵',
    color: '#0052FF',
    detect: (win) => {
      if (findEIP6963Provider('coinbaseWallet')) return true;
      return !!win.coinbaseWalletExtension || win.ethereum?.isCoinbaseWallet;
    },
    getProvider: (win) => getWalletProvider(win, 'coinbaseWallet'),
  },
  {
    id: 'rabby',
    name: 'Rabby Wallet',
    icon: '🐰',
    color: '#8697FF',
    detect: (win) => {
      if (findEIP6963Provider('rabby')) return true;
      return !!win.rabby || win.ethereum?.isRabby;
    },
    getProvider: (win) => getWalletProvider(win, 'rabby'),
  },
  {
    id: 'bitget',
    name: 'Bitget Wallet',
    icon: '💎',
    color: '#00F0FF',
    detect: (win) => {
      if (findEIP6963Provider('bitget')) return true;
      return !!win.bitkeep?.ethereum || win.ethereum?.isBitKeep;
    },
    getProvider: (win) => getWalletProvider(win, 'bitget'),
  },
  {
    id: 'tokenPocket',
    name: 'TokenPocket',
    icon: '🎒',
    color: '#2980FE',
    detect: (win) => {
      if (findEIP6963Provider('tokenPocket')) return true;
      return !!win.tokenpocket || win.ethereum?.isTokenPocket;
    },
    getProvider: (win) => getWalletProvider(win, 'tokenPocket'),
  },
  {
    id: 'binanceWallet',
    name: 'Binance Wallet',
    icon: '🟡',
    color: '#F0B90B',
    detect: (win) => {
      if (findEIP6963Provider('binanceWallet')) return true;
      return !!win.BinanceChain;
    },
    getProvider: (win) => getWalletProvider(win, 'binanceWallet'),
  },
  {
    id: 'safepal',
    name: 'SafePal',
    icon: '🔐',
    color: '#4A5AFF',
    detect: (win) => !!win.safepal || win.ethereum?.isSafePal,
    getProvider: (win) => getWalletProvider(win, 'safepal'),
  },
  {
    id: 'mathWallet',
    name: 'Math Wallet',
    icon: '📐',
    color: '#000000',
    detect: (win) => win.ethereum?.isMathWallet,
    getProvider: (win) => getWalletProvider(win, 'mathWallet'),
  },
  {
    id: 'imToken',
    name: 'imToken',
    icon: '💳',
    color: '#11C4D1',
    detect: (win) => win.ethereum?.isImToken,
    getProvider: (win) => getWalletProvider(win, 'imToken'),
  },
  {
    id: 'brave',
    name: 'Brave Wallet',
    icon: '🦁',
    color: '#FB542B',
    detect: (win) => {
      if (findEIP6963Provider('brave')) return true;
      return win.ethereum?.isBraveWallet;
    },
    getProvider: (win) => getWalletProvider(win, 'brave'),
  },
  {
    id: 'gate',
    name: 'Gate.io Wallet',
    icon: '🚪',
    color: '#17E6A1',
    detect: (win) => !!win.gatewallet || win.ethereum?.isGateWallet,
    getProvider: (win) => getWalletProvider(win, 'gate'),
  },
  {
    id: 'bybit',
    name: 'Bybit Wallet',
    icon: '🅱️',
    color: '#F7A600',
    detect: (win) => !!win.bybitWallet || win.ethereum?.isBybit,
    getProvider: (win) => getWalletProvider(win, 'bybit'),
  },
];

/**
 * 偵測已安裝的錢包
 */
export function detectInstalledWallets() {
  if (typeof window === 'undefined') return [];

  // 重新請求 EIP-6963 providers
  window.dispatchEvent(new Event('eip6963:requestProvider'));

  return WALLET_LIST.filter(wallet => {
    try {
      return wallet.detect(window);
    } catch {
      return false;
    }
  });
}

/**
 * 取得 EIP-6963 providers 列表
 */
export function getEIP6963Providers() {
  return [...eip6963Providers];
}

/**
 * 建立 wagmi connectors
 */
function createConnectors() {
  return WALLET_LIST.map(wallet =>
    injected({
      target: {
        id: wallet.id,
        name: wallet.name,
        provider: wallet.getProvider,
      },
    })
  );
}

export const config = createConfig({
  chains: [bscTestnet, bsc],
  connectors: createConnectors(),
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
  },
});
