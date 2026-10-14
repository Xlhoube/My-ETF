import { useState } from 'react';
import { MarketEtf, MarketSignalType, MarketSummary } from '../types';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Info, 
  RefreshCw, 
  Activity, 
  Flame, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  X
} from 'lucide-react';

interface MarketRadarProps {
  etfs: MarketEtf[];
  summary: MarketSummary;
  isScanning: boolean;
  onToggleAutoScan: () => void;
  onManualScan: () => void;
  onToggleWatchlist: (ticker: string) => void;
  onAskAdvisor: (query: string) => void;
}

export default function MarketRadar({
  etfs,
  summary,
  isScanning,
  onToggleAutoScan,
  onManualScan,
  onToggleWatchlist,
  onAskAdvisor
}: MarketRadarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [selectedSignal, setSelectedSignal] = useState<string>('TODOS');
  const [sortBy, setSortBy] = useState<'score' | 'change' | 'rsi' | 'ter'>('score');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedEtf, setSelectedEtf] = useState<MarketEtf | null>(null);

  const categories: { label: string; value: string }[] = [
    { label: 'Todos os Mercados', value: 'TODAS' },
    { label: '🌍 Globais', value: 'Global' },
    { label: '🇺🇸 EUA', value: 'EUA' },
    { label: '🇪🇺 Europa', value: 'Europa' },
    { label: '🚀 Tecnologia & IA', value: 'Tecnologia & IA' },
    { label: '🛡️ Defesa', value: 'Defesa & Aeroespacial' },
    { label: '🏥 Saúde', value: 'Saúde' },
    { label: '⚡ Energia', value: 'Energia & Recursos' },
    { label: '💵 Dividendos & Qualidade', value: 'Dividendos & Qualidade' },
    { label: '🌏 Emergentes', value: 'Mercados Emergentes' },
    { label: '🏛️ Obrigações', value: 'Obrigações & Refúgio' },
    { label: '🪙 Ouro & Matérias-Primas', value: 'Matérias-Primas' }
  ];

  // Filtra e ordena a lista
  const filteredEtfs = etfs.filter(etf => {
    const matchesSearch = 
      etf.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      etf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      etf.isin.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'TODAS' || etf.category === selectedCategory;

    let matchesSignal = true;
    if (selectedSignal === 'BUY') {
      matchesSignal = etf.signal === 'STRONG_BUY' || etf.signal === 'BUY';
    } else if (selectedSignal === 'SELL') {
      matchesSignal = etf.signal === 'STRONG_SELL' || etf.signal === 'TRIM';
    } else if (selectedSignal === 'NEUTRAL') {
      matchesSignal = etf.signal === 'NEUTRAL';
    } else if (selectedSignal === 'WATCHLIST') {
      matchesSignal = !!etf.isWatchlisted;
    }

    return matchesSearch && matchesCategory && matchesSignal;
  }).sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'change') return b.dailyChange - a.dailyChange;
    if (sortBy === 'rsi') return a.technical.rsi - b.technical.rsi;
    if (sortBy === 'ter') return a.fundamental.ter - b.fundamental.ter;
    return 0;
  });

  const getSignalBadge = (signal: MarketSignalType) => {
    switch (signal) {
      case 'STRONG_BUY':
        return (
          <span style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem', 
            background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', 
            border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '20px', 
            padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 700 
          }}>
            <Flame size={13} /> FORTE COMPRA
          </span>
        );
      case 'BUY':
        return (
          <span style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem', 
            background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', 
            border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '20px', 
            padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 700 
          }}>
            <ArrowUpRight size={13} /> COMPRA
          </span>
        );
      case 'NEUTRAL':
        return (
          <span style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem', 
            background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', 
            border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '20px', 
            padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 700 
          }}>
            <Activity size={13} /> NEUTRO
          </span>
        );
      case 'TRIM':
        return (
          <span style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem', 
            background: 'rgba(249, 115, 22, 0.15)', color: '#fb923c', 
            border: '1px solid rgba(249, 115, 22, 0.35)', borderRadius: '20px', 
            padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 700 
          }}>
            <AlertTriangle size={13} /> REALIZAR PARCIAL
          </span>
        );
      case 'STRONG_SELL':
        return (
          <span style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem', 
            background: 'rgba(239, 68, 68, 0.18)', color: '#f87171', 
            border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '20px', 
            padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontWeight: 700 
          }}>
            <ArrowDownRight size={13} /> FORTE VENDA
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 65) return '#34d399';
    if (score >= 40) return '#fbbf24';
    if (score >= 25) return '#fb923c';
    return '#f87171';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* BARRA DE PULSO DO MERCADO (MACRO BAROMETER) */}
      <div className="card" style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(0, 0, 0, 0.9))' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
          
          {/* FEAR & GREED GAUGE */}
          <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Sentimento de Mercado
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: summary.fearGreedIndex > 60 ? '#10b981' : summary.fearGreedIndex < 40 ? '#ef4444' : '#f59e0b' }}>
                {summary.fearGreedIndex}
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                / 100 — {summary.fearGreedLabel}
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
              <div style={{ 
                width: `${summary.fearGreedIndex}%`, 
                height: '100%', 
                background: `linear-gradient(90deg, #ef4444, #f59e0b, #10b981)`,
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* SINAIS ACTIVOS (BULL/BEAR RATIO) */}
          <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Distribuição de Oportunidades
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: 700 }}>
                <TrendingUp size={16} /> {summary.bullishCount} Compras
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f59e0b', fontWeight: 700 }}>
                • {summary.neutralCount} Neutros
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontWeight: 700 }}>
                <TrendingDown size={16} /> {summary.bearishCount} Vendas
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Total de {summary.totalTracked} ETFs europeus sob monitorização
            </div>
          </div>

          {/* DESTAQUES DIÁRIOS */}
          <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Líder vs Retardatário
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>🏆 {summary.topGainer.ticker}</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>+{summary.topGainer.change.toFixed(2)}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>📉 {summary.topLoser.ticker}</span>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>{summary.topLoser.change.toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* CONTROLO DE SCANNING EM DIRETO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                width: '10px', height: '10px', borderRadius: '50%', 
                background: isScanning ? '#10b981' : '#f59e0b',
                boxShadow: isScanning ? '0 0 10px #10b981' : 'none',
                display: 'inline-block'
              }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isScanning ? 'Radar Contínuo Ativo (30s)' : 'Scanner em Pausa'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <button 
                onClick={onToggleAutoScan}
                className="btn btn-secondary" 
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', flex: 1 }}
              >
                {isScanning ? 'Pausar' : 'Ativar Auto-Scan'}
              </button>
              <button 
                onClick={onManualScan}
                className="btn btn-primary" 
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', gap: '0.3rem' }}
                title="Atualizar cotações e recalcular sinais agora"
              >
                <RefreshCw size={13} /> Scan Já
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* BARRA DE FILTROS E PESQUISA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* FILTRO DE SINAIS PRINCIPAIS (TABS) */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setSelectedSignal('TODOS')}
              className={`btn ${selectedSignal === 'TODOS' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
            >
              Todos ({etfs.length})
            </button>
            <button 
              onClick={() => setSelectedSignal('BUY')}
              className={`btn ${selectedSignal === 'BUY' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                fontSize: '0.8rem', padding: '0.5rem 1rem',
                borderColor: selectedSignal === 'BUY' ? '#10b981' : undefined,
                color: selectedSignal === 'BUY' ? '#000' : '#10b981'
              }}
            >
              🔥 Oportunidades de Compra ({summary.bullishCount})
            </button>
            <button 
              onClick={() => setSelectedSignal('SELL')}
              className={`btn ${selectedSignal === 'SELL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                fontSize: '0.8rem', padding: '0.5rem 1rem',
                borderColor: selectedSignal === 'SELL' ? '#ef4444' : undefined,
                color: selectedSignal === 'SELL' ? '#000' : '#ef4444'
              }}
            >
              ⚠️ Sinais de Venda / Trim ({summary.bearishCount})
            </button>
            <button 
              onClick={() => setSelectedSignal('NEUTRAL')}
              className={`btn ${selectedSignal === 'NEUTRAL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
            >
              🟡 Neutros ({summary.neutralCount})
            </button>
            <button 
              onClick={() => setSelectedSignal('WATCHLIST')}
              className={`btn ${selectedSignal === 'WATCHLIST' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', gap: '0.4rem' }}
            >
              <Star size={14} fill={selectedSignal === 'WATCHLIST' ? 'currentColor' : 'none'} /> 
              Watchlist ({etfs.filter(e => e.isWatchlisted).length})
            </button>
          </div>

          {/* ALTERNADOR DE VISTA (GRELHA / TABELA) */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setViewMode('grid')}
              style={{ 
                background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--text-on-primary)' : 'var(--text-secondary)',
                border: 'none', borderRadius: '6px', padding: '0.35rem 0.65rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600
              }}
            >
              Cartões
            </button>
            <button 
              onClick={() => setViewMode('table')}
              style={{ 
                background: viewMode === 'table' ? 'var(--primary)' : 'transparent',
                color: viewMode === 'table' ? 'var(--text-on-primary)' : 'var(--text-secondary)',
                border: 'none', borderRadius: '6px', padding: '0.35rem 0.65rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600
              }}
            >
              Tabela Quantitativa
            </button>
          </div>
        </div>

        {/* BARRA DE PESQUISA, CATEGORIAS E ORDENAÇÃO */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* CAMPO DE PESQUISA */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text"
              placeholder="Pesquisar por Ticker (ex: VWCE, SXR8), Nome ou ISIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* SELETOR DE CATEGORIA */}
          <div style={{ minWidth: '180px' }}>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* SELETOR DE ORDENAÇÃO */}
          <div style={{ minWidth: '170px' }}>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="score">🎯 Maior Score Oportunidade</option>
              <option value="change">📈 Maior Variação Diária</option>
              <option value="rsi">📉 Menor RSI (Sobrevenda)</option>
              <option value="ter">💎 Menor Custo (TER)</option>
            </select>
          </div>

        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL (GRELHA DE CARTÕES OU TABELA) */}
      {filteredEtfs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Info size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Nenhum ETF encontrado com estes filtros</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tenta limpar os termos de pesquisa ou selecionar outra categoria no radar.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* VISTA EM GRELHA DE CARTÕES */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filteredEtfs.map(etf => {
            const isBuy = etf.signal === 'STRONG_BUY' || etf.signal === 'BUY';
            const isSell = etf.signal === 'STRONG_SELL' || etf.signal === 'TRIM';
            const cardGlow = isBuy ? '0 0 16px rgba(16, 185, 129, 0.15)' : isSell ? '0 0 16px rgba(239, 68, 68, 0.12)' : 'none';

            return (
              <div 
                key={etf.id} 
                className="card" 
                style={{ 
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  boxShadow: cardGlow,
                  borderColor: isBuy ? 'rgba(16, 185, 129, 0.35)' : isSell ? 'rgba(239, 68, 68, 0.35)' : undefined,
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                <div>
                  {/* TOPO DO CARTÃO */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                          {etf.ticker}
                        </span>
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                          {etf.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.3, maxHeight: '2.6em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {etf.name}
                      </div>
                    </div>

                    <button 
                      onClick={() => onToggleWatchlist(etf.ticker)}
                      style={{ 
                        background: 'transparent', border: 'none', cursor: 'pointer', 
                        color: etf.isWatchlisted ? '#fbbf24' : 'var(--text-muted)',
                        padding: '0.25rem'
                      }}
                      title={etf.isWatchlisted ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Star size={18} fill={etf.isWatchlisted ? '#fbbf24' : 'none'} />
                    </button>
                  </div>

                  {/* PREÇO E VARIAÇÃO */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div>
                      <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {etf.currentPrice.toFixed(2)}€
                      </span>
                    </div>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.25rem',
                      color: etf.dailyChange >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: 700, fontSize: '0.9rem'
                    }}>
                      {etf.dailyChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {etf.dailyChange >= 0 ? `+${etf.dailyChange.toFixed(2)}%` : `${etf.dailyChange.toFixed(2)}%`}
                    </div>
                  </div>

                  {/* SINAL E SCORE COMPOSTO */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      {getSignalBadge(etf.signal)}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score:</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: getScoreColor(etf.score) }}>
                          {etf.score}/100
                        </span>
                      </div>
                    </div>

                    <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${etf.score}%`, 
                        height: '100%', 
                        background: getScoreColor(etf.score),
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  </div>

                  {/* RAZÃO CIRÚRGICA DO RADAR */}
                  <div style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    padding: '0.65rem 0.85rem', 
                    borderRadius: '8px', 
                    fontSize: '0.8rem', 
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    marginBottom: '1rem',
                    borderLeft: `3px solid ${getScoreColor(etf.score)}`
                  }}>
                    {etf.signalReason}
                  </div>

                  {/* QUADRO DE INDICADORES RÁPIDOS */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.75rem' }}>
                    <div style={{ background: 'var(--bg-glass)', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <div style={{ color: 'var(--text-muted)' }}>RSI (14)</div>
                      <div style={{ fontWeight: 700, color: etf.technical.rsi < 35 ? '#10b981' : etf.technical.rsi > 68 ? '#ef4444' : 'var(--text-primary)' }}>
                        {etf.technical.rsi.toFixed(1)}
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-glass)', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <div style={{ color: 'var(--text-muted)' }}>vs SMA 200</div>
                      <div style={{ fontWeight: 700, color: etf.technical.priceToSma200 >= 0 ? '#10b981' : '#ef4444' }}>
                        {etf.technical.priceToSma200 >= 0 ? `+${etf.technical.priceToSma200.toFixed(1)}%` : `${etf.technical.priceToSma200.toFixed(1)}%`}
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-glass)', padding: '0.4rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <div style={{ color: 'var(--text-muted)' }}>Custo TER</div>
                      <div style={{ fontWeight: 700, color: etf.fundamental.ter <= 0.15 ? '#10b981' : 'var(--text-primary)' }}>
                        {etf.fundamental.ter.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => setSelectedEtf(etf)}
                    className="btn btn-secondary" 
                    style={{ flex: 1, fontSize: '0.78rem', padding: '0.5rem' }}
                  >
                    Raio-X Técnico
                  </button>
                  <button 
                    onClick={() => onAskAdvisor(`Audita o ETF ${etf.ticker} (${etf.name}) com cotação a ${etf.currentPrice}€ e sinal ${etf.signal}. É boa oportunidade agora?`)}
                    className="btn btn-primary" 
                    style={{ fontSize: '0.78rem', padding: '0.5rem 0.85rem' }}
                    title="Pedir auditoria em linguagem natural ao Consultor de Elite"
                  >
                    <Zap size={13} /> Consultar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISTA EM TABELA QUANTITATIVA */
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Ativo</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Preço</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Var. Dia</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Sinal</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Score</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>RSI (14)</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>vs SMA200</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>Drawdown 52w</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>P/E Est.</th>
                <th style={{ padding: '0.85rem 0.75rem' }}>TER</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredEtfs.map((etf, idx) => (
                <tr 
                  key={etf.id} 
                  style={{ 
                    borderBottom: '1px solid var(--border-color)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)'
                  }}
                >
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={() => onToggleWatchlist(etf.ticker)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: etf.isWatchlisted ? '#fbbf24' : 'var(--text-muted)' }}
                      >
                        <Star size={14} fill={etf.isWatchlisted ? '#fbbf24' : 'none'} />
                      </button>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{etf.ticker}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{etf.category} • {etf.fundamental.domicile}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700 }}>
                    {etf.currentPrice.toFixed(2)}€
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: etf.dailyChange >= 0 ? '#10b981' : '#ef4444' }}>
                    {etf.dailyChange >= 0 ? `+${etf.dailyChange.toFixed(2)}%` : `${etf.dailyChange.toFixed(2)}%`}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem' }}>
                    {getSignalBadge(etf.signal)}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 800, color: getScoreColor(etf.score) }}>
                    {etf.score}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600, color: etf.technical.rsi < 35 ? '#10b981' : etf.technical.rsi > 68 ? '#ef4444' : 'var(--text-primary)' }}>
                    {etf.technical.rsi.toFixed(1)}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: etf.technical.priceToSma200 >= 0 ? '#10b981' : '#ef4444' }}>
                    {etf.technical.priceToSma200 >= 0 ? `+${etf.technical.priceToSma200.toFixed(1)}%` : `${etf.technical.priceToSma200.toFixed(1)}%`}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: etf.technical.drawdownFromHigh < -10 ? '#ef4444' : 'var(--text-secondary)' }}>
                    {etf.technical.drawdownFromHigh.toFixed(1)}%
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: 'var(--text-secondary)' }}>
                    {etf.fundamental.peRatio > 0 ? etf.fundamental.peRatio.toFixed(1) : 'N/A'}
                  </td>
                  <td style={{ padding: '0.85rem 0.75rem', color: etf.fundamental.ter <= 0.15 ? '#10b981' : 'var(--text-secondary)' }}>
                    {etf.fundamental.ter.toFixed(2)}%
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => setSelectedEtf(etf)}
                      className="btn btn-secondary" 
                      style={{ fontSize: '0.72rem', padding: '0.35rem 0.65rem' }}
                    >
                      Raio-X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE RAIO-X TÉCNICO E FUNDAMENTAL */}
      {selectedEtf && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem', zIndex: 9999
        }}>
          <div className="card" style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative' }}>
            
            <button 
              onClick={() => setSelectedEtf(null)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            {/* CABEÇALHO DO MODAL */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingRight: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{selectedEtf.ticker}</h2>
                  {getSignalBadge(selectedEtf.signal)}
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: getScoreColor(selectedEtf.score), background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Score: {selectedEtf.score}/100
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{selectedEtf.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  ISIN: <strong>{selectedEtf.isin}</strong> • Categoria: <strong>{selectedEtf.category}</strong>
                </div>
              </div>
            </div>

            {/* PREÇO EM DESTAQUE */}
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              background: 'rgba(255, 255, 255, 0.03)', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cotação Atual de Mercado</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{selectedEtf.currentPrice.toFixed(2)}€</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Variação Diária</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: selectedEtf.dailyChange >= 0 ? '#10b981' : '#ef4444' }}>
                  {selectedEtf.dailyChange >= 0 ? `+${selectedEtf.dailyChange.toFixed(2)}%` : `${selectedEtf.dailyChange.toFixed(2)}%`}
                </div>
              </div>
            </div>

            {/* DIAGNÓSTICO E JUSTIFICAÇÃO */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={16} style={{ color: 'var(--primary)' }} /> Veredito do Radar de Oportunidades
              </h4>
              <p style={{ background: 'var(--bg-glass)', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: `4px solid ${getScoreColor(selectedEtf.score)}`, fontSize: '0.88rem', lineHeight: 1.5 }}>
                {selectedEtf.signalReason}
              </p>
            </div>

            {/* GRELHA TÉCNICA QUANTITATIVA */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Métricas Técnicas & Níveis Chave</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div style={{ background: 'var(--bg-glass)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Índice de Força Relativa (RSI 14)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: selectedEtf.technical.rsi < 35 ? '#10b981' : selectedEtf.technical.rsi > 68 ? '#ef4444' : 'var(--text-primary)' }}>
                    {selectedEtf.technical.rsi.toFixed(1)} {selectedEtf.technical.rsi < 35 ? '(Sobrevenda / Desconto)' : selectedEtf.technical.rsi > 68 ? '(Sobrecompra / Cautela)' : '(Neutro)'}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-glass)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Posição vs SMA 200 (Tendência Primária)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: selectedEtf.technical.priceToSma200 >= 0 ? '#10b981' : '#ef4444' }}>
                    {selectedEtf.technical.priceToSma200 >= 0 ? `+${selectedEtf.technical.priceToSma200.toFixed(2)}% acima` : `${selectedEtf.technical.priceToSma200.toFixed(2)}% abaixo`}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-glass)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Suporte Chave / Resistência</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    Suporte: <span style={{ color: '#10b981' }}>{selectedEtf.technical.supportPrice.toFixed(2)}€</span> • Res: <span style={{ color: '#ef4444' }}>{selectedEtf.technical.resistancePrice.toFixed(2)}€</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-glass)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Intervalo de 52 Semanas</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    Mín {selectedEtf.technical.low52w.toFixed(2)}€ — Máx {selectedEtf.technical.high52w.toFixed(2)}€ ({selectedEtf.technical.drawdownFromHigh.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>

            {/* GRELHA FUNDAMENTAL & EFICIÊNCIA FISCAL */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Estrutura & Otimização Fiscal (UCITS PT)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div style={{ background: 'var(--bg-glass)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Custo Anual (TER)</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedEtf.fundamental.ter <= 0.15 ? '#10b981' : 'var(--text-primary)' }}>
                    {selectedEtf.fundamental.ter.toFixed(2)}%
                  </div>
                </div>

                <div style={{ background: 'var(--bg-glass)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Domicílio & Tratado</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedEtf.fundamental.domicile === 'IE' ? '#10b981' : 'var(--text-primary)' }}>
                    {selectedEtf.fundamental.domicile} {selectedEtf.fundamental.domicile === 'IE' ? '(Tratado EUA 15%)' : ''}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-glass)', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Política de Dividendos</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: selectedEtf.fundamental.accumulating ? '#10b981' : '#f59e0b' }}>
                    {selectedEtf.fundamental.accumulating ? 'Acumulação (Isento IRS)' : 'Distribuição'}
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÕES NO FUNDO DO MODAL */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => setSelectedEtf(null)}
                className="btn btn-secondary" 
                style={{ padding: '0.6rem 1.25rem' }}
              >
                Fechar
              </button>
              <button 
                onClick={() => {
                  const ticker = selectedEtf.ticker;
                  setSelectedEtf(null);
                  onAskAdvisor(`Faz uma auditoria completa ao ETF ${ticker}. Qual é a estratégia de entrada recomendada e os principais catalisadores macro?`);
                }}
                className="btn btn-primary" 
                style={{ padding: '0.6rem 1.25rem', gap: '0.4rem' }}
              >
                <Zap size={14} /> Perguntar ao Consultor
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
