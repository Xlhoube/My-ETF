import { useState, useEffect, useMemo } from 'react';
import { MarketEtf, DemoTradePosition } from '../types';
import { 
  PlayCircle, 
  TrendingUp, 
  DollarSign, 
  Wallet, 
  PlusCircle, 
  Trash2, 
  RefreshCcw, 
  ShieldCheck, 
  Target, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle
} from 'lucide-react';

interface AssetDemoSimulatorProps {
  marketEtfs: MarketEtf[];
  initialTicker?: string | null;
  onNavigateToTab?: (tab: 'home' | 'longterm' | 'signals' | 'radar') => void;
}

// Histórico de rentabilidade média anual estimada por classe de ETF
const ESTIMATED_ANNUAL_RETURNS: Record<string, number> = {
  vwce: 8.2,   // All-World histórico ~8%
  spyi: 8.4,   // ACWI IMI
  sxr8: 10.5,  // S&P 500 histórico ~10%
  iwda: 8.6,   // World
  sxrv: 14.8,  // Nasdaq 100
  qdve: 16.5,  // Info Tech
  meud: 6.8,   // Europa 600
  eimi: 7.2,   // Emergentes
  fusd: 9.1,   // Quality Income
  dfnd: 12.0,  // Defesa
  sgld: 6.5,   // Ouro
  xdwh: 8.9,   // Saúde
  xffe: 7.5,   // Energia
  cbu0: 3.8,   // Obrigações governamentais
  inrg: 5.5    // Clean Energy
};

