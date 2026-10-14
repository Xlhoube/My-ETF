import { useState, useEffect } from 'react';
import { MarketEtf, MarketAlert } from './types';
import { 
  INITIAL_MARKET_ETFS, 
  generateMarketSummary, 
  tickMarketPrices 
} from './utils/marketEngine';
import CleanHomeHub from './components/CleanHomeHub';
import LongTermTab from './components/LongTermTab';
import AppLogo from './components/AppLogo';
import MarketRadar from './components/MarketRadar';
import ActionableSignals from './components/ActionableSignals';
import SectorRotationTab from './components/SectorRotationTab';
import MarketChat from './components/MarketChat';
import BeginnerCompass from './components/BeginnerCompass';
import { 
  Home,
  ShieldCheck,
  Compass,
  Radar, 
  Target, 
  RotateCw, 
  Star, 
  MessageSquare, 
  Bell, 
  RefreshCw, 
  Sun, 
  Moon,
  SlidersHorizontal
} from 'lucide-react';

export default function App() {
  const [marketEtfs, setMarketEtfs] = useState<MarketEtf[]>(() => {
    try {
      const saved = localStorage.getItem('my_etf_market_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Erro ao ler dados de mercado do localStorage:', e);
    }
    return INITIAL_MARKET_ETFS;
  });

  // Modo de Experiência: 'simple' (Calmo e sem ruído, predefinido) vs 'advanced' (Cockpit analítico completo)
  const [experienceMode, setExperienceMode] = useState<'simple' | 'advanced'>(() => {
    try {
      const saved = localStorage.getItem('my_etf_experience_mode');
      return (saved === 'advanced' || saved === 'simple') ? saved : 'simple';
    } catch {
      return 'simple';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('my_etf_experience_mode', experienceMode);
    } catch (e) {
      console.error('Erro ao salvar experienceMode:', e);
    }
  }, [experienceMode]);

  // Tab ativa: inicia sempre em 'home' para uma receção acolhedora e sem sobrecarga
  const [activeTab, setActiveTab] = useState<'home' | 'longterm' | 'guide' | 'signals' | 'radar' | 'rotation' | 'watchlist' | 'chat'>('home');
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [triggeredChatQuery, setTriggeredChatQuery] = useState<{ text: string; timestamp: number } | null>(null);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem('my_etf_theme');
      return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Aplica o tema visual no elemento HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('my_etf_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Grava dados de mercado no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('my_etf_market_data', JSON.stringify(marketEtfs));
    } catch (e) {
      console.error('Erro ao salvar dados de mercado:', e);
    }
  }, [marketEtfs]);

  // Calcula o sumário macro do mercado
  const summary = generateMarketSummary(marketEtfs);

  // Ciclo de monitorização contínua de mercado (Scanning a cada 25 segundos se ativado)
  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setMarketEtfs(prev => {
        const { updatedEtfs, newAlerts } = tickMarketPrices(prev);
        if (newAlerts.length > 0) {
          setAlerts(currAlerts => [...newAlerts, ...currAlerts].slice(0, 20));
        }
        return updatedEtfs;
      });
    }, 25000);

    return () => clearInterval(interval);
  }, [isScanning]);

  // Força atualização manual imediata
  const handleManualScan = () => {
    setMarketEtfs(prev => {
      const { updatedEtfs, newAlerts } = tickMarketPrices(prev);
      if (newAlerts.length > 0) {
        setAlerts(currAlerts => [...newAlerts, ...currAlerts].slice(0, 20));
      }
      return updatedEtfs;
    });
  };

  // Alterna o estado da Watchlist
  const handleToggleWatchlist = (ticker: string) => {
    setMarketEtfs(prev => prev.map(etf => {
      if (etf.ticker === ticker) {
        return { ...etf, isWatchlisted: !etf.isWatchlisted };
      }
      return etf;
    }));
  };

  // Transfere uma consulta para o Consultor de Mercado
  const handleAskAdvisor = (query: string) => {
    setTriggeredChatQuery({ text: query, timestamp: Date.now() });
    setActiveTab('chat');
  };

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  return (
    <div className="app-container">
      
      {/* SIDEBAR DE NAVEGAÇÃO ADAPTATIVA */}
      <aside className="sidebar">
        
        {/* LOGO & BRAND */}
        <div>
          <AppLogo 
            size={42} 
            subtitle={experienceMode === 'simple' ? 'Guia Seguro & Simples' : 'Radar & Hunter Avançado'}
            onClick={() => setActiveTab('home')}
          />

          {/* ALTERNADOR DE MODO (EXPERIENCE MODE SWITCHER) */}
          <div style={{ 
            marginTop: '0.85rem', 
            padding: '0.35rem', 
            borderRadius: '10px', 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            gap: '0.25rem'
          }}>
            <button 
              onClick={() => {
                setExperienceMode('simple');
                if (activeTab === 'rotation') setActiveTab('home');
              }}
              style={{
                flex: 1,
                padding: '0.35rem 0.5rem',
                borderRadius: '7px',
                border: 'none',
                background: experienceMode === 'simple' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: experienceMode === 'simple' ? '#10b981' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.72rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              🌿 Simples
            </button>
            <button 
              onClick={() => {
                setExperienceMode('advanced');
                if (activeTab === 'home') setActiveTab('radar');
              }}
              style={{
                flex: 1,
                padding: '0.35rem 0.5rem',
                borderRadius: '7px',
                border: 'none',
                background: experienceMode === 'advanced' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: experienceMode === 'advanced' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.72rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              ⚡ Avançado
            </button>
          </div>
        </div>

        {/* LINKS DE NAVEGAÇÃO ORGANIZADOS EM DUAS SECÇÕES PRINCIPAIS */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          
          {/* BOTÃO HOME (INÍCIO GERAL) */}
          <button 
            onClick={() => setActiveTab('home')}
            className={`btn ${activeTab === 'home' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '0.65rem', marginBottom: '0.25rem' }}
          >
            <Home size={18} />
            <span>Início (Visão Geral)</span>
          </button>

          {/* SECÇÃO 1: INVESTIMENTO A LONGO PRAZO */}
          <div className="nav-section-title">
            <span>🌱 Investimento a Longo Prazo</span>
          </div>

          <button 
            onClick={() => setActiveTab('longterm')}
            className={`btn ${activeTab === 'longterm' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              gap: '0.65rem',
              border: activeTab === 'longterm' ? '1px solid #10b981' : undefined,
              background: activeTab === 'longterm' ? 'rgba(16, 185, 129, 0.18)' : undefined
            }}
          >
            <ShieldCheck size={18} style={{ color: activeTab === 'longterm' ? 'var(--text-primary)' : '#10b981' }} />
            <span>Estratégia & Base</span>
          </button>

          <button 
            onClick={() => setActiveTab('guide')}
            className={`btn ${activeTab === 'guide' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              gap: '0.65rem', 
              border: activeTab === 'guide' ? '1px solid #10b981' : undefined,
              background: activeTab === 'guide' ? 'rgba(16, 185, 129, 0.18)' : undefined
            }}
          >
            <Compass size={18} style={{ color: activeTab === 'guide' ? 'var(--text-primary)' : '#10b981' }} />
            <span>Bússola do Principiante</span>
          </button>

          {/* SECÇÃO 2: COMPRA E VENDA DE ATIVOS */}
          <div className="nav-section-title" style={{ marginTop: '0.5rem' }}>
            <span>⚡ Compra e Venda de Ativos</span>
          </div>

          <button 
            onClick={() => setActiveTab('signals')}
            className={`btn ${activeTab === 'signals' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '0.65rem', position: 'relative' }}
          >
            <Target size={18} style={{ color: 'var(--primary)' }} />
            <span>Sinais Acionáveis</span>
            {summary.bullishCount > 0 && (
              <span className="badge-count">
                {summary.bullishCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('radar')}
            className={`btn ${activeTab === 'radar' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '0.65rem' }}
          >
            <Radar size={18} />
            <span>Radar de Mercado</span>
          </button>

          {/* NO MODO AVANÇADO EXIBE ROTAÇÃO SETORIAL E WATCHLIST */}
          {experienceMode === 'advanced' && (
            <>
              <button 
                onClick={() => setActiveTab('rotation')}
                className={`btn ${activeTab === 'rotation' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ gap: '0.65rem' }}
              >
                <RotateCw size={18} />
                <span>Rotação Setorial</span>
              </button>

              <button 
                onClick={() => setActiveTab('watchlist')}
                className={`btn ${activeTab === 'watchlist' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ gap: '0.65rem' }}
              >
                <Star size={18} />
                <span>Watchlist Favoritos</span>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  {marketEtfs.filter(e => e.isWatchlisted).length}
                </span>
              </button>
            </>
          )}

          {/* APOIO & INTELIGÊNCIA */}
          <div className="nav-section-title" style={{ marginTop: '0.5rem' }}>
            <span>🤖 Apoio & Auditoria</span>
          </div>

          <button 
            onClick={() => setActiveTab('chat')}
            className={`btn ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ gap: '0.65rem' }}
          >
            <MessageSquare size={18} />
            <span>Consultor de Confiança</span>
          </button>
        </nav>

        {/* RODAPÉ DA SIDEBAR */}
        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* TEMA DARK / LIGHT */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Modo Noturno</span>
            <button 
              onClick={toggleTheme}
              style={{ 
                background: 'var(--bg-glass)', border: '1px solid var(--border-color)', 
                borderRadius: '8px', padding: '0.4rem 0.6rem', color: 'var(--text-primary)', 
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' 
              }}
            >
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
          </div>

          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            {experienceMode === 'simple' ? '🌿 Modo Calmo & Sem Ruído' : '⚡ Modo Analítico Ativo'} • v0.7.2
          </div>

        </div>

      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="main-content" style={activeTab === 'chat' ? { paddingBottom: '1rem', gap: '0.75rem' } : undefined}>
        
        {/* CABEÇALHO GLOBAL */}
        <div className="top-header">
          
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
              {activeTab === 'home' && '👋 Olá! Vamos cuidar do teu futuro financeiro sem stress'}
              {activeTab === 'longterm' && '🌱 Investimento a Longo Prazo: Construção de Liberdade'}
              {activeTab === 'guide' && '🧭 Bússola do Principiante: Os Teus Passos Seguros'}
              {activeTab === 'signals' && '🎯 Compra e Venda de Ativos: Oportunidades & Sinais'}
              {activeTab === 'radar' && '📡 Radar Contínuo de Mercados de ETFs'}
              {activeTab === 'rotation' && '🔄 Termómetro de Rotação Setorial e Ciclos'}
              {activeTab === 'watchlist' && '⭐ ETFs Favoritos Sob Vigilância'}
              {activeTab === 'chat' && '🤖 Consultor de Mercados & Auditoria'}
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {activeTab === 'home' && 'Escolhe o teu objetivo com calma. Estamos aqui para te orientar em cada passo.'}
              {activeTab === 'longterm' && 'Estratégia de acumulação global, otimização fiscal em Portugal (retenção 15% Irlanda) e juros compostos.'}
              {activeTab === 'guide' && 'Guia didático sem jargão financeiro: quando comprar, onde comprar e como poupar em impostos.'}
              {activeTab === 'signals' && 'Desequilíbrios estatísticos de mercado com zonas recomendadas de entrada e alvos de lucro.'}
              {activeTab === 'radar' && 'Painel analítico completo de ETFs UCITS europeus.'}
              {activeTab === 'rotation' && 'Fluxos de capital institucional entre setores económicos.'}
              {activeTab === 'watchlist' && 'Os teus ativos prioritários para vigilância de preços.'}
              {activeTab === 'chat' && 'Tira qualquer dúvida em português de Portugal sobre ETFs e investimentos.'}
            </p>
          </div>

          {/* AÇÕES DE TOPO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            
            {/* COMUTADOR RÁPIDO DE MODO NO TOPO */}
            <button 
              onClick={() => {
                const nextMode = experienceMode === 'simple' ? 'advanced' : 'simple';
                setExperienceMode(nextMode);
                if (nextMode === 'advanced' && activeTab === 'home') setActiveTab('radar');
                if (nextMode === 'simple' && (activeTab === 'radar' || activeTab === 'rotation')) setActiveTab('home');
              }}
              className="btn btn-secondary"
              style={{ 
                fontSize: '0.78rem', padding: '0.45rem 0.85rem', gap: '0.4rem',
                borderColor: experienceMode === 'simple' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.4)'
              }}
              title="Alternar entre visualização simples (sem ruído) e avançada"
            >
              <SlidersHorizontal size={14} />
              <span>{experienceMode === 'simple' ? 'Mudar p/ Modo Avançado' : 'Mudar p/ Modo Simples'}</span>
            </button>

            {/* BOTÃO ATUALIZAR */}
            <button 
              onClick={handleManualScan}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem', gap: '0.4rem' }}
              title="Recalcular métricas e cotações"
            >
              <RefreshCw size={14} />
              <span>Atualizar</span>
            </button>

            {/* SINO DE NOTIFICAÇÕES */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => {
                  setIsAlertsOpen(prev => !prev);
                  if (!isAlertsOpen && alerts.length > 0) {
                    setAlerts(curr => curr.map(a => ({ ...a, read: true })));
                  }
                }}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 0.75rem', position: 'relative' }}
                title="Alertas em direto do radar"
              >
                <Bell size={16} />
                {unreadAlertsCount > 0 && (
                  <span style={{ 
                    position: 'absolute', top: '-4px', right: '-4px', 
                    background: '#ef4444', color: '#fff', fontSize: '0.65rem', 
                    fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--bg-primary)'
                  }}>
                    {unreadAlertsCount}
                  </span>
                )}
              </button>

              {/* DROPDOWN DE ALERTAS */}
              {isAlertsOpen && (
                <div style={{ 
                  position: 'absolute', right: 0, top: '120%', width: '320px', 
                  background: 'var(--bg-surface)', border: '1px solid var(--border-color)', 
                  borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
                  zIndex: 1000, overflow: 'hidden'
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Alertas do Mercado</span>
                    <button onClick={() => setAlerts([])} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer' }}>
                      Limpar
                    </button>
                  </div>

                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {alerts.length === 0 ? (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Nenhum alerta recente do scanner.
                      </div>
                    ) : (
                      alerts.map(a => (
                        <div key={a.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: a.type === 'opportunity' ? '#10b981' : '#ef4444' }}>
                            <span>{a.title}</span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                            {a.message}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* CONTEÚDO DO SEPARADOR ATIVO */}
        {activeTab === 'home' && (
          <CleanHomeHub 
            summary={summary}
            etfs={marketEtfs}
            onNavigate={(tab) => setActiveTab(tab)}
            onSwitchToAdvanced={() => {
              setExperienceMode('advanced');
              setActiveTab('radar');
            }}
          />
        )}

        {activeTab === 'longterm' && (
          <LongTermTab 
            etfs={marketEtfs}
            summary={summary}
            onAskAdvisor={handleAskAdvisor}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'guide' && (
          <BeginnerCompass 
            etfs={marketEtfs}
            summary={summary}
            onAskAdvisor={handleAskAdvisor}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'radar' && (
          <MarketRadar 
            etfs={marketEtfs}
            summary={summary}
            isScanning={isScanning}
            onToggleAutoScan={() => setIsScanning(prev => !prev)}
            onManualScan={handleManualScan}
            onToggleWatchlist={handleToggleWatchlist}
            onAskAdvisor={handleAskAdvisor}
          />
        )}

        {activeTab === 'signals' && (
          <ActionableSignals 
            etfs={marketEtfs}
            onAskAdvisor={handleAskAdvisor}
          />
        )}

        {activeTab === 'rotation' && (
          <SectorRotationTab 
            etfs={marketEtfs}
            onAskAdvisor={handleAskAdvisor}
          />
        )}

        {activeTab === 'watchlist' && (
          <MarketRadar 
            etfs={marketEtfs.filter(e => e.isWatchlisted)}
            summary={summary}
            isScanning={isScanning}
            onToggleAutoScan={() => setIsScanning(prev => !prev)}
            onManualScan={handleManualScan}
            onToggleWatchlist={handleToggleWatchlist}
            onAskAdvisor={handleAskAdvisor}
          />
        )}

        {activeTab === 'chat' && (
          <MarketChat 
            etfs={marketEtfs}
            triggeredQuery={triggeredChatQuery}
            onClearTrigger={() => setTriggeredChatQuery(null)}
          />
        )}

      </main>

    </div>
  );
}
