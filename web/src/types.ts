// Definições de tipos para a aplicação My ETF

export type DomicileType = 'IE' | 'LU' | 'US' | 'DE' | 'FR' | 'Outro';
export type DistType = 'Acc' | 'Dist'; // Acc = Acumulação, Dist = Distribuição
export type RepType = 'Physical' | 'Synthetic'; // Físico ou Sintético

export interface ETF {
  id: string;
  ticker: string;
  name: string;
  ter: number; // Percentagem, ex: 0.07 para 0.07%
  domicile: DomicileType;
  distribution: DistType;
  replication: RepType;
  weight: number; // Peso na carteira em %, ex: 60 para 60%
  amountInvested: number; // Valor investido em euros, ex: 5000 (custo de aquisição)
  currentValue: number; // Valor de mercado atual em euros, ex: 5500
  lastPrice?: number; // Cotação unitária da última atualização
  dailyChange?: number; // Variação diária em %
  previousClose?: number; // Preço de fecho anterior
}

export interface PortfolioAlert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  details?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  timestamp: Date;
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