export default function AssetDemoSimulator({ marketEtfs, initialTicker, onNavigateToTab }: AssetDemoSimulatorProps) {
  // 1. Estado da Conta Demo (sem registo, persistido em localStorage)
  const INITIAL_DEMO_CASH = 10000;

  const [demoCash, setDemoCash] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('my_etf_demo_cash');
      return saved ? Number(saved) : INITIAL_DEMO_CASH;
    } catch {
      return INITIAL_DEMO_CASH;
    }
  });

  const [demoPositions, setDemoPositions] = useState<DemoTradePosition[]>(() => {
    try {
      const saved = localStorage.getItem('my_etf_demo_positions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Erro ao ler posições demo:', e);
    }
    // Posição de demonstração predefinida para o utilizador ver logo o funcionamento
    return [
      {
        id: 'demo-initial-1',
        ticker: 'VWCE',
        name: 'Vanguard FTSE All-World UCITS ETF (Acc)',
        shares: 10,
        entryPrice: 165.20,
        entryDate: '2026-08-15',
        totalCost: 1652.00,
        category: 'Global'
      }
    ];
  });

  // Grava o saldo e as posições no browser
  useEffect(() => {
    try {
      localStorage.setItem('my_etf_demo_cash', demoCash.toString());
      localStorage.setItem('my_etf_demo_positions', JSON.stringify(demoPositions));
    } catch (e) {
      console.error('Erro ao guardar estado demo:', e);
    }
  }, [demoCash, demoPositions]);

  // Modo de visualização: 'projection' (Evolução de Ativo Específico) vs 'portfolio' (A Minha Carteira Demo)
  const [activeSubTab, setActiveSubTab] = useState<'projection' | 'portfolio'>('projection');

  // ETF selecionado para a projeção de evolução
  const [selectedTicker, setSelectedTicker] = useState<string>(() => {
    if (initialTicker && marketEtfs.some(e => e.ticker.toLowerCase() === initialTicker.toLowerCase())) {
      return initialTicker.toUpperCase();
    }
    return 'VWCE';
  });

  // Atualiza quando a prop externa initialTicker muda
  useEffect(() => {
    if (initialTicker && marketEtfs.some(e => e.ticker.toLowerCase() === initialTicker.toLowerCase())) {
      setSelectedTicker(initialTicker.toUpperCase());
    }
  }, [initialTicker, marketEtfs]);

  // Parâmetros da Simulação de Evolução
  const [initialLumpSum, setInitialLumpSum] = useState<number>(1000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(150);
  const [timeHorizonYears, setTimeHorizonYears] = useState<number>(10);

  // Parâmetros para Adicionar Nova Ordem Demo
  const [orderShares, setOrderShares] = useState<number>(5);
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null);

  // Encontra o ETF atual selecionado
  const currentEtf = useMemo(() => {
    return marketEtfs.find(e => e.ticker.toUpperCase() === selectedTicker.toUpperCase()) || marketEtfs[0];
  }, [selectedTicker, marketEtfs]);

  // Taxa de retorno anual esperada para o ETF selecionado
  const expectedReturnRate = useMemo(() => {
    if (!currentEtf) return 8.0;
    return ESTIMATED_ANNUAL_RETURNS[currentEtf.id] || 8.0;
  }, [currentEtf]);

  // Cálculo da projeção matemática de evolução (Juros Compostos com aportes mensais)
  const projectionData = useMemo(() => {
    const monthlyRate = Math.pow(1 + expectedReturnRate / 100, 1 / 12) - 1;
    const totalMonths = timeHorizonYears * 12;

    let balance = initialLumpSum;
    let totalInvested = initialLumpSum;
    const yearlyPoints: { year: number; invested: number; total: number }[] = [
      { year: 0, invested: initialLumpSum, total: initialLumpSum }
    ];

    for (let m = 1; m <= totalMonths; m++) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      totalInvested += monthlyContribution;

      if (m % 12 === 0) {
        const year = m / 12;
        yearlyPoints.push({
          year,
          invested: Math.round(totalInvested),
          total: Math.round(balance)
        });
      }
    }

    const finalBalance = Math.round(balance);
    const finalInvested = Math.round(totalInvested);
    const profit = finalBalance - finalInvested;
    const totalReturnPercent = finalInvested > 0 ? Number(((profit / finalInvested) * 100).toFixed(1)) : 0;

    return {
      yearlyPoints,
      finalBalance,
      finalInvested,
      profit,
      totalReturnPercent
    };
  }, [initialLumpSum, monthlyContribution, timeHorizonYears, expectedReturnRate]);

  // Cálculos consolidados da Carteira Demo
  const portfolioSummary = useMemo(() => {
    let investedInPositions = 0;
    let currentValueInPositions = 0;

    const detailedPositions = demoPositions.map(pos => {
      const liveEtf = marketEtfs.find(e => e.ticker.toUpperCase() === pos.ticker.toUpperCase());
      const currentPrice = liveEtf ? liveEtf.currentPrice : pos.entryPrice;
      const curValue = Number((pos.shares * currentPrice).toFixed(2));
      const pnl = Number((curValue - pos.totalCost).toFixed(2));
      const pnlPercent = pos.totalCost > 0 ? Number(((pnl / pos.totalCost) * 100).toFixed(2)) : 0;

      investedInPositions += pos.totalCost;
      currentValueInPositions += curValue;

      return {
        ...pos,
        currentPrice,
        currentValue: curValue,
        pnl,
        pnlPercent,
        liveEtf
      };
    });

    const totalEquity = Number((demoCash + currentValueInPositions).toFixed(2));
    const totalPnl = Number((currentValueInPositions - investedInPositions).toFixed(2));
    const totalPnlPercent = investedInPositions > 0 ? Number(((totalPnl / investedInPositions) * 100).toFixed(2)) : 0;

    return {
      detailedPositions,
      investedInPositions: Number(investedInPositions.toFixed(2)),
      currentValueInPositions: Number(currentValueInPositions.toFixed(2)),
      totalEquity,
      totalPnl,
      totalPnlPercent
    };
  }, [demoPositions, marketEtfs, demoCash]);

  // Executa uma ordem de compra demo com cotações reais da bolsa
  const handleExecuteDemoOrder = (ticker: string, sharesToBuy: number) => {
    const etf = marketEtfs.find(e => e.ticker.toUpperCase() === ticker.toUpperCase());
    if (!etf) return;

    const cost = Number((sharesToBuy * etf.currentPrice).toFixed(2));
    if (cost > demoCash) {
      alert(`Saldo demo insuficiente! Custo da ordem: ${cost.toFixed(2)} € | Saldo disponível: ${demoCash.toFixed(2)} €.`);
      return;
    }

    const newPosition: DemoTradePosition = {
      id: `demo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ticker: etf.ticker,
      name: etf.name,
      shares: sharesToBuy,
      entryPrice: etf.currentPrice,
      entryDate: new Date().toISOString().split('T')[0],
      totalCost: cost,
      category: etf.category
    };

    setDemoPositions(prev => [newPosition, ...prev]);
    setDemoCash(prev => Number((prev - cost).toFixed(2)));
    
    setOrderSuccessMessage(`Compraste ${sharesToBuy} unidades de ${etf.ticker} a ${etf.currentPrice.toFixed(2)} € na tua Conta Demo.`);
    setTimeout(() => setOrderSuccessMessage(null), 4500);
  };

  // Vende / Encerra uma posição demo e liberta liquidez
  const handleClosePosition = (positionId: string) => {
    const pos = portfolioSummary.detailedPositions.find(p => p.id === positionId);
    if (!pos) return;

    if (!confirm(`Desejas fechar a posição demo de ${pos.shares} unidades de ${pos.ticker} por ${pos.currentValue.toFixed(2)} €?`)) {
      return;
    }

    setDemoPositions(prev => prev.filter(p => p.id !== positionId));
    setDemoCash(prev => Number((prev + pos.currentValue).toFixed(2)));
  };

  // Reinicia a conta demo para os 10.000 € originais
  const handleResetDemoAccount = () => {
    if (confirm('Tens a certeza de que desejas reiniciar a Conta Demo? O saldo voltará a 10.000 € e as posições serão limpas.')) {
      setDemoCash(INITIAL_DEMO_CASH);
      setDemoPositions([]);
      localStorage.removeItem('my_etf_demo_cash');
      localStorage.removeItem('my_etf_demo_positions');
    }
  };

  return (
    <div className="tab-pane active" style={{ animation: 'fadeIn 0.3s ease' }}>
      
      {/* 1. CABEÇALHO DO SIMULADOR DEMO */}
      <div className="card" style={{ 
        padding: '2rem', 
        marginBottom: '1.5rem', 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(56, 189, 248, 0.08) 50%, rgba(0, 0, 0, 0.95))',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #10b981, #38bdf8)' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.25rem 0.65rem', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.18)', border: '1px solid rgba(16, 185, 129, 0.35)', marginBottom: '0.75rem' }}>
              <PlayCircle size={14} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Simulador de Ativos &amp; Conta Demo Livre
              </span>
              <span style={{ fontSize: '0.72rem', background: '#10b981', color: '#000', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                Sem Registo
              </span>
            </div>

            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: '0.5rem' }}>
              Simula a Evolução de Qualquer Ativo com Cotações Reais
            </h2>
            
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '780px', lineHeight: 1.6 }}>
              Aprende e testa estratégias sem arriscar capital real. Escolhe qualquer ETF cotado nas bolsas europeias (XETRA e Euronext), projeta o crescimento a longo prazo com juros compostos ou simula compras diretas como se tivesses uma conta de corretora aberta.
            </p>
          </div>

          {/* BOTÃO REINICIAR CONTA DEMO */}
          <button 
            onClick={handleResetDemoAccount}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem', gap: '0.4rem' }}
            title="Repor Saldo Demo para 10.000 €"
          >
            <RefreshCcw size={14} />
            <span>Repor Conta Demo (10.000 €)</span>
          </button>
        </div>

        {/* BARRA DE SALDO VIRTUAL DA CONTA DEMO */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '1rem', 
          padding: '1.25rem', 
          background: 'rgba(0, 0, 0, 0.55)', 
          borderRadius: '12px',
          border: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Wallet size={13} style={{ color: '#38bdf8' }} /> Saldo Líquido Demo
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>
              {demoCash.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Layers size={13} style={{ color: '#10b981' }} /> Capital em Posições
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {portfolioSummary.currentValueInPositions.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <DollarSign size={13} style={{ color: '#f59e0b' }} /> Património Total Demo
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {portfolioSummary.totalEquity.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <TrendingUp size={13} style={{ color: portfolioSummary.totalPnl >= 0 ? '#10b981' : '#ef4444' }} /> Rentabilidade Não Realizada
            </div>
            <div style={{ 
              fontSize: '1.35rem', 
              fontWeight: 800, 
              color: portfolioSummary.totalPnl >= 0 ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              {portfolioSummary.totalPnl >= 0 ? '+' : ''}{portfolioSummary.totalPnl.toFixed(2)} €
              <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', background: portfolioSummary.totalPnl >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}>
                {portfolioSummary.totalPnl >= 0 ? '+' : ''}{portfolioSummary.totalPnlPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* FEEDBACK DE ORDEM EXECUTADA */}
        {orderSuccessMessage && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem 1rem', 
            borderRadius: '8px', 
            background: 'rgba(16, 185, 129, 0.2)', 
            border: '1px solid #10b981',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.88rem',
            animation: 'fadeIn 0.25s ease'
          }}>
            <CheckCircle2 size={18} />
            <span>{orderSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* 2. ALTERNADOR DE MODO: PROJEÇÃO DE ATIVO vs POSIÇÕES DA CONTA DEMO */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveSubTab('projection')}
          className={`btn ${activeSubTab === 'projection' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ 
            padding: '0.7rem 1.4rem', 
            fontSize: '0.9rem', 
            gap: '0.5rem',
            background: activeSubTab === 'projection' ? '#10b981' : undefined,
            color: activeSubTab === 'projection' ? '#000' : undefined
          }}
        >
          <TrendingUp size={16} />
          <span>Projetar Evolução de Ativo</span>
        </button>

        <button
          onClick={() => setActiveSubTab('portfolio')}
          className={`btn ${activeSubTab === 'portfolio' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ 
            padding: '0.7rem 1.4rem', 
            fontSize: '0.9rem', 
            gap: '0.5rem',
            background: activeSubTab === 'portfolio' ? '#38bdf8' : undefined,
            color: activeSubTab === 'portfolio' ? '#000' : undefined
          }}
        >
          <Wallet size={16} />
          <span>Posições na Conta Demo ({demoPositions.length})</span>
        </button>
      </div>

      {/* 3. VISTA 1: PROJETAR EVOLUÇÃO DE ATIVO ESPECÍFICO */}
      {activeSubTab === 'projection' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          
          {/* PAINEL DE CONTROLO DO ATIVO E PARÂMETROS */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={20} style={{ color: '#10b981' }} />
              Configurar Simulação de Ativo
            </h3>

            {/* SELETOR DE ATIVO */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Seleciona o ETF a Simular:
              </label>
              
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {marketEtfs.map(etf => {
                  const isSelected = etf.ticker.toUpperCase() === selectedTicker.toUpperCase();
                  return (
                    <button
                      key={etf.id}
                      onClick={() => setSelectedTicker(etf.ticker)}
                      style={{
                        padding: '0.5rem 0.85rem',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid #10b981' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        color: isSelected ? '#10b981' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{etf.ticker}</span>
                      <span style={{ fontSize: '0.72rem', color: isSelected ? '#10b981' : 'var(--text-muted)' }}>
                        {etf.currentPrice.toFixed(2)} €
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CARTÃO DE RESUMO DO ATIVO SELECIONADO */}
            {currentEtf && (
              <div style={{ 
                padding: '1.25rem', 
                borderRadius: '10px', 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid var(--border-color)',
                marginBottom: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Nome Oficial do ETF
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                    {currentEtf.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    ISIN: {currentEtf.isin} · Bolsa Real: {currentEtf.lastUpdated}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Cotação em Bolsa
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                    {currentEtf.currentPrice.toFixed(2)} €
                  </div>
                  <div style={{ fontSize: '0.78rem', color: currentEtf.dailyChange >= 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                    {currentEtf.dailyChange >= 0 ? '+' : ''}{currentEtf.dailyChange.toFixed(2)}% hoje
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Taxa Anual Histórica Estimada
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', marginTop: '0.15rem' }}>
                    {expectedReturnRate.toFixed(1)}%/ano
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Com base no índice histórico subjacente
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Ação Rápida Demo
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                    <input 
                      type="number" 
                      min="1" 
                      max="100" 
                      value={orderShares}
                      onChange={e => setOrderShares(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ 
                        width: '70px', 
                        padding: '0.4rem', 
                        borderRadius: '6px', 
                        background: 'rgba(0, 0, 0, 0.4)', 
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        textAlign: 'center',
                        fontSize: '0.85rem'
                      }}
                      title="Número de unidades virtuais"
                    />
                    <button
                      onClick={() => handleExecuteDemoOrder(currentEtf.ticker, orderShares)}
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', gap: '0.35rem', background: '#10b981', color: '#000' }}
                    >
                      <PlusCircle size={14} />
                      <span>Comprar Demo ({(orderShares * currentEtf.currentPrice).toFixed(2)} €)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CONTROLADORES SLIDERS DA SIMULAÇÃO */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Investimento Inicial:
                  </label>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>
                    {initialLumpSum.toLocaleString('pt-PT')} €
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="20000" 
                  step="250"
                  value={initialLumpSum} 
                  onChange={e => setInitialLumpSum(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10b981' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>0 €</span>
                  <span>10.000 €</span>
                  <span>20.000 €</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Reforço Mensal (DCA):
                  </label>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8' }}>
                    {monthlyContribution.toLocaleString('pt-PT')} €/mês
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1500" 
                  step="25"
                  value={monthlyContribution} 
                  onChange={e => setMonthlyContribution(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#38bdf8' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>0 €/mês</span>
                  <span>500 €/mês</span>
                  <span>1.500 €/mês</span>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Horizonte Temporal:
                  </label>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f59e0b' }}>
                    {timeHorizonYears} Anos
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="1"
                  value={timeHorizonYears} 
                  onChange={e => setTimeHorizonYears(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#f59e0b' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>1 Ano</span>
                  <span>15 Anos</span>
                  <span>30 Anos</span>
                </div>
              </div>
            </div>

            {/* RESULTADO DA PROJEÇÃO: CARTÕES DE MÉTRICA */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '1rem',
              marginBottom: '1.75rem'
            }}>
              <div style={{ padding: '1.25rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Capital Total Investido do Teu Bolso</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                  {projectionData.finalInvested.toLocaleString('pt-PT')} €
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {initialLumpSum} € inicial + {(monthlyContribution * 12 * timeHorizonYears).toLocaleString('pt-PT')} € em reforços
                </div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>Lucro Gerado pelos Juros Compostos</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: '0.35rem' }}>
                  +{projectionData.profit.toLocaleString('pt-PT')} €
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.2rem' }}>
                  Rentabilidade acumulada de +{projectionData.totalReturnPercent}%
                </div>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>Património Final Estimado</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.35rem' }}>
                  {projectionData.finalBalance.toLocaleString('pt-PT')} €
                </div>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.2rem' }}>
                  Ao fim de {timeHorizonYears} anos a {expectedReturnRate.toFixed(1)}%/ano
                </div>
              </div>
            </div>

            {/* GRÁFICO VISUAL DE EVOLUÇÃO TEMPORAL (SVG INTERATIVO) */}
            <div style={{ 
              padding: '1.5rem', 
              borderRadius: '12px', 
              background: 'rgba(0, 0, 0, 0.45)', 
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} style={{ color: '#10b981' }} />
                  Curva de Crescimento com Juros Compostos ({timeHorizonYears} Anos)
                </h4>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38bdf8' }} />
                    Património Acumulado
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-muted)' }} />
                    Capital Investido
                  </span>
                </div>
              </div>

              {/* CURVA SVG */}
              <div style={{ width: '100%', height: '240px', position: 'relative' }}>
                {(() => {
                  const points = projectionData.yearlyPoints;
                  const maxVal = Math.max(...points.map(p => p.total), 1);
                  const svgWidth = 800;
                  const svgHeight = 200;
                  const padding = 20;

                  // Calcula coordenadas
                  const investedPath = points.map((p, idx) => {
                    const x = padding + (idx / (points.length - 1)) * (svgWidth - 2 * padding);
                    const y = svgHeight - padding - (p.invested / maxVal) * (svgHeight - 2 * padding);
                    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  }).join(' ');

                  const totalPath = points.map((p, idx) => {
                    const x = padding + (idx / (points.length - 1)) * (svgWidth - 2 * padding);
                    const y = svgHeight - padding - (p.total / maxVal) * (svgHeight - 2 * padding);
                    return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  }).join(' ');

                  const totalArea = `${totalPath} L ${svgWidth - padding} ${svgHeight - padding} L ${padding} ${svgHeight - padding} Z`;

                  return (
                    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="demoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Linhas de grelha horizontais */}
                      <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
                      <line x1={padding} y1={(svgHeight - padding) / 2} x2={svgWidth - padding} y2={(svgHeight - padding) / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                      {/* Área sombreada */}
                      <path d={totalArea} fill="url(#demoGrad)" />

                      {/* Linha de Capital Investido */}
                      <path d={investedPath} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="5 5" />

                      {/* Linha de Património Acumulado */}
                      <path d={totalPath} fill="none" stroke="#38bdf8" strokeWidth="3.5" />

                      {/* Pontos nos anos chave */}
                      {points.map((p, idx) => {
                        const x = padding + (idx / (points.length - 1)) * (svgWidth - 2 * padding);
                        const y = svgHeight - padding - (p.total / maxVal) * (svgHeight - 2 * padding);
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={y} r="4" fill="#38bdf8" stroke="#000" strokeWidth="2" />
                            { (idx === 0 || idx === Math.floor(points.length / 2) || idx === points.length - 1) && (
                              <text 
                                x={x} 
                                y={y - 10} 
                                textAnchor="middle" 
                                fill="#ffffff" 
                                fontSize="10" 
                                fontWeight="bold"
                              >
                                {p.total.toLocaleString('pt-PT')} €
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  );
                })()}
              </div>

              {/* RODAPÉ DO GRÁFICO COM ANOS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
                <span>Ano 0</span>
                <span>Ano {Math.round(timeHorizonYears / 2)}</span>
                <span>Ano {timeHorizonYears}</span>
              </div>
            </div>

            {/* NOTA PEDAGÓGICA SOBRE A FISCALIDADE */}
            <div style={{ 
              padding: '1rem 1.25rem', 
              borderRadius: '8px', 
              background: 'rgba(16, 185, 129, 0.08)', 
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)'
            }}>
              <ShieldCheck size={20} style={{ color: '#10b981', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#10b981' }}>Vantagem Fiscal dos ETFs de Acumulação (Acc):</strong> Ao contrário de ações ou fundos distributivos onde pagas 28% de retenção na fonte em cada dividendo em Portugal, num ETF como o {currentEtf.ticker} os dividendos são reinvestidos sem corte fiscal, permitindo que a totalidade dos juros compostos trabalhe a teu favor.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. VISTA 2: A MINHA CARTEIRA DEMO (PAPER TRADING ATIVO) */}
      {activeSubTab === 'portfolio' && (
        <div className="card" style={{ padding: '1.75rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Wallet size={20} style={{ color: '#38bdf8' }} />
                Posições Virtuais Abertas na Conta Demo
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Estas posições estão gravadas localmente no teu browser e atualizam as cotações em direto com as bolsas reais.
              </p>
            </div>

            <button 
              onClick={() => setActiveSubTab('projection')}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', gap: '0.4rem', background: '#10b981', color: '#000' }}
            >
              <PlusCircle size={15} />
              <span>Simular Nova Compra</span>
            </button>
          </div>

          {/* LISTA DE POSIÇÕES DEMO */}
          {portfolioSummary.detailedPositions.length === 0 ? (
            <div style={{ 
              padding: '3rem 1.5rem', 
              textAlign: 'center', 
              borderRadius: '10px', 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: '1px dashed var(--border-color)' 
            }}>
              <Wallet size={40} style={{ color: 'var(--text-muted)', opacity: 0.4, margin: '0 auto 0.75rem' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Ainda não tens posições abertas na Conta Demo</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
                Tens 10.000 € virtuais disponíveis. Escolhe um ETF no separador "Projetar Evolução de Ativo" e simula a tua primeira compra sem risco.
              </p>
              <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setActiveSubTab('projection')}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.2rem', fontSize: '0.85rem', background: '#10b981', color: '#000' }}
                >
                  Abrir Primeira Posição Demo
                </button>
                {onNavigateToTab && (
                  <button 
                    onClick={() => onNavigateToTab('signals')}
                    className="btn btn-secondary"
                    style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
                  >
                    Ver Sinais de Compra
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>ETF / Ativo</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Unidades</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Preço de Compra</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Cotação em Bolsa</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Total Investido</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Valor Atual</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Rentabilidade Demo</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioSummary.detailedPositions.map(pos => {
                    const isProfit = pos.pnl >= 0;
                    return (
                      <tr key={pos.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.15s ease' }}>
                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>{pos.ticker}</span>
                            {pos.category && (
                              <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                                {pos.category}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {pos.name}
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700 }}>
                          {pos.shares} unid.
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>
                          {pos.entryPrice.toFixed(2)} €
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {pos.currentPrice.toFixed(2)} €
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>
                          {pos.totalCost.toFixed(2)} €
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {pos.currentValue.toFixed(2)} €
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem' }}>
                          <div style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.25rem', 
                            fontWeight: 800, 
                            color: isProfit ? '#10b981' : '#ef4444' 
                          }}>
                            {isProfit ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            <span>{isProfit ? '+' : ''}{pos.pnl.toFixed(2)} €</span>
                            <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>({isProfit ? '+' : ''}{pos.pnlPercent.toFixed(1)}%)</span>
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 0.5rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleClosePosition(pos.id)}
                            className="btn btn-secondary"
                            style={{ 
                              padding: '0.35rem 0.65rem', 
                              fontSize: '0.75rem', 
                              gap: '0.3rem', 
                              color: '#ef4444', 
                              borderColor: 'rgba(239, 68, 68, 0.3)' 
                            }}
                            title="Fechar posição virtual e devolver liquidez ao saldo demo"
                          >
                            <Trash2 size={12} />
                            <span>Vender</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* DICA DE ORIENTAÇÃO PEDAGÓGICA */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            borderRadius: '8px', 
            background: 'rgba(56, 189, 248, 0.08)', 
            border: '1px solid rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)'
          }}>
            <HelpCircle size={18} style={{ color: '#38bdf8', flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <strong style={{ color: '#38bdf8' }}>Como funciona esta Conta Demo:</strong>
              <div style={{ marginTop: '0.2rem' }}>
                Não precisas de criar conta, nem de facultar dados pessoais ou cartão. O saldo de 10.000 € e as tuas ordens virtuais ficam guardados em segurança no teu navegador. Podes usar este simulador para testar decisões e ver como os ETFs reais se comportariam antes de investires dinheiro real na tua corretora (como a XTB).
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
