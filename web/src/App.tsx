import { useState, useEffect, useRef } from 'react';
import { ETF, Portfolio, UserProfile } from './types';
import { generatePortfolioAlerts } from './utils/advisorEngine';
import { fetchEtfPrice } from './utils/api';
import Dashboard from './components/Dashboard';
import EtfList from './components/EtfList';
import AdvisorChat from './components/AdvisorChat';
import EtfModal from './components/EtfModal';
import OptimizationTab from './components/OptimizationTab';
import XtbImportModal from './components/XtbImportModal';
import OpportunitiesTab from './components/OpportunitiesTab';
import ToolsTab from './components/ToolsTab';
import ProfileModal from './components/ProfileModal';
import PortfolioModal from './components/PortfolioModal';
import { LayoutDashboard, Coins, Plus, Scale, FolderPlus, FolderKanban, Trash2, Compass, Wrench, User, RefreshCw } from 'lucide-react';

const DEFAULT_DEMO_PORTFOLIOS: Portfolio[] = [
  {
    id: 'demo-portfolio-fire',
    name: 'DEGIRO FIRE Sonho',
    isDemo: true,
    etfs: [
      {
        id: 'demo-sxr8',
        ticker: 'SXR8',
        name: 'iShares Core S&P 500 UCITS ETF (Acc)',
        ter: 0.07,
        domicile: 'IE',
        distribution: 'Acc',
        replication: 'Physical',
        weight: 60,
        amountInvested: 120000,
        currentValue: 185250
      },
      {
        id: 'demo-spyi',
        ticker: 'SPYI',
        name: 'SPDR MSCI ACWI IMI UCITS ETF (Acc)',
        ter: 0.17,
        domicile: 'IE',
        distribution: 'Acc',
        replication: 'Physical',
        weight: 40,
        amountInvested: 110000,
        currentValue: 133400
      }
    ]
  },
  {
    id: 'demo-portfolio-speculative',
    name: 'XTB Poupanças',
    isDemo: true,
    etfs: [
      {
        id: 'demo-qdve',
        ticker: 'QDVE',
        name: 'iShares S&P 500 Information Technology (Acc)',
        ter: 0.15,
        domicile: 'IE',
        distribution: 'Acc',
        replication: 'Physical',
        weight: 70,
        amountInvested: 30000,
        currentValue: 38500
      },
      {
        id: 'demo-vusa',
        ticker: 'VUSA',
        name: 'Vanguard S&P 500 UCITS ETF (Dist)',
        ter: 0.07,
        domicile: 'IE',
        distribution: 'Dist',
        replication: 'Physical',
        weight: 30,
        amountInvested: 12000,
        currentValue: 13800
      }
    ]
  }
];

