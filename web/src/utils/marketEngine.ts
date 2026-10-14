import { MarketEtf, MarketSignalType, MarketSummary, MarketAlert } from '../types';

// Base curada de ETFs UCITS de topo negociados em bolsas europeias
export const INITIAL_MARKET_ETFS: MarketEtf[] = [
  {
    id: 'vwce',
    ticker: 'VWCE',
    name: 'Vanguard FTSE All-World UCITS ETF (USD) Acc',
    isin: 'IE00BK5BQT80',
    category: 'Global',
    currentPrice: 124.80,
    previousClose: 124.10,
    dailyChange: 0.56,
    signal: 'BUY',
    score: 74,
    signalReason: 'Consolidação saudável acima da SMA 200 com RSI equilibrado (51). Excelente ponto de entrada para alocação global sistemática.',
    technical: {
      rsi: 51.4,
      sma50: 122.40,
      sma200: 116.80,
      priceToSma200: 6.85,
      high52w: 126.50,
      low52w: 104.20,
      drawdownFromHigh: -1.34,
      trend: 'ALTA',
      supportPrice: 121.50,
      resistancePrice: 126.80
    },
    fundamental: {
      peRatio: 18.9,
      dividendYield: 1.62,
      ter: 0.22,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 16500,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [121.2, 122.0, 123.1, 122.8, 124.0, 124.1, 124.8]
  },
  {
    id: 'sxr8',
    ticker: 'SXR8',
    name: 'iShares Core S&P 500 UCITS ETF (Acc)',
    isin: 'IE00B5BMR087',
    category: 'EUA',
    currentPrice: 568.40,
    previousClose: 564.20,
    dailyChange: 0.74,
    signal: 'NEUTRAL',
    score: 62,
    signalReason: 'Próximo de máximos históricos com RSI em 62. Rácio P/E de 25.1 sugere valorização esticada; aguardar pequeno pullback para compras de grande dimensão.',
    technical: {
      rsi: 62.1,
      sma50: 552.10,
      sma200: 512.40,
      priceToSma200: 10.93,
      high52w: 574.00,
      low52w: 432.50,
      drawdownFromHigh: -0.98,
      trend: 'ALTA',
      supportPrice: 550.00,
      resistancePrice: 575.00
    },
    fundamental: {
      peRatio: 25.1,
      dividendYield: 1.25,
      ter: 0.07,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 84000,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [558.0, 560.5, 562.2, 561.0, 563.8, 564.2, 568.4]
  },
  {
    id: 'sxrv',
    ticker: 'SXRV',
    name: 'iShares Nasdaq 100 UCITS ETF (DE) Acc',
    isin: 'DE000A0F5UF5',
    category: 'Tecnologia & IA',
    currentPrice: 946.20,
    previousClose: 955.80,
    dailyChange: -1.00,
    signal: 'TRIM',
    score: 34,
    signalReason: 'RSI atingiu níveis sobrecomprados (>68) antes do recuo recente. P/E de 31.8 e extensão de 15.2% face à SMA 200 aconselham realização de mais-valias parciais.',
    technical: {
      rsi: 68.5,
      sma50: 928.00,
      sma200: 821.50,
      priceToSma200: 15.18,
      high52w: 968.40,
      low52w: 684.00,
      drawdownFromHigh: -2.29,
      trend: 'ALTA',
      supportPrice: 915.00,
      resistancePrice: 970.00
    },
    fundamental: {
      peRatio: 31.8,
      dividendYield: 0.58,
      ter: 0.31,
      replication: 'Physical',
      domicile: 'DE',
      aumMillions: 4300,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [930.0, 942.0, 958.0, 962.0, 960.0, 955.8, 946.2]
  },
  {
    id: 'qdve',
    ticker: 'QDVE',
    name: 'iShares S&P 500 Information Technology Sector UCITS ETF',
    isin: 'IE00B3WJKG14',
    category: 'Tecnologia & IA',
    currentPrice: 28.95,
    previousClose: 29.35,
    dailyChange: -1.36,
    signal: 'TRIM',
    score: 28,
    signalReason: 'Setor de semicondutores e software com múltiplos extremos e RSI em 71 antes de fraqueza técnica. Momento propício a realocação defensiva.',
    technical: {
      rsi: 71.2,
      sma50: 28.10,
      sma200: 24.30,
      priceToSma200: 19.14,
      high52w: 29.80,
      low52w: 18.20,
      drawdownFromHigh: -2.85,
      trend: 'ALTA',
      supportPrice: 27.50,
      resistancePrice: 30.00
    },
    fundamental: {
      peRatio: 34.2,
      dividendYield: 0.65,
      ter: 0.15,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 8700,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [27.8, 28.4, 29.1, 29.4, 29.6, 29.35, 28.95]
  },
  {
    id: 'iwda',
    ticker: 'IWDA',
    name: 'iShares Core MSCI World UCITS ETF (Acc)',
    isin: 'IE00B4L5Y983',
    category: 'Global',
    currentPrice: 98.40,
    previousClose: 97.90,
    dailyChange: 0.51,
    signal: 'BUY',
    score: 76,
    signalReason: 'Custo ultrabaixo (TER 0.20%), alinhamento perfeito de médias móveis e forte suporte em 96.00€. Excelente para acumulação sistemática.',
    technical: {
      rsi: 53.0,
      sma50: 96.20,
      sma200: 91.50,
      priceToSma200: 7.54,
      high52w: 99.80,
      low52w: 79.80,
      drawdownFromHigh: -1.40,
      trend: 'ALTA',
      supportPrice: 95.80,
      resistancePrice: 100.00
    },
    fundamental: {
      peRatio: 19.4,
      dividendYield: 1.55,
      ter: 0.20,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 76000,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [96.0, 96.5, 97.2, 97.1, 97.8, 97.9, 98.4]
  },
  {
    id: 'spyi',
    ticker: 'SPYI',
    name: 'SPDR MSCI ACWI IMI UCITS ETF (Acc)',
    isin: 'IE00B3YLTY66',
    category: 'Global',
    currentPrice: 224.50,
    previousClose: 223.20,
    dailyChange: 0.58,
    signal: 'STRONG_BUY',
    score: 88,
    signalReason: 'O ETF mais abrangente do mercado (Grandes, Médias e Pequenas empresas globais com TER 0.17%). Recuperação sólida de suporte com volume crescente.',
    technical: {
      rsi: 48.2,
      sma50: 221.00,
      sma200: 210.50,
      priceToSma200: 6.65,
      high52w: 227.40,
      low52w: 182.00,
      drawdownFromHigh: -1.28,
      trend: 'ALTA',
      supportPrice: 219.00,
      resistancePrice: 228.00
    },
    fundamental: {
      peRatio: 18.2,
      dividendYield: 1.70,
      ter: 0.17,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 2800,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [219.0, 220.5, 222.0, 221.8, 223.0, 223.2, 224.5]
  },
  {
    id: 'meud',
    ticker: 'MEUD',
    name: 'Lyxor Core STOXX Europe 600 (DR) UCITS ETF',
    isin: 'LU0908500753',
    category: 'Europa',
    currentPrice: 112.30,
    previousClose: 113.10,
    dailyChange: -0.71,
    signal: 'BUY',
    score: 72,
    signalReason: 'Valuation europeu com desconto severo face aos EUA (P/E 13.8 vs 25.1). Dividend yield atrativo de 3.2% e apoio técnico na SMA 50.',
    technical: {
      rsi: 44.5,
      sma50: 111.80,
      sma200: 108.20,
      priceToSma200: 3.79,
      high52w: 116.50,
      low52w: 97.40,
      drawdownFromHigh: -3.61,
      trend: 'LATERAL',
      supportPrice: 110.00,
      resistancePrice: 115.50
    },
    fundamental: {
      peRatio: 13.8,
      dividendYield: 3.20,
      ter: 0.07,
      replication: 'Physical',
      domicile: 'LU',
      aumMillions: 6200,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [112.0, 113.5, 114.2, 113.8, 113.4, 113.1, 112.3]
  },
  {
    id: 'eimi',
    ticker: 'EIMI',
    name: 'iShares Core MSCI EM IMI UCITS ETF (USD) Acc',
    isin: 'IE00BKM4GZ66',
    category: 'Mercados Emergentes',
    currentPrice: 32.40,
    previousClose: 32.95,
    dailyChange: -1.67,
    signal: 'STRONG_BUY',
    score: 86,
    signalReason: 'Oportunidade de compra em valor profundo: RSI caiu para 31.5 (zona de forte sobrevenda). Drawdown de 11.2% com P/E médio de apenas 11.4.',
    technical: {
      rsi: 31.5,
      sma50: 33.80,
      sma200: 34.20,
      priceToSma200: -5.26,
      high52w: 36.50,
      low52w: 28.10,
      drawdownFromHigh: -11.23,
      trend: 'BAIXA',
      supportPrice: 31.80,
      resistancePrice: 34.50
    },
    fundamental: {
      peRatio: 11.4,
      dividendYield: 2.85,
      ter: 0.18,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 19800,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [34.5, 34.0, 33.6, 33.4, 33.1, 32.95, 32.4]
  },
  {
    id: 'fusd',
    ticker: 'FUSD',
    name: 'Fidelity US Quality Income UCITS ETF (Acc)',
    isin: 'IE00BYXVGX24',
    category: 'Dividendos & Qualidade',
    currentPrice: 10.45,
    previousClose: 10.38,
    dailyChange: 0.67,
    signal: 'BUY',
    score: 81,
    signalReason: 'Foco em empresas com balanços sólidos e fluxo de caixa livre. Risco de queda reduzido com tendência técnica ascendente limpa.',
    technical: {
      rsi: 54.2,
      sma50: 10.25,
      sma200: 9.75,
      priceToSma200: 7.18,
      high52w: 10.60,
      low52w: 8.80,
      drawdownFromHigh: -1.42,
      trend: 'ALTA',
      supportPrice: 10.15,
      resistancePrice: 10.65
    },
    fundamental: {
      peRatio: 19.8,
      dividendYield: 2.15,
      ter: 0.25,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 1450,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [10.18, 10.25, 10.30, 10.35, 10.36, 10.38, 10.45]
  },
  {
    id: 'dfnd',
    ticker: 'DFND',
    name: 'VanEck Defense UCITS ETF (Acc)',
    isin: 'IE000YYE6WK5',
    category: 'Defesa & Aeroespacial',
    currentPrice: 38.60,
    previousClose: 37.90,
    dailyChange: 1.85,
    signal: 'BUY',
    score: 79,
    signalReason: 'Forte momentum geopolítico com encomendas governamentais recorde na Europa. Rompimento de resistência técnica com volume acima da média.',
    technical: {
      rsi: 61.8,
      sma50: 36.20,
      sma200: 31.40,
      priceToSma200: 22.93,
      high52w: 39.20,
      low52w: 22.10,
      drawdownFromHigh: -1.53,
      trend: 'ALTA',
      supportPrice: 36.50,
      resistancePrice: 40.00
    },
    fundamental: {
      peRatio: 26.5,
      dividendYield: 0.95,
      ter: 0.55,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 1250,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [35.8, 36.4, 37.0, 37.5, 37.2, 37.9, 38.6]
  },
  {
    id: 'sgld',
    ticker: 'SGLD',
    name: 'iShares Physical Gold ETC',
    isin: 'IE00B4ND3602',
    category: 'Matérias-Primas',
    currentPrice: 86.40,
    previousClose: 85.80,
    dailyChange: 0.70,
    signal: 'BUY',
    score: 75,
    signalReason: 'Refúgio contra inflação e incerteza geopolítica. Apoio estrutural de compras de bancos centrais mundiais; tendência de alta sólida.',
    technical: {
      rsi: 58.0,
      sma50: 84.50,
      sma200: 78.20,
      priceToSma200: 10.49,
      high52w: 88.50,
      low52w: 66.80,
      drawdownFromHigh: -2.37,
      trend: 'ALTA',
      supportPrice: 83.50,
      resistancePrice: 89.00
    },
    fundamental: {
      peRatio: 0,
      dividendYield: 0,
      ter: 0.12,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 17800,
      currency: 'USD',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [83.9, 84.5, 85.0, 85.2, 85.5, 85.8, 86.4]
  },
  {
    id: 'xdwh',
    ticker: 'XDWH',
    name: 'Xtrackers MSCI World Health Care UCITS ETF (1C)',
    isin: 'IE00BM67HK77',
    category: 'Saúde',
    currentPrice: 54.80,
    previousClose: 55.40,
    dailyChange: -1.08,
    signal: 'STRONG_BUY',
    score: 87,
    signalReason: 'Setor defensivo clássico com múltiplos comprimidos e RSI em 33 (sobrevenda acentuada). Excelente proteção assimétrica para portefólios prudentes.',
    technical: {
      rsi: 33.2,
      sma50: 56.10,
      sma200: 55.80,
      priceToSma200: -1.79,
      high52w: 59.40,
      low52w: 48.90,
      drawdownFromHigh: -7.74,
      trend: 'LATERAL',
      supportPrice: 53.50,
      resistancePrice: 57.00
    },
    fundamental: {
      peRatio: 17.5,
      dividendYield: 1.80,
      ter: 0.25,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 2200,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [57.1, 56.5, 56.2, 55.8, 55.9, 55.4, 54.8]
  },
  {
    id: 'xffe',
    ticker: 'XFFE',
    name: 'Xtrackers MSCI World Energy UCITS ETF (1C)',
    isin: 'IE00BM67HM91',
    category: 'Energia & Recursos',
    currentPrice: 42.10,
    previousClose: 42.90,
    dailyChange: -1.86,
    signal: 'STRONG_BUY',
    score: 84,
    signalReason: 'Forte correção de preços devido a volatilidade do petróleo. P/E extraordinariamente baixo (8.9) e dividend yield gerador de caixa robusto.',
    technical: {
      rsi: 29.8,
      sma50: 44.50,
      sma200: 43.80,
      priceToSma200: -3.88,
      high52w: 48.20,
      low52w: 38.40,
      drawdownFromHigh: -12.66,
      trend: 'BAIXA',
      supportPrice: 41.00,
      resistancePrice: 45.00
    },
    fundamental: {
      peRatio: 8.9,
      dividendYield: 3.90,
      ter: 0.25,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 1400,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [45.0, 44.2, 43.8, 43.2, 43.1, 42.9, 42.1]
  },
  {
    id: 'cbu0',
    ticker: 'CBU0',
    name: 'iShares $ Treasury Bond 7-10yr UCITS ETF (EUR Hedged)',
    isin: 'IE00BD8PGZ49',
    category: 'Obrigações & Refúgio',
    currentPrice: 4.88,
    previousClose: 4.87,
    dailyChange: 0.21,
    signal: 'BUY',
    score: 77,
    signalReason: 'Yield to maturity atrativo com proteção cambial EUR. Potencial ganho de capital relevante em caso de aceleração de cortes de taxas pelos bancos centrais.',
    technical: {
      rsi: 49.5,
      sma50: 4.84,
      sma200: 4.79,
      priceToSma200: 1.88,
      high52w: 5.10,
      low52w: 4.55,
      drawdownFromHigh: -4.31,
      trend: 'LATERAL',
      supportPrice: 4.78,
      resistancePrice: 5.02
    },
    fundamental: {
      peRatio: 0,
      dividendYield: 3.65,
      ter: 0.10,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 3400,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Agora',
    sparkline: [4.82, 4.84, 4.85, 4.86, 4.86, 4.87, 4.88]
  },
  {
    id: 'inrg',
    ticker: 'INRG',
    name: 'iShares Global Clean Energy UCITS ETF (USD) Dist',
    isin: 'IE00B1XNHC34',
    category: 'Energia & Recursos',
    currentPrice: 7.42,
    previousClose: 7.72,
    dailyChange: -3.89,
    signal: 'STRONG_SELL',
    score: 18,
    signalReason: 'Estrutura técnica severamente deteriorada, perda do suporte da SMA 200 e custos elevados (TER 0.65%). Distribuição ineficiente para residentes fiscais em Portugal.',
    technical: {
      rsi: 26.1,
      sma50: 8.10,
      sma200: 8.65,
      priceToSma200: -14.22,
      high52w: 10.40,
      low52w: 7.30,
      drawdownFromHigh: -28.65,
      trend: 'BAIXA',
      supportPrice: 7.20,
      resistancePrice: 8.20
    },
    fundamental: {
      peRatio: 22.4,
      dividendYield: 1.45,
      ter: 0.65,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 2700,
      currency: 'EUR',
      accumulating: false
    },
    lastUpdated: 'Agora',
    sparkline: [8.2, 8.0, 7.9, 7.8, 7.75, 7.72, 7.42]
  }
];

// Calcula o sinal e pontuação de oportunidade com base na abordagem híbrida (técnica + fundamental)
export function evaluateMarketSignal(etf: Partial<MarketEtf>): { signal: MarketSignalType; score: number; reason: string } {
  const rsi = etf.technical?.rsi ?? 50;
  const priceToSma200 = etf.technical?.priceToSma200 ?? 0;
  const drawdown = etf.technical?.drawdownFromHigh ?? 0;
  const pe = etf.fundamental?.peRatio ?? 20;
  const ter = etf.fundamental?.ter ?? 0.20;
  const isAcc = etf.fundamental?.accumulating ?? true;

  // Pontuação técnica base (50 pontos possíveis)
  let techScore = 25;
  if (rsi < 32) techScore += 22; // Sobrevenda severa = oportunidade
  else if (rsi < 42) techScore += 14;
  else if (rsi > 70) techScore -= 20; // Sobrecompra excessiva = perigo
  else if (rsi > 64) techScore -= 10;

  if (priceToSma200 < -8) techScore += 10; // Desconto em relação à tendência de longo prazo
  else if (priceToSma200 > 18) techScore -= 12; // Esticado demais

  // Pontuação fundamental/macro (35 pontos possíveis)
  let fundScore = 20;
  if (pe > 0 && pe < 15) fundScore += 12; // Valuation barato
  else if (pe > 30) fundScore -= 12; // Múltiplos caros

  if (drawdown < -10 && pe < 20) fundScore += 8; // Oportunidade "Buy the Dip" de qualidade

  // Eficiência de custos e fiscal (15 pontos possíveis)
  let effScore = 8;
  if (ter <= 0.15) effScore += 5;
  else if (ter > 0.40) effScore -= 5;
  if (isAcc) effScore += 2; // Otimizado para fiscalidade portuguesa

  let totalScore = Math.max(5, Math.min(98, techScore + fundScore + effScore));

  let signal: MarketSignalType = 'NEUTRAL';
  let reason = '';

  if (totalScore >= 80) {
    signal = 'STRONG_BUY';
    reason = `Oportunidade de compra de alta convicção. Sobrevenda técnica acentuada (RSI ${rsi.toFixed(1)}) associada a valuation atrativo e custos eficientes.`;
  } else if (totalScore >= 65) {
    signal = 'BUY';
    reason = `Sinal positivo de acumulação. Posição equilibrada face à média de 200 dias (${priceToSma200 > 0 ? '+' : ''}${priceToSma200.toFixed(1)}%) com risco/recompensa favorável.`;
  } else if (totalScore >= 40) {
    signal = 'NEUTRAL';
    reason = `Ativo em zona de consolidação. Indicadores técnicos neutros (RSI ${rsi.toFixed(1)}); recomendado manter posições existentes e aguardar confirmação.`;
  } else if (totalScore >= 25) {
    signal = 'TRIM';
    reason = `Sinal de alerta e realização parcial. Preço esticado (${priceToSma200 > 0 ? '+' : ''}${priceToSma200.toFixed(1)}% vs SMA200) ou indicadores sobrecomprados.`;
  } else {
    signal = 'STRONG_SELL';
    reason = `Venda recomendada. Exaustão técnica extrema ou deterioração severa de tendência com ineficiência de custos.`;
  }

  return { signal, score: totalScore, reason };
}

// Gera resumo e métricas do mercado global
export function generateMarketSummary(etfs: MarketEtf[]): MarketSummary {
  let bullishCount = 0;
  let bearishCount = 0;
  let neutralCount = 0;

  let totalRsi = 0;
  let aboveSma200Count = 0;

  let topGainer = etfs[0] || { ticker: 'VWCE', name: 'Global', dailyChange: 0 };
  let topLoser = etfs[0] || { ticker: 'VWCE', name: 'Global', dailyChange: 0 };

  const sectorChanges: Record<string, { totalChange: number; count: number }> = {};

  etfs.forEach(etf => {
    if (etf.signal === 'STRONG_BUY' || etf.signal === 'BUY') bullishCount++;
    else if (etf.signal === 'STRONG_SELL' || etf.signal === 'TRIM') bearishCount++;
    else neutralCount++;

    totalRsi += etf.technical.rsi;
    if (etf.technical.priceToSma200 > 0) aboveSma200Count++;

    if (etf.dailyChange > topGainer.dailyChange) topGainer = etf;
    if (etf.dailyChange < topLoser.dailyChange) topLoser = etf;

    const cat = etf.category;
    if (!sectorChanges[cat]) sectorChanges[cat] = { totalChange: 0, count: 0 };
    sectorChanges[cat].totalChange += etf.dailyChange;
    sectorChanges[cat].count += 1;
  });

  const avgRsi = etfs.length > 0 ? totalRsi / etfs.length : 50;
  const pctAboveSma200 = etfs.length > 0 ? (aboveSma200Count / etfs.length) * 100 : 50;

  // Fear & Greed Index calculado por média de momentum e amplitude de mercado
  let fearGreedIndex = Math.round((avgRsi * 0.6) + (pctAboveSma200 * 0.4));
  fearGreedIndex = Math.max(5, Math.min(95, fearGreedIndex));

  let fearGreedLabel: MarketSummary['fearGreedLabel'] = 'Neutro';
  if (fearGreedIndex <= 25) fearGreedLabel = 'Extremo Medo';
  else if (fearGreedIndex <= 45) fearGreedLabel = 'Medo';
  else if (fearGreedIndex <= 55) fearGreedLabel = 'Neutro';
  else if (fearGreedIndex <= 75) fearGreedLabel = 'Ganância';
  else fearGreedLabel = 'Extrema Ganância';

  let leadingSector = 'Global';
  let maxSectorAvg = -999;
  let laggingSector = 'Energia';
  let minSectorAvg = 999;

  Object.entries(sectorChanges).forEach(([cat, data]) => {
    const avg = data.totalChange / data.count;
    if (avg > maxSectorAvg) {
      maxSectorAvg = avg;
      leadingSector = cat;
    }
    if (avg < minSectorAvg) {
      minSectorAvg = avg;
      laggingSector = cat;
    }
  });

  return {
    bullishCount,
    bearishCount,
    neutralCount,
    fearGreedIndex,
    fearGreedLabel,
    topGainer: { ticker: topGainer.ticker, name: topGainer.name, change: topGainer.dailyChange },
    topLoser: { ticker: topLoser.ticker, name: topLoser.name, change: topLoser.dailyChange },
    leadingSector,
    laggingSector,
    totalTracked: etfs.length
  };
}

// Simula flutuação contínua de cotações de mercado para teste de scanning em tempo real
export function tickMarketPrices(etfs: MarketEtf[]): { updatedEtfs: MarketEtf[]; newAlerts: MarketAlert[] } {
  const newAlerts: MarketAlert[] = [];
  const updatedEtfs = etfs.map(etf => {
    // Flutuação subtil realista (-0.35% a +0.35%)
    const deltaPercent = (Math.random() - 0.49) * 0.6;
    const newPrice = Number((etf.currentPrice * (1 + deltaPercent / 100)).toFixed(2));
    const newDailyChange = Number((etf.dailyChange + deltaPercent * 0.4).toFixed(2));
    
    // Atualiza RSI ligeiramente com base no movimento
    let newRsi = Number((etf.technical.rsi + deltaPercent * 1.5).toFixed(1));
    newRsi = Math.max(15, Math.min(88, newRsi));

    // Atualiza drawdown e distância à SMA 200
    const newPriceToSma200 = Number((((newPrice - etf.technical.sma200) / etf.technical.sma200) * 100).toFixed(2));
    const newDrawdown = Number((((newPrice - etf.technical.high52w) / etf.technical.high52w) * 100).toFixed(2));

    const technical = {
      ...etf.technical,
      rsi: newRsi,
      priceToSma200: newPriceToSma200,
      drawdownFromHigh: newDrawdown
    };

    const evaluation = evaluateMarketSignal({ ...etf, currentPrice: newPrice, technical });

    // Se o sinal mudou para Forte Compra ou Forte Venda, dispara um alerta em tempo real
    if (evaluation.signal !== etf.signal && (evaluation.signal === 'STRONG_BUY' || evaluation.signal === 'STRONG_SELL')) {
      newAlerts.push({
        id: `alert-${etf.ticker}-${Date.now()}`,
        ticker: etf.ticker,
        etfName: etf.name,
        signal: evaluation.signal,
        type: evaluation.signal === 'STRONG_BUY' ? 'opportunity' : 'warning',
        timestamp: new Date(),
        title: evaluation.signal === 'STRONG_BUY' ? `🔥 Oportunidade Rara: ${etf.ticker}` : `⚠️ Alerta de Risco: ${etf.ticker}`,
        message: evaluation.reason,
        read: false
      });
    }

    const sparkline = [...etf.sparkline.slice(1), newPrice];

    return {
      ...etf,
      currentPrice: newPrice,
      dailyChange: newDailyChange,
      signal: evaluation.signal,
      score: evaluation.score,
      signalReason: evaluation.reason,
      technical,
      sparkline,
      lastUpdated: 'Em direto'
    };
  });

  return { updatedEtfs, newAlerts };
}
