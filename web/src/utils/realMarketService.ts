// Serviço de Integração de Cotações Reais de Bolsas Europeias (XETRA, Euronext)
import { MarketEtf, MarketSignalType, MarketAlert } from '../types';

export const ETF_EXCHANGE_MAP: Record<string, { symbol: string; exchange: string; name: string }> = {
  vwce: { symbol: 'VWCE.DE', exchange: 'XETRA', name: 'Vanguard FTSE All-World' },
  spyi: { symbol: 'SPYI.DE', exchange: 'XETRA', name: 'SPDR MSCI ACWI IMI' },
  sxr8: { symbol: 'SXR8.DE', exchange: 'XETRA', name: 'iShares Core S&P 500' },
  iwda: { symbol: 'IWDA.AS', exchange: 'Euronext Amsterdam', name: 'iShares Core MSCI World' },
  sxrv: { symbol: 'SXRV.DE', exchange: 'XETRA', name: 'iShares Nasdaq 100' },
  qdve: { symbol: 'QDVE.DE', exchange: 'XETRA', name: 'iShares S&P 500 Info Tech' },
  meud: { symbol: 'MEUD.PA', exchange: 'Euronext Paris', name: 'Amundi Core STOXX Europe 600' },
  eimi: { symbol: 'IS3N.DE', exchange: 'XETRA', name: 'iShares Core MSCI EM IMI' },
  fusd: { symbol: 'FUSD.DE', exchange: 'XETRA', name: 'Fidelity US Quality Income' },
  dfnd: { symbol: 'DFEN.DE', exchange: 'XETRA', name: 'VanEck Defense' },
  sgld: { symbol: '4GLD.DE', exchange: 'XETRA', name: 'Xetra-Gold Physical' },
  xdwh: { symbol: 'XDWH.DE', exchange: 'XETRA', name: 'Xtrackers World Health Care' },
  xffe: { symbol: 'XFFE.DE', exchange: 'XETRA', name: 'Xtrackers World Energy' },
  cbu0: { symbol: 'CBU0.DE', exchange: 'XETRA', name: 'iShares Core Corp Bond' },
  inrg: { symbol: 'IQQH.DE', exchange: 'XETRA', name: 'iShares Global Clean Energy' },
};

