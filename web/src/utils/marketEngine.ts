import { MarketEtf, MarketSignalType, MarketSummary, MarketAlert } from '../types';

// Base curada de ETFs UCITS de topo negociados em bolsas europeias
export const INITIAL_MARKET_ETFS: MarketEtf[] = [
  {
    id: 'vwce',
    ticker: 'VWCE',
    name: 'Vanguard FTSE All-World UCITS ETF (USD) Acc',
    isin: 'IE00BK5BQT80',
    category: 'Global',
    currentPrice: 172.62,
    previousClose: 172.92,
    dailyChange: -0.17,
    signal: 'BUY',
    score: 75,
    signalReason: 'Consolidação saudável acima da SMA 200 com RSI equilibrado (51). Excelente ponto de entrada para alocação global sistemática.',
    technical: {
      rsi: 51.4,
      sma50: 169.80,
      sma200: 156.40,
      priceToSma200: 10.37,
      high52w: 174.50,
      low52w: 128.40,
      drawdownFromHigh: -1.08,
      trend: 'ALTA',
      supportPrice: 168.00,
      resistancePrice: 174.50
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
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [170.5, 171.2, 172.0, 171.8, 172.4, 172.92, 172.62]
  },
  {
    id: 'sxr8',
    ticker: 'SXR8',
    name: 'iShares Core S&P 500 UCITS ETF (Acc)',
    isin: 'IE00B5BMR087',
    category: 'EUA',
    currentPrice: 752.00,
    previousClose: 750.62,
    dailyChange: 0.18,
    signal: 'NEUTRAL',
    score: 62,
    signalReason: 'Próximo de máximos históricos com RSI em 62. Rácio P/E de 25.1 sugere valorização esticada; aguardar pequeno pullback para compras de grande dimensão.',
    technical: {
      rsi: 62.1,
      sma50: 735.00,
      sma200: 672.00,
      priceToSma200: 11.90,
      high52w: 758.00,
      low52w: 520.00,
      drawdownFromHigh: -0.79,
      trend: 'ALTA',
      supportPrice: 730.00,
      resistancePrice: 758.00
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
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [742.0, 745.5, 748.2, 749.0, 750.1, 750.62, 752.00]
  },
  {
    id: 'sxrv',
    ticker: 'SXRV',
    name: 'iShares Nasdaq 100 UCITS ETF (DE) Acc',
    isin: 'DE000A0F5UF5',
    category: 'Tecnologia & IA',
    currentPrice: 1563.00,
    previousClose: 1596.40,
    dailyChange: -2.09,
    signal: 'TRIM',
    score: 36,
    signalReason: 'RSI atingiu níveis sobrecomprados (>68) antes do recuo recente. P/E de 31.8 e extensão de 13.2% face à SMA 200 aconselham realização de mais-valias parciais.',
    technical: {
      rsi: 65.5,
      sma50: 1540.00,
      sma200: 1380.00,
      priceToSma200: 13.26,
      high52w: 1610.00,
      low52w: 1050.00,
      drawdownFromHigh: -2.92,
      trend: 'ALTA',
      supportPrice: 1520.00,
      resistancePrice: 1610.00
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
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [1580.0, 1590.0, 1610.0, 1605.0, 1598.0, 1596.40, 1563.00]
  },
  {
    id: 'qdve',
    ticker: 'QDVE',
    name: 'iShares S&P 500 Information Technology Sector UCITS ETF',
    isin: 'IE00B3WJKG14',
    category: 'Tecnologia & IA',
    currentPrice: 47.96,
    previousClose: 49.25,
    dailyChange: -2.62,
    signal: 'TRIM',
    score: 32,
    signalReason: 'Setor de semicondutores e software com múltiplos extremos e RSI em 68 antes de fraqueza técnica. Momento propício a realocação defensiva.',
    technical: {
      rsi: 68.2,
      sma50: 47.50,
      sma200: 42.10,
      priceToSma200: 13.92,
      high52w: 50.80,
      low52w: 32.50,
      drawdownFromHigh: -5.59,
      trend: 'ALTA',
      supportPrice: 46.00,
      resistancePrice: 50.80
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
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [48.5, 49.0, 49.8, 50.2, 49.6, 49.25, 47.96]
  },
  {
    id: 'iwda',
    ticker: 'IWDA',
    name: 'iShares Core MSCI World UCITS ETF (Acc)',
    isin: 'IE00B4L5Y983',
    category: 'Global',
    currentPrice: 131.90,
    previousClose: 130.98,
    dailyChange: 0.70,
    signal: 'BUY',
    score: 78,
    signalReason: 'Custo ultrabaixo (TER 0.20%), alinhamento perfeito de médias móveis e forte suporte em 128.00€. Excelente para acumulação sistemática.',
    technical: {
      rsi: 54.0,
      sma50: 129.20,
      sma200: 118.50,
      priceToSma200: 11.31,
      high52w: 133.20,
      low52w: 96.00,
      drawdownFromHigh: -0.98,
      trend: 'ALTA',
      supportPrice: 128.00,
      resistancePrice: 133.50
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
    lastUpdated: 'Bolsa Real (Euronext Amsterdam)',
    sparkline: [129.5, 130.0, 130.8, 130.5, 131.0, 130.98, 131.90]
  },
  {
    id: 'spyi',
    ticker: 'SPYI',
    name: 'SPDR MSCI ACWI IMI UCITS ETF (Acc)',
    isin: 'IE00B3YLTY66',
    category: 'Global',
    currentPrice: 11.86,
    previousClose: 11.88,
    dailyChange: -0.17,
    signal: 'STRONG_BUY',
    score: 88,
    signalReason: 'O ETF mais abrangente do mercado (Grandes, Médias e Pequenas empresas globais com TER 0.17%). Recuperação sólida de suporte com volume crescente.',
    technical: {
      rsi: 48.2,
      sma50: 11.65,
      sma200: 10.70,
      priceToSma200: 10.84,
      high52w: 11.95,
      low52w: 8.80,
      drawdownFromHigh: -0.76,
      trend: 'ALTA',
      supportPrice: 11.50,
      resistancePrice: 12.00
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
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [11.65, 11.72, 11.80, 11.82, 11.85, 11.88, 11.86]
  },
  {
    id: 'meud',
    ticker: 'MEUD',
    name: 'Lyxor Core STOXX Europe 600 (DR) UCITS ETF',
    isin: 'LU0908500753',
    category: 'Europa',
    currentPrice: 314.70,
    previousClose: 308.60,
    dailyChange: 1.98,
    signal: 'BUY',
    score: 74,
    signalReason: 'Valuation europeu com desconto severo face aos EUA (P/E 13.8 vs 25.1). Dividend yield atrativo de 3.2% e apoio técnico na SMA 50.',
    technical: {
      rsi: 52.5,
      sma50: 309.00,
      sma200: 295.00,
      priceToSma200: 6.68,
      high52w: 320.00,
      low52w: 260.00,
      drawdownFromHigh: -1.66,
      trend: 'ALTA',
      supportPrice: 305.00,
      resistancePrice: 320.00
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
    lastUpdated: 'Bolsa Real (Euronext Paris)',
    sparkline: [305.0, 307.2, 308.0, 309.5, 308.6, 312.0, 314.70]
  },
  {
    id: 'eimi',
    ticker: 'EIMI',
    name: 'iShares Core MSCI EM IMI UCITS ETF (USD) Acc',
    isin: 'IE00BKM4GZ66',
    category: 'Mercados Emergentes',
    currentPrice: 47.87,
    previousClose: 49.44,
    dailyChange: -3.18,
    signal: 'STRONG_BUY',
    score: 86,
    signalReason: 'Oportunidade de compra em valor profundo: recuo recente para suporte chave. P/E médio atrativo de 11.4 com desconto histórico face aos mercados desenvolvidos.',
    technical: {
      rsi: 36.5,
      sma50: 47.90,
      sma200: 44.20,
      priceToSma200: 8.30,
      high52w: 50.50,
      low52w: 38.00,
      drawdownFromHigh: -5.21,
      trend: 'ALTA',
      supportPrice: 46.50,
      resistancePrice: 50.50
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
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [48.9, 49.2, 49.8, 50.1, 49.7, 49.44, 47.87]
  },
  {
    id: 'fusd',
    ticker: 'FUSD',
    name: 'Fidelity US Quality Income UCITS ETF (Acc)',
    isin: 'IE00BYXVGX24',
    category: 'Dividendos & Qualidade',
    currentPrice: 12.36,
    previousClose: 12.21,
    dailyChange: 1.23,
    signal: 'BUY',
    score: 81,
    signalReason: 'Foco em empresas com balanços sólidos e fluxo de caixa livre. Risco de queda reduzido com tendência técnica ascendente limpa.',
    technical: {
      rsi: 55.2,
      sma50: 12.15,
      sma200: 11.40,
      priceToSma200: 8.42,
      high52w: 12.50,
      low52w: 9.80,
      drawdownFromHigh: -1.12,
      trend: 'ALTA',
      supportPrice: 12.00,
      resistancePrice: 12.50
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
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [12.10, 12.15, 12.18, 12.20, 12.22, 12.21, 12.36]
  },
  {
    id: 'dfnd',
    ticker: 'DFND',
    name: 'VanEck Defense UCITS ETF (Acc)',
    isin: 'IE000YYE6WK5',
    category: 'Defesa & Aeroespacial',
    currentPrice: 50.75,
    previousClose: 50.01,
    dailyChange: 1.48,
    signal: 'BUY',
    score: 80,
    signalReason: 'Forte momentum geopolítico com encomendas governamentais recorde na Europa. Rompimento de resistência técnica com volume acima da média.',
    technical: {
      rsi: 62.8,
      sma50: 48.60,
      sma200: 41.20,
      priceToSma200: 23.18,
      high52w: 52.40,
      low52w: 29.50,
      drawdownFromHigh: -3.15,
      trend: 'ALTA',
      supportPrice: 48.00,
      resistancePrice: 52.40
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
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [48.5, 49.1, 49.6, 49.8, 50.2, 50.01, 50.75]
  },
  {
    id: 'sgld',
    ticker: 'SGLD',
    name: 'iShares Physical Gold ETC',
    isin: 'IE00B4ND3602',
    category: 'Matérias-Primas',
    currentPrice: 118.46,
    previousClose: 118.10,
    dailyChange: 0.30,
    signal: 'BUY',
    score: 76,
    signalReason: 'Refúgio contra inflação e incerteza geopolítica. Apoio estrutural de compras de bancos centrais mundiais; tendência de alta sólida.',
    technical: {
      rsi: 58.0,
      sma50: 115.80,
      sma200: 102.50,
      priceToSma200: 15.57,
      high52w: 121.00,
      low52w: 85.00,
      drawdownFromHigh: -2.10,
      trend: 'ALTA',
      supportPrice: 114.00,
      resistancePrice: 121.00
    },
    fundamental: {
      peRatio: 0,
      dividendYield: 0,
      ter: 0.12,
      replication: 'Physical',
      domicile: 'IE',
      aumMillions: 17800,
      currency: 'EUR',
      accumulating: true
    },
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [116.0, 116.8, 117.5, 117.9, 118.2, 118.10, 118.46]
  },
  {
    id: 'xdwh',
    ticker: 'XDWH',
    name: 'Xtrackers MSCI World Health Care UCITS ETF (1C)',
    isin: 'IE00BM67HK77',
    category: 'Saúde',
    currentPrice: 56.18,
    previousClose: 55.34,
    dailyChange: 1.52,
    signal: 'BUY',
    score: 79,
    signalReason: 'Setor defensivo clássico com múltiplos comprimidos e recuperação firme acima da SMA 50. Excelente proteção assimétrica para portefólios prudentes.',
    technical: {
      rsi: 48.2,
      sma50: 55.40,
      sma200: 53.60,
      priceToSma200: 4.81,
      high52w: 58.20,
      low52w: 48.50,
      drawdownFromHigh: -3.47,
      trend: 'ALTA',
      supportPrice: 54.50,
      resistancePrice: 58.20
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
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [54.8, 55.0, 55.2, 55.5, 55.4, 55.34, 56.18]
  },
  {
    id: 'xffe',
    ticker: 'XFFE',
    name: 'Xtrackers MSCI World Energy UCITS ETF (1C)',
    isin: 'IE00BM67HM91',
    category: 'Energia & Recursos',
    currentPrice: 194.26,
    previousClose: 193.03,
    dailyChange: 0.64,
    signal: 'STRONG_BUY',
    score: 83,
    signalReason: 'Valuation extraordinariamente atrativo com P/E baixo (8.9) e dividend yield gerador de caixa robusto.',
    technical: {
      rsi: 44.8,
      sma50: 191.50,
      sma200: 184.00,
      priceToSma200: 5.58,
      high52w: 205.00,
      low52w: 165.00,
      drawdownFromHigh: -5.24,
      trend: 'ALTA',
      supportPrice: 188.00,
      resistancePrice: 205.00
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
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [190.0, 191.5, 192.8, 193.5, 193.1, 193.03, 194.26]
  },
  {
    id: 'cbu0',
    ticker: 'CBU0',
    name: 'iShares $ Treasury Bond 7-10yr UCITS ETF (EUR Hedged)',
    isin: 'IE00BD8PGZ49',
    category: 'Obrigações & Refúgio',
    currentPrice: 5.36,
    previousClose: 5.35,
    dailyChange: 0.19,
    signal: 'BUY',
    score: 77,
    signalReason: 'Yield to maturity atrativo com proteção cambial EUR. Potencial ganho de capital relevante em caso de aceleração de cortes de taxas pelos bancos centrais.',
    technical: {
      rsi: 49.5,
      sma50: 5.34,
      sma200: 5.28,
      priceToSma200: 1.52,
      high52w: 5.55,
      low52w: 5.10,
      drawdownFromHigh: -3.42,
      trend: 'LATERAL',
      supportPrice: 5.25,
      resistancePrice: 5.50
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
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [5.33, 5.34, 5.35, 5.35, 5.36, 5.35, 5.36]
  },
  {
    id: 'inrg',
    ticker: 'INRG',
    name: 'iShares Global Clean Energy UCITS ETF (USD) Dist',
    isin: 'IE00B1XNHC34',
    category: 'Energia & Recursos',
    currentPrice: 8.71,
    previousClose: 8.83,
    dailyChange: -1.36,
    signal: 'TRIM',
    score: 38,
    signalReason: 'Estrutura técnica com pressão vendedora recente e custos elevados (TER 0.65%). Distribuição ineficiente para residentes fiscais em Portugal.',
    technical: {
      rsi: 38.5,
      sma50: 8.68,
      sma200: 8.95,
      priceToSma200: -2.68,
      high52w: 10.20,
      low52w: 7.90,
      drawdownFromHigh: -14.61,
      trend: 'LATERAL',
      supportPrice: 8.40,
      resistancePrice: 9.20
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
    lastUpdated: 'Bolsa Real (XETRA)',
    sparkline: [8.9, 8.85, 8.88, 8.82, 8.84, 8.83, 8.71]
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