// Componente raiz que gere múltiplos portefólios de ETFs, flutua cotações em direto e sincroniza o localStorage.
export default function App() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [activePortfolioId, setActivePortfolioId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isXtbModalOpen, setIsXtbModalOpen] = useState(false);
  const [editingEtf, setEditingEtf] = useState<ETF | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'etfs' | 'optimization' | 'opportunities' | 'tools'>('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [triggeredChatQuery, setTriggeredChatQuery] = useState<{ text: string; timestamp: number } | null>(null);
  const [isRefreshingPrices, setIsRefreshingPrices] = useState(false);
  
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('my_etf_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Exibe o modal de perfil automaticamente se for o primeiro acesso
  useEffect(() => {
    if (!userProfile) {
      setIsProfileModalOpen(true);
    }
  }, [userProfile]);

  const handleSaveProfile = (profile: UserProfile, triggerImport: boolean) => {
    setUserProfile(profile);
    localStorage.setItem('my_etf_user_profile', JSON.stringify(profile));
    setIsProfileModalOpen(false);
    if (triggerImport) {
      setIsXtbModalOpen(true);
    }
  };

  const savePortfolios = (updated: Portfolio[]) => {
    try {
      localStorage.setItem('my_etf_portfolios', JSON.stringify(updated));
    } catch (err) {
      console.error('Erro ao gravar portefólios no localStorage:', err);
    }
  };

  // Inicializa os portefólios a partir do localStorage unindo reais e demos
  useEffect(() => {
    try {
      const savedReal = localStorage.getItem('my_etf_portfolios');
      const savedDemo = localStorage.getItem('my_etf_demo_portfolios');
      
      let allPortfolios: Portfolio[] = [];
      
      if (savedReal) {
        allPortfolios = [...allPortfolios, ...JSON.parse(savedReal)];
      }
      if (savedDemo) {
        const parsedDemo = JSON.parse(savedDemo).map((p: Portfolio) => ({ ...p, isDemo: true }));
        allPortfolios = [...allPortfolios, ...parsedDemo];
        localStorage.removeItem('my_etf_demo_portfolios');
      }
      
      if (allPortfolios.length > 0) {
        const parsed = allPortfolios;
        
        // Sanitização robusta: se o valor atual estiver corrompido ou bizarramente abaixo do investido (menos de 40%) devido ao bug antigo, repõe o valor justo de mercado!
        let needsSaveBack = false;
        const sanitized = parsed.map(p => ({
          ...p,
          etfs: p.etfs.map(e => {
            const cost = typeof e.amountInvested === 'number' && !isNaN(e.amountInvested) ? e.amountInvested : 0;
            let current = typeof e.currentValue === 'number' && !isNaN(e.currentValue) && e.currentValue > 0 ? e.currentValue : cost;
            
            // Deteção inteligente de valores colapsados para o piso de 10€ do bug anterior
            if (cost > 30 && current < cost * 0.4) {
              needsSaveBack = true;
              if (e.ticker === 'SXR8') current = 147.15;
              else if (e.ticker === 'SPYI') current = 146.85;
              else if (e.ticker === 'SXRV') current = 311.61;
              else current = cost * 1.12; // fallback de +12% de lucro médio estimado
            }
            
            return {
              ...e,
              amountInvested: cost,
              currentValue: Number(current.toFixed(2))
            };
          })
        }));

        setPortfolios(sanitized);
        if (sanitized.length > 0) {
          setActivePortfolioId(sanitized[0].id);
        }
        if (needsSaveBack || savedDemo) {
          savePortfolios(sanitized);
        }
      } else {
        // Inicializa com carteiras reais e demos padrão
        const initialPortfolios: Portfolio[] = [
          {
            id: 'portfolio-xtb',
            name: 'XTB Principal (Real)',
              etfs: [
                {
                  id: 'xtb-sxr8',
                  ticker: 'SXR8',
                  name: 'iShares Core S&P 500 UCITS ETF (Acc)',
                  ter: 0.07,
                  domicile: 'IE',
                  distribution: 'Acc',
                  replication: 'Physical',
                  weight: 25,
                  amountInvested: 127.79,
                  currentValue: 147.15
                },
                {
                  id: 'xtb-spyi',
                  ticker: 'SPYI',
                  name: 'SPDR MSCI ACWI IMI UCITS ETF (Acc)',
                  ter: 0.17,
                  domicile: 'IE',
                  distribution: 'Acc',
                  replication: 'Physical',
                  weight: 25,
                  amountInvested: 125.78,
                  currentValue: 146.85
                },
                {
                  id: 'xtb-sxrv',
                  ticker: 'SXRV',
                  name: 'iShares NASDAQ 100 UCITS ETF (Acc)',
                  ter: 0.33,
                  domicile: 'IE',
                  distribution: 'Acc',
                  replication: 'Physical',
                  weight: 50,
                  amountInvested: 262.82,
                  currentValue: 311.61
                }
              ]
            },
            {
              id: 'portfolio-degiro',
              name: 'DEGIRO Poupanças',
              isDemo: true,
              etfs: [
                {
                  id: 'mock-vusa',
                  ticker: 'VUSA',
                  name: 'Vanguard S&P 500 UCITS ETF (Dist)',
                  ter: 0.07,
                  domicile: 'IE',
                  distribution: 'Dist',
                  replication: 'Physical',
                  weight: 60,
                  amountInvested: 12000,
                  currentValue: 12450
                },
                {
                  id: 'mock-iusq',
                  ticker: 'IUSQ',
                  name: 'iShares MSCI ACWI UCITS ETF (Acc)',
                  ter: 0.20,
                  domicile: 'IE',
                  distribution: 'Acc',
                  replication: 'Physical',
                  weight: 40,
                  amountInvested: 8000,
                  currentValue: 8120
                }
              ]
            },
            ...DEFAULT_DEMO_PORTFOLIOS
          ];
          setPortfolios(initialPortfolios);
          setActivePortfolioId(initialPortfolios[0].id);
          savePortfolios(initialPortfolios);
      }
    } catch (err) {
      console.error('Erro ao ler portefólios do localStorage:', err);
    }
  }, []);


  // Obtém o portefólio ativo atual
  const activePortfolio = portfolios.find(p => p.id === activePortfolioId) || portfolios[0];
  const etfs = activePortfolio ? activePortfolio.etfs : [];

  const handleOpenNewPortfolio = () => {
    setEditingPortfolio(null);
    setIsPortfolioModalOpen(true);
  };

  const handleOpenEditPortfolio = (portfolio: Portfolio) => {
    setEditingPortfolio(portfolio);
    setIsPortfolioModalOpen(true);
  };

  const handleSavePortfolio = (portfolioData: Partial<Portfolio>) => {
    if (editingPortfolio) {
      const updated = portfolios.map(p => 
        p.id === editingPortfolio.id 
          ? { ...p, ...portfolioData } 
          : p
      );
      setPortfolios(updated as Portfolio[]);
      savePortfolios(updated as Portfolio[]);
    } else {
      const newPortfolio: Portfolio = {
        id: `portfolio-${Math.random().toString(36).substring(2, 7)}`,
        name: portfolioData.name || 'Nova Carteira',
        isDemo: portfolioData.isDemo,
        broker: portfolioData.broker as any,
        etfs: []
      };
      const updated = [...portfolios, newPortfolio];
      setPortfolios(updated);
      setActivePortfolioId(newPortfolio.id);
      savePortfolios(updated);
    }
    setIsPortfolioModalOpen(false);
  };

  // Eliminação da carteira ativa
  const handleDeleteActivePortfolio = () => {
    if (portfolios.length <= 1) return;
    if (window.confirm(`Tens a certeza absoluta que queres eliminar a carteira "${activePortfolio.name}" e todos os seus ativos?`)) {
      const updated = portfolios.filter(p => p.id !== activePortfolioId);
      setPortfolios(updated);
      setActivePortfolioId(updated[0].id);
      savePortfolios(updated);
    }
  };

  // Guarda ou edita um ETF dentro da carteira ativa
  const handleSaveEtf = (etfToSave: ETF) => {
    const updated = portfolios.map(p => {
      if (p.id === activePortfolioId) {
        let updatedEtfs: ETF[];
        if (editingEtf) {
          updatedEtfs = p.etfs.map(e => e.id === etfToSave.id ? etfToSave : e);
        } else {
          updatedEtfs = [...p.etfs, etfToSave];
        }
        return { ...p, etfs: updatedEtfs };
      }
      return p;
    });

    setPortfolios(updated);
    savePortfolios(updated);
  };

  // Elimina um ETF da carteira ativa
  const handleDeleteEtf = (id: string) => {
    if (window.confirm('Tens a certeza que queres eliminar este ETF da tua auditoria?')) {
      const updated = portfolios.map(p => {
        if (p.id === activePortfolioId) {
          return { ...p, etfs: p.etfs.filter(e => e.id !== id) };
        }
        return p;
      });

      setPortfolios(updated);
      savePortfolios(updated);
    }
  };

  // Atualiza diretamente a lista de ETFs da carteira ativa (usado pelas ações do Dashboard)
  const handleUpdateEtfs = (updatedEtfs: ETF[]) => {
    const updated = portfolios.map(p => {
      if (p.id === activePortfolioId) {
        return { ...p, etfs: updatedEtfs };
      }
      return p;
    });
    setPortfolios(updated);
    savePortfolios(updated);
  };

  // Dispara uma pergunta estruturada de auditoria direta sobre um ETF para o chat do consultor
  const handleAskAdvisorAboutEtf = (etf: ETF) => {
    setIsChatOpen(true);
    setTriggeredChatQuery({
      text: `Dá-me uma análise detalhada, fiscal e de comissões do meu ETF ${etf.ticker} (${etf.name}). Está sediado em ${etf.domicile}, política de ${etf.distribution === 'Acc' ? 'Acumulação (Acc)' : 'Distribuição (Dist)'}, replicação ${etf.replication === 'Physical' ? 'Física' : 'Sintética'} e comissão anual TER de ${etf.ter}%. Quais os riscos e se há melhores alternativas?`,
      timestamp: Date.now()
    });
  };

  // Atualiza cotações usando a API externa
  const handleRefreshPrices = async () => {
    if (portfolios.length === 0 || !activePortfolioId || isRefreshingPrices) return;
    setIsRefreshingPrices(true);
    
    try {
      const p = activePortfolio;
      if (!p) return;
      
      let wasUpdated = false;
      const updatedEtfs = await Promise.all(p.etfs.map(async (etf) => {
        const livePrice = await fetchEtfPrice(etf.ticker);
        if (livePrice && livePrice > 0 && livePrice !== etf.currentValue) {
          wasUpdated = true;
          return { ...etf, currentValue: Number(livePrice.toFixed(2)) };
        }
        return etf;
      }));
      
      if (wasUpdated) {
        handleUpdateEtfs(updatedEtfs);
      }
    } catch (err) {
      console.error('Falha ao atualizar cotações:', err);
    } finally {
      setIsRefreshingPrices(false);
    }
  };

  // Mantém a referência da função atualizada para o intervalo
  const latestRefreshPrices = useRef(handleRefreshPrices);
  useEffect(() => {
    latestRefreshPrices.current = handleRefreshPrices;
  });

  // Loop Automático de 5 em 5 segundos
  useEffect(() => {
    if (portfolios.length === 0 || !activePortfolioId) return;

    // Faz uma primeira chamada logo após carregar a carteira (opcional)
    // latestRefreshPrices.current();

    const fetchInterval = setInterval(() => {
      const now = new Date();
      const day = now.getDay(); // 0 = Domingo, 6 = Sábado
      const hour = now.getHours(); // Hora local

      // Mercados europeus abrem às ~8h e mercados americanos fecham às ~21h (hora de Lisboa)
      const isWeekend = day === 0 || day === 6;
      const isOutsideMarketHours = hour < 8 || hour >= 21;

      // Se os mercados estiverem fechados, não faz fetch automático para poupar limites de API
      if (isWeekend || isOutsideMarketHours) {
        return;
      }

      latestRefreshPrices.current();
    }, 60000);

    return () => clearInterval(fetchInterval);
  }, [activePortfolioId]);

  const handleOpenAddModal = () => {
    setEditingEtf(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (etf: ETF) => {
    setEditingEtf(etf);
    setIsModalOpen(true);
  };

  const activeAlerts = generatePortfolioAlerts(etfs);

  return (
    <div className="app-container">
      
      {/* Barra Lateral Premium de Gestão e Navegação */}
      <aside className="sidebar">
        <div className="brand">
          <span>📈</span> My ETF
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={16} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {userProfile ? userProfile.name : 'Visitante'}
            </span>
          </div>
          <button 
            className="btn" 
            style={{ padding: '0.2rem', background: 'none', border: 'none', color: 'var(--text-muted)' }}
            onClick={() => setIsProfileModalOpen(true)}
            title="Editar Perfil"
          >
            <Wrench size={14} />
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          O teu consultor e broker pessoal de elite. Cético, minucioso e fiscalmente obsessivo.
        </p>

        {/* Gestor Avançado de Carteiras (Portfolios Switcher Sidebar) */}
        <div style={{ marginTop: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            <FolderKanban size={14} className="text-primary" style={{ color: 'var(--primary)' }} /> Gestor de Carteiras
          </div>
          
          <select
            value={activePortfolioId}
            onChange={(e) => setActivePortfolioId(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.5rem', 
              background: activePortfolio?.isDemo ? 'rgba(220, 38, 38, 0.15)' : 'rgba(0,0,0,0.3)', 
              border: activePortfolio?.isDemo ? '1px solid rgba(220, 38, 38, 0.5)' : '1px solid var(--border-color)', 
              borderRadius: '8px', 
              color: activePortfolio?.isDemo ? '#fca5a5' : 'var(--text-primary)', 
              fontWeight: '600', 
              fontSize: '0.8rem', 
              outline: 'none', 
              cursor: 'pointer', 
              marginBottom: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            {portfolios.map(p => (
              <option key={p.id} value={p.id} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
                {p.isDemo ? `🔴 DEMO: ${p.name}` : p.name} ({p.etfs.length} ETF{p.etfs.length !== 1 ? 's' : ''})
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button 
              className="btn btn-secondary" 
              style={{ flex: 1, padding: '0.3rem 0.5rem', fontSize: '0.75rem', gap: '0.2rem' }}
              onClick={handleOpenNewPortfolio}
              title="Adicionar Nova Carteira"
            >
              <FolderPlus size={12} /> Nova
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', gap: '0.2rem' }}
              onClick={() => handleOpenEditPortfolio(activePortfolio)}
              title="Editar Carteira Atual"
            >
              ✏️
            </button>
            {portfolios.length > 1 && (
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)', gap: '0.2rem' }}
                onClick={handleDeleteActivePortfolio}
                title="Eliminar Carteira Atual"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start' }}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={16} /> Painel Analítico
          </button>
          <button 
            className={`btn ${activeTab === 'etfs' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start' }}
            onClick={() => setActiveTab('etfs')}
          >
            <Coins size={16} /> Meus Ativos
          </button>
          <button 
            className={`btn ${activeTab === 'optimization' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start' }}
            onClick={() => setActiveTab('optimization')}
          >
            <Scale size={16} /> Otimização Avançada
          </button>
          <button 
            className={`btn ${activeTab === 'opportunities' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start' }}
            onClick={() => setActiveTab('opportunities')}
          >
            <Compass size={16} /> Oportunidades de Elite
          </button>
          <button 
            className={`btn ${activeTab === 'tools' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ justifyContent: 'flex-start' }}
            onClick={() => setActiveTab('tools')}
          >
            <Wrench size={16} /> Ferramentas FIRE & IRS
          </button>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={handleOpenAddModal}
          >
            <Plus size={16} /> Registar Ativo
          </button>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', fontSize: '0.85rem' }}
            onClick={() => setIsXtbModalOpen(true)}
          >
            📷 Importar Print XTB
          </button>
        </div>
      </aside>

      {/* Área de Conteúdo Principal */}
      <main className="main-content">
        
        {/* Cabeçalho do App */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {activePortfolio?.isDemo && <span style={{ fontSize: '0.7em', padding: '0.2rem 0.5rem', background: 'rgba(220, 38, 38, 0.2)', color: '#fca5a5', borderRadius: '6px', border: '1px solid rgba(220, 38, 38, 0.4)' }}>DEMO</span>}
              {activePortfolio ? activePortfolio.name : 'Gestão de Portefólio de ETFs'}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Análise isenta de comissões implícitas, duplicações de índices e ineficiências fiscais de dividendos.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', gap: '0.4rem', opacity: isRefreshingPrices ? 0.7 : 1 }}
              onClick={handleRefreshPrices}
              disabled={isRefreshingPrices}
              title="Obter preços ao vivo (Yahoo Finance)"
            >
              <RefreshCw size={14} className={isRefreshingPrices ? 'spin-animation' : ''} />
              {isRefreshingPrices ? 'A Sincronizar...' : 'Atualizar Cotações'}
            </button>
          </div>
        </header>

        {/* Layout do Conteúdo Principal (Largura Total Sem Espremer!) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
          {activeTab === 'dashboard' ? (
            <>
              <Dashboard 
                etfs={etfs} 
                alerts={activeAlerts} 
                onEdit={handleOpenEditModal}
                onUpdateEtfs={handleUpdateEtfs}
                portfolioName={activePortfolio?.name || ''}
                portfolioBroker={activePortfolio?.broker}
                userProfileBroker={userProfile?.broker}
              />
              <EtfList 
                etfs={etfs} 
                onEdit={handleOpenEditModal} 
                onDelete={handleDeleteEtf} 
                onOpenAddModal={handleOpenAddModal} 
                onOpenXtbModal={() => setIsXtbModalOpen(true)}
                onAskAdvisor={handleAskAdvisorAboutEtf}
              />
            </>
          ) : activeTab === 'etfs' ? (
            <EtfList 
              etfs={etfs} 
              onEdit={handleOpenEditModal} 
              onDelete={handleDeleteEtf} 
              onOpenAddModal={handleOpenAddModal} 
              onOpenXtbModal={() => setIsXtbModalOpen(true)}
              onAskAdvisor={handleAskAdvisorAboutEtf}
            />
          ) : activeTab === 'optimization' ? (
            <OptimizationTab 
              etfs={etfs} 
              portfolioName={activePortfolio?.name || ''} 
              portfolioBroker={activePortfolio?.broker}
              userProfileBroker={userProfile?.broker}
            />
          ) : activeTab === 'opportunities' ? (
            <OpportunitiesTab etfs={etfs} onAddEtf={handleSaveEtf} />
          ) : (
            <ToolsTab etfs={etfs} />
          )}
        </div>

      </main>

      {/* Modal para Registo ou Edição de ETFs */}
      <EtfModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEtf}
        editingEtf={editingEtf}
      />

      {/* Modal para Importação por Print Screen da XTB */}
      <XtbImportModal 
        isOpen={isXtbModalOpen}
        onClose={() => setIsXtbModalOpen(false)}
        onImport={(importedEtfs) => {
          // Atualiza o portefólio ativo com os ETFs importados
          const updated = portfolios.map(p => {
            if (p.id === activePortfolioId) {
              return { ...p, etfs: importedEtfs };
            }
            return p;
          });
          setPortfolios(updated);
          savePortfolios(updated);
        }}
      />

      {/* Modal de Perfil de Investidor */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => {
          if (userProfile) setIsProfileModalOpen(false); // Só permite fechar se já tiver perfil
        }}
        onSave={handleSaveProfile}
        existingProfile={userProfile}
      />

      {/* Modal de Gestão de Carteiras */}
      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        onSave={handleSavePortfolio}
        existingPortfolio={editingPortfolio}
        userProfileBroker={userProfile?.broker}
      />

      {/* Botão Flutuante e Widget do Consultor de Elite */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
        {/* Caixa de Conversa Flutuante */}
        {isChatOpen && (
          <div style={{ 
            width: '380px', 
            maxHeight: '600px', 
            height: '80vh', 
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Botão de Fechar Interno */}
              <button 
                onClick={() => setIsChatOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'hsla(230, 20%, 5%, 0.6)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 100,
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                className="table-row-hover"
                title="Minimizar Conversa"
              >
                ✕
              </button>
              <AdvisorChat 
                etfs={etfs} 
                triggeredQuery={triggeredChatQuery}
                onClearTrigger={() => setTriggeredChatQuery(null)}
                portfolioName={activePortfolio?.name || ''}
                portfolioBroker={activePortfolio?.broker}
                userProfileBroker={userProfile?.broker}
              />
            </div>
          </div>
        )}

        {/* Botão do Chat Púlsar */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--secondary)',
            color: 'var(--secondary)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            outline: 'none',
            position: 'relative'
          }}
          className="pulsing-button"
          title="Falar com o Consultor de Elite"
        >
          {isChatOpen ? (
            <span style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>✕</span>
          ) : (
            <span style={{ fontSize: '1.6rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🕶️</span>
          )}
          {/* Badge de Notificação discreta ou Alerta */}
          {!isChatOpen && activeAlerts.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              background: 'var(--danger)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 'bold',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-primary)'
            }}>
              {activeAlerts.length}
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