// Cálculo matemático exato de RSI (Relative Strength Index)
function computeRSI(closes: number[], period: number = 14): number {
  if (closes.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = closes.length - period; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  return Math.max(0, Math.min(100, Number(rsi.toFixed(1))));
}

// Cálculo matemático de Média Móvel Simples (SMA)
function computeSMA(closes: number[], period: number): number {
  if (closes.length === 0) return 0;
  const slice = closes.slice(-period);
  const sum = slice.reduce((acc, val) => acc + val, 0);
  return Number((sum / slice.length).toFixed(2));
}

// Algoritmo de classificação de sinal e pontuação de oportunidade (0-100) baseado em dados reais
function evaluateSignalAndScore(
  price: number, 
  rsi: number, 
  sma200: number, 
  high52w: number, 
  peRatio: number, 
  ter: number
): { signal: MarketSignalType; score: number; reason: string } {
  let score = 50;
  const priceToSma200 = sma200 > 0 ? ((price - sma200) / sma200) * 100 : 0;
  const drawdown = high52w > 0 ? ((price - high52w) / high52w) * 100 : 0;

  // 1. Fator RSI (Sobrevenda = Oportunidade; Sobrecompra = Prudência)
  if (rsi <= 32) score += 26;
  else if (rsi <= 42) score += 18;
  else if (rsi <= 52) score += 8;
  else if (rsi >= 72) score -= 22;
  else if (rsi >= 64) score -= 12;

  // 2. Fator Média Móvel de 200 dias (SMA 200)
  if (priceToSma200 >= -6 && priceToSma200 <= 3) score += 16; // Ponto ideal de suporte
  else if (priceToSma200 > 18) score -= 18; // Esticado face à tendência
  else if (priceToSma200 < -12) score += 10; // Desconto severo

  // 3. Fator Eficiência de Custos (TER)
  if (ter <= 0.20) score += 8;
  else if (ter >= 0.50) score -= 6;

  // 4. Múltiplo de Valorização (P/E)
  if (peRatio > 0 && peRatio < 18) score += 8;
  else if (peRatio > 28) score -= 10;

  score = Math.max(10, Math.min(99, Math.round(score)));

  let signal: MarketSignalType = 'NEUTRAL';
  let reason = '';

  if (score >= 82) {
    signal = 'STRONG_BUY';
    reason = `Oportunidade de alta convicção em bolsa real. Sobrevenda técnica acentuada (RSI ${rsi}) com valuation atrativo e desconto face aos máximos (${drawdown.toFixed(1)}%).`;
  } else if (score >= 68) {
    signal = 'BUY';
    reason = `Sinal positivo de compra com desconto favorável. Cotação em zona de suporte face à SMA 200 com bom equilíbrio de risco/retorno.`;
  } else if (score <= 25) {
    signal = 'STRONG_SELL';
    reason = `Sobrecompra severa no mercado em tempo real (RSI ${rsi}) e cotação esticada ${priceToSma200.toFixed(1)}% acima da média de 200 dias. Risco elevado de correção.`;
  } else if (score <= 38) {
    signal = 'TRIM';
    reason = `Preço em zona de resistência técnica. Recomendada realização de mais-valias parciais ou contenção de novos aportes até retração.`;
  } else {
    signal = 'NEUTRAL';
    reason = `Ativo em zona de consolidação. Indicadores técnicos neutros (RSI ${rsi}); recomendado manter posições existentes e aguardar novo gatilho.`;
  }

  return { signal, score, reason };
}

// Executa o pedido de dados reais para um ETF
export async function fetchSingleRealEtf(etf: MarketEtf): Promise<MarketEtf | null> {
  const mapping = ETF_EXCHANGE_MAP[etf.id];
  if (!mapping) return null;

  const symbol = mapping.symbol;
  const urls = [
    `/api/finance/v8/finance/chart/${symbol}?interval=1d&range=1y`,
    `https://corsproxy.io/?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1y`)}`
  ];

  let rawData = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        const json = await response.json();
        if (json?.chart?.result?.[0]?.meta) {
          rawData = json.chart.result[0];
          break;
        }
      }
    } catch {
      // Tenta o próximo URL
    }
  }

  if (!rawData) return null;

  const meta = rawData.meta;
  const quotes = rawData.indicators?.quote?.[0];
  const closes: number[] = quotes?.close ? quotes.close.filter((c: unknown): c is number => typeof c === 'number' && !isNaN(c)) : [];

  const currentPrice = Number((meta.regularMarketPrice ?? closes[closes.length - 1] ?? etf.currentPrice).toFixed(2));
  const previousClose = Number((meta.chartPreviousClose ?? meta.previousClose ?? etf.previousClose).toFixed(2));
  const dailyChange = Number((meta.regularMarketChangePercent ?? (((currentPrice - previousClose) / previousClose) * 100)).toFixed(2));

  // Cálculo real da SMA 200 e SMA 50
  const sma200 = closes.length >= 50 ? computeSMA(closes, 200) : etf.technical.sma200;
  const sma50 = closes.length >= 20 ? computeSMA(closes, 50) : etf.technical.sma50;
  const rsi = closes.length >= 15 ? computeRSI(closes, 14) : etf.technical.rsi;

  const high52w = Number((meta.fiftyTwoWeekHigh ?? Math.max(...closes.slice(-250), currentPrice)).toFixed(2));
  const low52w = Number((meta.fiftyTwoWeekLow ?? Math.min(...closes.slice(-250), currentPrice)).toFixed(2));
  const drawdownFromHigh = high52w > 0 ? Number((((currentPrice - high52w) / high52w) * 100).toFixed(2)) : 0;
  const priceToSma200 = sma200 > 0 ? Number((((currentPrice - sma200) / sma200) * 100).toFixed(2)) : 0;

  // Sparkline com as últimas 10 sessões reais
  const sparkline = closes.slice(-10).map((c: number) => Number(c.toFixed(2)));

  // Avaliação e Score com os dados reais
  const { signal, score, reason } = evaluateSignalAndScore(
    currentPrice,
    rsi,
    sma200,
    high52w,
    etf.fundamental.peRatio,
    etf.fundamental.ter
  );

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    ...etf,
    currentPrice,
    previousClose,
    dailyChange,
    signal,
    score,
    signalReason: reason,
    sparkline: sparkline.length > 3 ? sparkline : etf.sparkline,
    technical: {
      ...etf.technical,
      rsi,
      sma50,
      sma200,
      priceToSma200,
      high52w,
      low52w,
      drawdownFromHigh,
      supportPrice: Number((sma200 * 0.98).toFixed(2)),
      resistancePrice: Number((high52w * 0.99).toFixed(2)),
      trend: currentPrice >= sma200 ? 'ALTA' : (priceToSma200 < -5 ? 'BAIXA' : 'LATERAL')
    },
    lastUpdated: `Bolsa Real (${mapping.exchange} às ${timeStr})`
  };
}

// Atualiza a lista completa de ETFs com dados reais
export async function syncRealMarketData(currentEtfs: MarketEtf[]): Promise<{
  updatedEtfs: MarketEtf[];
  newAlerts: MarketAlert[];
  isRealTime: boolean;
  syncTimestamp: number;
}> {
  const promises = currentEtfs.map(etf => fetchSingleRealEtf(etf));
  const results = await Promise.allSettled(promises);

  const updatedEtfs: MarketEtf[] = [];
  const newAlerts: MarketAlert[] = [];
  let successfulRealFetches = 0;

  results.forEach((res, index) => {
    const originalEtf = currentEtfs[index];
    if (res.status === 'fulfilled' && res.value) {
      const realEtf = res.value;
      updatedEtfs.push(realEtf);
      successfulRealFetches++;

      // Gera alertas inteligentes quando ocorrem desequilíbrios reais
      if (realEtf.signal === 'STRONG_BUY' && originalEtf.signal !== 'STRONG_BUY') {
        newAlerts.push({
          id: `real-buy-${realEtf.ticker}-${Date.now()}`,
          ticker: realEtf.ticker,
          etfName: realEtf.name,
          signal: realEtf.signal,
          type: 'opportunity',
          title: `Oportunidade Real: ${realEtf.ticker}`,
          message: `O ETF ${realEtf.ticker} entrou em sobrevenda técnica real (RSI ${realEtf.technical.rsi}) na bolsa com desconto face à SMA 200.`,
          timestamp: new Date(),
          read: false
        });
      } else if (realEtf.signal === 'STRONG_SELL' && originalEtf.signal !== 'STRONG_SELL') {
        newAlerts.push({
          id: `real-sell-${realEtf.ticker}-${Date.now()}`,
          ticker: realEtf.ticker,
          etfName: realEtf.name,
          signal: realEtf.signal,
          type: 'warning',
          title: `Alerta de Sobrecompra: ${realEtf.ticker}`,
          message: `O ETF ${realEtf.ticker} atingiu patamares elevados (RSI ${realEtf.technical.rsi}) na bolsa. Zona favorável a realização de mais-valias.`,
          timestamp: new Date(),
          read: false
        });
      }
    } else {
      updatedEtfs.push(originalEtf);
    }
  });

  return {
    updatedEtfs,
    newAlerts,
    isRealTime: successfulRealFetches > 0,
    syncTimestamp: Date.now()
  };
}
