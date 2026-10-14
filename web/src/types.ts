// Definições de tipos para a plataforma de Scanner & Oportunidades de Mercado My ETF

export type DomicileType = 'IE' | 'LU' | 'US' | 'DE' | 'FR' | 'Outro';
export type DistType = 'Acc' | 'Dist'; // Acc = Acumulação, Dist = Distribuição
export type RepType = 'Physical' | 'Synthetic'; // Físico ou Sintético

export type MarketSignalType = 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'TRIM' | 'STRONG_SELL';

export type MarketCategory = 
  | 'Global'
  | 'EUA'
  | 'Europa'
  | 'Mercados Emergentes'
  | 'Tecnologia & IA'
  | 'Saúde'
  | 'Energia & Recursos'
  | 'Defesa & Aeroespacial'
  | 'Dividendos & Qualidade'
  | 'Obrigações & Refúgio'
  | 'Matérias-Primas';

export interface TechnicalIndicators {
  rsi: number; // 0-100 (Ex: 28 = Sobrevenda, 75 = Sobrecompra)
  sma50: number; // Média móvel 50 dias
  sma200: number; // Média móvel 200 dias
  priceToSma200: number; // Percentagem acima/abaixo da SMA 200 (ex: +4.2% ou -6.1%)
  high52w: number; // Máximo de 52 semanas
  low52w: number; // Mínimo de 52 semanas
  drawdownFromHigh: number; // Desconto em % face ao topo histórico de 52 semanas (ex: -12.4%)
  trend: 'ALTA' | 'BAIXA' | 'LATERAL';
  supportPrice: number;
  resistancePrice: number;
}

export interface FundamentalMetrics {
  peRatio: number; // Múltiplo Preço/Lucro estimado
  dividendYield: number; // Yield anual em %
  ter: number; // Custo de gestão anual (TER) em %
  replication: RepType;
  domicile: DomicileType;
  aumMillions: number; // Volume sob gestão em Milhões de Euros
  currency: string;
  accumulating: boolean;
}

export interface MarketEtf {
  id: string;
  ticker: string;
  name: string;
  isin: string;
  category: MarketCategory;
  currentPrice: number;
  previousClose: number;
  dailyChange: number; // % diária
  signal: MarketSignalType;
  score: number; // 0 a 100 (Score composto de oportunidade)
  signalReason: string;
  technical: TechnicalIndicators;
  fundamental: FundamentalMetrics;
  lastUpdated: string;
  sparkline: number[]; // Últimos 7 pontos para mini gráfico
  isWatchlisted?: boolean;
}

export interface MarketSummary {
  bullishCount: number;
  bearishCount: number;
  neutralCount: number;
  fearGreedIndex: number; // 0-100
  fearGreedLabel: 'Extremo Medo' | 'Medo' | 'Neutro' | 'Ganância' | 'Extrema Ganância';
  topGainer: { ticker: string; name: string; change: number };
  topLoser: { ticker: string; name: string; change: number };
  leadingSector: string;
  laggingSector: string;
  totalTracked: number;
}

export interface MarketAlert {
  id: string;
  ticker: string;
  etfName: string;
  signal: MarketSignalType;
  type: 'opportunity' | 'warning' | 'info';
  timestamp: Date;
  title: string;
  message: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  timestamp: Date;
}

// Tipos legados para compatibilidade com utilitários e modais existentes
export interface ETF {
  id: string;
  ticker: string;
  name: string;
  ter: number;
  domicile: DomicileType;
  distribution: DistType;
  replication: RepType;
  weight: number;
  amountInvested: number;
  currentValue: number;
  lastPrice?: number;
  dailyChange?: number;
  previousClose?: number;
}

export interface PortfolioAlert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  details?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  isDemo?: boolean;
  broker?: 'XTB' | 'DEGIRO' | 'Trading212' | 'Interactive Brokers' | 'Outro';
  etfs: ETF[];
}

export interface UserProfile {
  name: string;
  broker: string;
}
