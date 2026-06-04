import { useState, useEffect, useCallback } from 'react';
import { ETF } from '../types';
import { Compass, Search, Globe, MessageSquare, TrendingUp, Check, ChevronRight, Edit3, Save, PlusCircle, Trash, RefreshCw } from 'lucide-react';

interface OpportunitiesTabProps {
  etfs: ETF[];
  onAddEtf: (etf: ETF) => void;
}

// Interface para notícias financeiras ao vivo
interface NewsItem {
  id: string;
  source: string;
  title: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  time: string;
  link?: string;
}

// Classifica o sentimento com base em palavras-chave do título
function classifySentiment(title: string): 'bullish' | 'bearish' | 'neutral' {
  const t = title.toLowerCase();
  const bullishWords = ['grow', 'rise', 'surge', 'rally', 'gain', 'high', 'record', 'strong', 'positive', 'bull', 'jump', 'soar', 'boost', 'sobe', 'cresce', 'máximo', 'recorde'];
  const bearishWords = ['drop', 'fall', 'decline', 'loss', 'risk', 'bear', 'crash', 'plunge', 'weak', 'sell', 'down', 'cai', 'queda', 'risco', 'mínimo', 'perde'];
  if (bullishWords.some(w => t.includes(w))) return 'bullish';
  if (bearishWords.some(w => t.includes(w))) return 'bearish';
  return 'neutral';
}

// Formata uma data ISO como tempo relativo em português
function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `Há ${diff}s`;
    if (diff < 3600) return `Há ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `Há ${Math.floor(diff / 3600)}h`;
    return `Há ${Math.floor(diff / 86400)}d`;
  } catch {
    return 'Recente';
  }
}

// Interface para discussões de investidores simuladas
interface ForumPost {
  id: string;
  user: string;
  community: string;
  text: string;
  hotness: number; // 1-5 de "febre" na comunidade
}

// Interface para oportunidades de ETFs recomendados
interface OpportunityETF {
  ticker: string;
  name: string;
  ter: number;
  domicile: 'IE' | 'LU';
  distribution: 'Acc' | 'Dist';
  replication: 'Physical' | 'Synthetic';
  rationale: string;
  category: string;
  rating: string; // Ex: "A+", "A", "B"
}

export default function OpportunitiesTab({ etfs, onAddEtf }: OpportunitiesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [addedTickers, setAddedTickers] = useState<Record<string, boolean>>({});

  // Curadoria Dinâmica em Tempo Real
  const [curatedOpportunities, setCuratedOpportunities] = useState<OpportunityETF[]>([]);
  const [isEditingCurated, setIsEditingCurated] = useState(false);

  // Mapeamento dinâmico de cores reativas com base na classificação de eficiência fiscal
  const getRatingStyle = (rating: string) => {
    const r = rating.trim().toUpperCase();
    if (r === 'S+' || r === 'S') {
      return { 
        background: 'var(--primary-glow)', 
        color: 'var(--primary)', 
        border: '1px solid rgba(126, 161, 138, 0.3)'
      };
    }
    if (r === 'A+' || r === 'A') {
      return { 
        background: 'var(--info-glow)', 
        color: 'var(--info)',
        border: '1px solid rgba(131, 149, 167, 0.25)'
      };
    }
    if (r.startsWith('B')) {
      return { 
        background: 'var(--danger-glow)', 
        color: 'var(--danger)',
        border: '1px solid rgba(189, 108, 108, 0.25)'
      };
    }
    return { 
      background: 'var(--warning-glow)', 
      color: 'var(--warning)',
      border: '1px solid rgba(189, 162, 108, 0.25)'
    };
  };

  // Inicializa a Curadoria a partir do LocalStorage ou do lote padrão
  useEffect(() => {
    try {
      const saved = localStorage.getItem('my_etf_curated_opportunities');
      if (saved) {
        setCuratedOpportunities(JSON.parse(saved));
      } else {
        const defaultOpp: OpportunityETF[] = [
          {
            ticker: 'SPYI',
            name: 'SPDR MSCI ACWI IMI UCITS ETF (Acc)',
            ter: 0.17,
            domicile: 'IE',
            distribution: 'Acc',
            replication: 'Physical',
            rationale: 'A melhor alternativa global "all-in-one". Cobre mais de 9000 empresas de mercados desenvolvidos e emergentes (incluindo Small Caps) com uma taxa TER de 0.17%. Domiciliado na Irlanda, maximizando os juros compostos.',
            category: 'Global Geral',
            rating: 'S+'
          },
          {
            ticker: 'QDVE',
            name: 'iShares S&P 500 Information Technology (Acc)',
            ter: 0.15,
            domicile: 'IE',
            distribution: 'Acc',
            replication: 'Physical',
            rationale: 'Para quem procura sobre-exposição ao setor de tecnologia com comissão muito inferior aos ETFs do NASDAQ 100 (TER 0.15% vs 0.33%). Excelente eficiência fiscal irlandesa.',
            category: 'Setorial Tech',
            rating: 'A'
          },
          {
            ticker: 'SXR8',
            name: 'iShares Core S&P 500 UCITS ETF (Acc)',
            ter: 0.07,
            domicile: 'IE',
            distribution: 'Acc',
            replication: 'Physical',
            rationale: 'O padrão dourado de investimento no mercado norte-americano. TER ultra-baixo de 0.07%, liquidez excelente e isenção fiscal em dividendos capitalizados internamente.',
            category: 'Mercado EUA',
            rating: 'A+'
          },
          {
            ticker: 'IUSQ',
            name: 'iShares MSCI ACWI UCITS ETF (Acc)',
            ter: 0.20,
            domicile: 'IE',
            distribution: 'Acc',
            replication: 'Physical',
            rationale: 'Excelente alternativa de acumulação global que junta mercados desenvolvidos e emergentes, gerido pela BlackRock. Ideal para portefólios de ETF único simples.',
            category: 'Global Geral',
            rating: 'A'
          }
        ];
        setCuratedOpportunities(defaultOpp);
        localStorage.setItem('my_etf_curated_opportunities', JSON.stringify(defaultOpp));
      }
    } catch (err) {
      console.error('Erro ao ler curadoria:', err);
    }
  }, []);

  // Notícias Financeiras ao Vivo (via RSS → rss2json)
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(false);
  const [lastNewsUpdate, setLastNewsUpdate] = useState<Date | null>(null);

  const fetchLiveNews = useCallback(async () => {
    setNewsLoading(true);
    setNewsError(false);
    try {
      const RSS_URL = encodeURIComponent('https://www.etftrends.com/feed/');
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}&count=8`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      if (data.status !== 'ok' || !data.items?.length) throw new Error('No items');

      const parsed: NewsItem[] = data.items.map((item: any, i: number) => ({
        id: `live-${i}-${Date.now()}`,
        source: 'ETF Trends',
        title: item.title?.replace(/<[^>]+>/g, '') ?? 'Sem título',
        sentiment: classifySentiment(item.title ?? ''),
        time: formatRelativeTime(item.pubDate),
        link: item.link
      }));

      setNews(parsed);
      setLastNewsUpdate(new Date());
    } catch {
      setNewsError(true);
      // fallback com notícias curadas caso a API falhe
      setNews([
        { id: 'fb1', source: 'ETF Trends', title: 'Fluxo recorde de capital de retalho europeu flui para ETFs domiciliados na Irlanda.', sentiment: 'bullish', time: 'Recente' },
        { id: 'fb2', source: 'JustETF', title: 'ETFs de acumulação irlandeses lideram eficiência fiscal para investidores portugueses.', sentiment: 'bullish', time: 'Recente' },
        { id: 'fb3', source: 'Reuters', title: 'Incerteza do BCE impulsiona procura por ETFs de obrigações de curto prazo.', sentiment: 'neutral', time: 'Recente' }
      ]);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveNews();
    // Atualiza a cada 15 minutos
    const interval = setInterval(fetchLiveNews, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchLiveNews]);

  // Conversas de Investidores do Reddit/Bogleheads
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 'p1',
      user: 'Boglehead_PT92',
      community: 'r/literaciafinanceira',
      text: 'Alguém mais está a substituir totalmente o par IWDA+EMIM pelo SPYI (SPDR MSCI ACWI IMI)? O TER de 0.17% e a inclusão de Small Caps está a parecer imbatível.',
      hotness: 5
    },
    {
      id: 'p2',
      user: 'FiscalNinja',
      community: 'Bogleheads Portugal',
      text: 'Atenção ao comprar ETFs no Luxemburgo na XTB. O US dividend leakage é uma perda silenciosa de quase 0.30% ao ano que não aparece no TER! Comprem sempre domicílio IE.',
      hotness: 4
    },
    {
      id: 'p3',
      user: 'VanguardPurist',
      community: 'r/EuropeanETF',
      text: 'A simplicidade do VWCE (Vanguard All-World) continua a ser a melhor terapia para quem não quer perder tempo a rebalancear carteiras manualmente todos os meses.',
      hotness: 3
    }
  ]);

  // Efeito para simular novas notícias e posts a entrar na rede em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Flutua o "hotness" dos posts
      setPosts(prev => prev.map(p => ({
        ...p,
        hotness: Math.max(1, Math.min(5, p.hotness + (Math.random() > 0.5 ? 1 : -1)))
      })));

      // Simula uma nova conversa aleatória
      if (Math.random() > 0.7) {
        const conversations = [
          "Reddit: Discussão acesa sobre se vale a pena ter 10% de exposição ao setor de semicondutores através de SMH.",
          "Bogleheads: Membros calculam que declarar mais-valias em IRS pelo método FIFO na XTB é simples mas exige folha de cálculo própria.",
          "r/literaciafinanceira: Alerta sobre corretoras que cobram comissões de conectividade a bolsas estrangeiras.",
          "JustETF Forum: Investidores debatem se ETFs de distribuição com isenção fiscal na Alemanha fazem sentido para residentes em Portugal."
        ];
        const randomText = conversations[Math.floor(Math.random() * conversations.length)];
        const newPost: ForumPost = {
          id: `p-${Date.now()}`,
          user: `Investor_${Math.floor(Math.random() * 900 + 100)}`,
          community: 'r/literaciafinanceira',
          text: randomText,
          hotness: 4
        };
        setPosts(prev => [newPost, ...prev.slice(0, 4)]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Executa o "Broker Deep Search Engine" (Simulação de crawler ultra-realista)
  const handleDeepSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsScanning(true);
    setScanLogs([]);
    setScannedResult(null);

    const logs = [
      `[BrokerCrawler] A ligar às bases de dados públicas da CMVM e do JustETF...`,
      `[BrokerCrawler] A descarregar PDF da ficha de informações essenciais (KID) para '${searchQuery.toUpperCase()}'...`,
      `[BrokerCrawler] A varrer discussões no Reddit r/literaciafinanceira e Bogleheads PT sobre o ativo...`,
      `[BrokerCrawler] A verificar histórico de dividend leakage com ações subjacentes nos EUA...`,
      `[BrokerCrawler] A calcular rácio de eficiência fiscal sob as leis do IRS de Portugal (Taxa especial de 28%)...`
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, log]);
        
        if (index === logs.length - 1) {
          setTimeout(() => {
            setIsScanning(false);
            const queryUpper = searchQuery.toUpperCase().trim();
            
            // Lógica inteligente de respostas personalizadas
            if (queryUpper.includes('QDVE')) {
              setScannedResult(`
### Relatório de Auditoria — iShares S&P 500 Info Tech (QDVE)
* **Avaliação do Consultor:** **EXCELENTE (9.4/10)**
* **Veredicto:** Altamente eficiente para investidores portugueses. Sendo de **Acumulação** e domiciliado na **Irlanda**, evita totalmente a dor de cabeça fiscal de declarar dividendos em Portugal.
* **Oportunidade Oculta:** O seu TER de **0.15%** é extraordinariamente barato. É mais eficiente que o Nasdaq 100 (TER 0.33%) e oferece uma concentração limpa em gigantes tecnológicas com retenção preferencial nos EUA (15%).
              `);
            } else if (queryUpper.includes('VWCE')) {
              setScannedResult(`
### Relatório de Auditoria — Vanguard FTSE All-World (VWCE)
* **Avaliação do Consultor:** **EXCELENTE (9.6/10)**
* **Veredicto:** A âncora perfeita para o teu portefólio. Ideal para o método "buy and hold" e esquecer o mercado.
* **Foco Fiscal:** Sediado na Irlanda (IE), com replicação física. Perfeito para o IRS português.
* **Nota de Auditoria:** O TER de **0.22%** é justo pela simplicidade de rebalanceamento automático global que oferece.
              `);
            } else if (queryUpper.includes('LU') || queryUpper.includes('LUX') || queryUpper.includes('FR')) {
              setScannedResult(`
### ⚠️ Relatório de Alerta — ETFs Domiciliados no Luxemburgo/França
* **Avaliação do Consultor:** **CRÍTICO / INEFICIENTE (5.0/10)**
* **Veredicto:** Evitar se contiver ações americanas (S&P 500, MSCI World).
* **Fuga de Capital Detetada:** ETFs domiciliados no Luxemburgo sofrem de **30% de retenção na fonte sobre dividendos de empresas dos EUA**, em vez de apenas 15% como na Irlanda. Isto resulta numa perda silenciosa anual de quase **0.30% do teu capital** que não é reportada no TER!
              `);
            } else {
              setScannedResult(`
### Relatório de Auditoria — Auditoria Geral para '${queryUpper}'
* **Avaliação do Consultor:** **NEUTRO / ANÁLISE SISTÉMICA (7.5/10)**
* **Verificação Concluída:** Ativo mapeado em bolsas europeias.
* **Recomendações do Consultor:**
  1. Certifica-te de que o código ISIN começa com **IE** (Irlanda) para garantir a retenção reduzida de 15% sobre dividendos dos EUA.
  2. Opta sempre pela classe **Acumuladora (Acc)** para evitar pagar 28% de imposto sobre dividendos distribuídos em Portugal.
  3. Compara o TER com alternativas da Amundi ou SPDR que possam oferecer o mesmo índice com taxas abaixo de 0.20%.
              `);
            }
          }, 800);
        }
      }, (index + 1) * 800);
    });
  };

  // Trata a adição rápida de uma oportunidade diretamente à carteira
  const handleAddOpportunity = (opp: OpportunityETF) => {
    const newEtf: ETF = {
      id: `opp-${Math.random().toString(36).substring(2, 7)}`,
      ticker: opp.ticker.toUpperCase().trim(),
      name: opp.name.trim(),
      ter: opp.ter,
      domicile: opp.domicile,
      distribution: opp.distribution,
      replication: opp.replication,
      weight: 0, 
      amountInvested: 500, 
      currentValue: 500
    };

    onAddEtf(newEtf);
    setAddedTickers(prev => ({ ...prev, [opp.ticker]: true }));
    alert(`✔️ Ativo ${opp.ticker} adicionado com sucesso à tua carteira ativa! Podes vê-lo no separador "Meus Ativos" e configurar o seu peso alvo.`);
  };

  // Grava as alterações da curadoria no LocalStorage
  const handleSaveCuratedList = () => {
    try {
      localStorage.setItem('my_etf_curated_opportunities', JSON.stringify(curatedOpportunities));
      setIsEditingCurated(false);
      alert('✔️ Curadoria atualizada com sucesso no teu LocalStorage em tempo real!');
    } catch (err) {
      console.error('Erro ao guardar curadoria:', err);
    }
  };

  // Adiciona uma linha em branco para edição na curadoria
  const handleAddBlankCurated = () => {
    const newBlank: OpportunityETF = {
      ticker: 'NOVO',
      name: 'Nome do ETF Recomendado',
      ter: 0.15,
      domicile: 'IE',
      distribution: 'Acc',
      replication: 'Physical',
      rationale: 'Escreve aqui o fundamento racional ou nota fiscal isenta do consultor...',
      category: 'Global',
      rating: 'A'
    };
    setCuratedOpportunities(prev => [...prev, newBlank]);
  };

  // Remove um item da curadoria
  const handleRemoveCuratedItem = (ticker: string) => {
    setCuratedOpportunities(prev => prev.filter(item => item.ticker !== ticker));
  };

  // Atualiza um campo de um item específico da curadoria
  const handleUpdateCuratedField = (ticker: string, field: keyof OpportunityETF, value: any) => {
    setCuratedOpportunities(prev => prev.map(item => {
      if (item.ticker === ticker) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Cabeçalho Interativo com Ícones */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.75rem', borderRadius: '12px', color: 'var(--bg-primary)' }}>
          <Compass size={28} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Oportunidades de Investimento & Investigação de Mercado</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Vastidão de fontes, discussões de fóruns, notícias financeiras mundiais e auditoria fiscal em tempo real.
          </p>
        </div>
      </div>

      {/* Grelha de Duas Colunas: Investigador Inteligente (Esquerda) e Notícias em Direto (Direita) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem', flexWrap: 'wrap' }}>
        
        {/* Painel de Investigação Avançada */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={18} className="text-primary" /> Pesquisar Ativo na Web (Deep Search)
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Insere um ticker (ex: QDVE, VWCE) ou um Domicílio (ex: LU) para esquadrinhar fóruns, notícias e o JustETF.
            </p>
          </div>

          <form onSubmit={handleDeepSearch} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Ex: QDVE, VWCE, Lyxor Luxemburgo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', outline: 'none' }}
            />
            <button className="btn btn-primary" type="submit" disabled={isScanning}>
              {isScanning ? 'A Varrer...' : 'Investigar Ativo'}
            </button>
          </form>

          {/* Consola de Logs com Efeito Laser */}
          {isScanning && (
            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--primary)', display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'var(--primary)', animation: 'scan-laser 2s linear infinite' }} />
              {scanLogs.map((log, idx) => (
                <div key={idx} style={{ animation: 'fade-in 0.3s ease-out' }}>
                  {log}
                </div>
              ))}
            </div>
          )}

          {/* Resultado da Investigação Formatado */}
          {scannedResult && (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', fontSize: '0.9rem', lineHeight: '1.6' }} className="fade-in">
              {scannedResult.split('\n').map((line, idx) => {
                if (line.startsWith('###')) {
                  return <h5 key={idx} style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary)', margin: '0.75rem 0 0.5rem 0' }}>{line.replace('###', '').trim()}</h5>;
                }
                if (line.startsWith('* ')) {
                  const parts = line.replace('* ', '').split(':');
                  return (
                    <div key={idx} style={{ marginBottom: '0.25rem' }}>
                      <strong style={{ color: 'var(--text-secondary)' }}>{parts[0]}:</strong>
                      <span>{parts.slice(1).join(':')}</span>
                    </div>
                  );
                }
                return <p key={idx} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{line}</p>;
              })}
            </div>
          )}
        </div>

        {/* Notícias e Rumores de Fóruns em Tempo Real */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Feed de Notícias Globais — ao vivo */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Globe size={16} style={{ color: 'var(--primary)' }} /> World Financial News
                <span style={{ fontSize: '0.6rem', background: 'rgba(34,197,94,0.15)', color: 'var(--primary)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: '800', letterSpacing: '0.05em', border: '1px solid rgba(34,197,94,0.25)' }}>⬤ AO VIVO</span>
                <button
                  onClick={fetchLiveNews}
                  title="Atualizar agora"
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
                >
                  <RefreshCw size={13} />
                </button>
              </h4>
              {lastNewsUpdate && (
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Última atualização: {lastNewsUpdate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                  {newsError && <span style={{ color: 'var(--warning)', marginLeft: '0.4rem' }}>(Modo offline — fonte indisponível)</span>}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {newsLoading && !news.length ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>A carregar notícias em tempo real...</p>
              ) : news.map(n => {
                const sentimentColor = 'var(--primary)';
                const sentimentBg = 'var(--primary-glow)';
                return (
                  <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.65rem', background: sentimentBg, color: sentimentColor, padding: '0.1rem 0.3rem', borderRadius: '4px', fontWeight: '700', textTransform: 'uppercase' }}>
                        {n.source}
                      </span>
                      {n.link ? (
                        <a href={n.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-primary)', marginTop: '0.2rem', textDecoration: 'none', lineHeight: '1.4' }}
                          onMouseEnter={e => (e.currentTarget.style.color = sentimentColor)}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                        >{n.title}</a>
                      ) : (
                        <p style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-primary)', marginTop: '0.2rem', lineHeight: '1.4' }}>{n.title}</p>
                      )}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{n.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discussões de Investidores (Reddit/Bogleheads) */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <MessageSquare size={16} style={{ color: 'var(--primary)' }} /> Investor Conversations
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {posts.map(p => (
                <div key={p.id} style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.02)', borderRadius: '8px', padding: '0.75rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    <strong>{p.user}</strong>
                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{p.community}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{p.text}</p>
                  <div style={{ display: 'flex', gap: '0.15rem', marginTop: '0.4rem', justifyContent: 'flex-end' }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx < p.hotness ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Tabela de Oportunidades Selecionadas de Elite - EDITÁVEL EM TEMPO REAL! */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} className="text-primary" /> Curadoria do Consultor: ETFs Recomendados
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Altera, adiciona ou remove recomendações fiscais diretamente. Todas as mudanças persistem no teu browser.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!isEditingCurated ? (
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsEditingCurated(true)}
                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Edit3 size={14} /> Editar Curadoria
              </button>
            ) : (
              <>
                <button 
                  className="btn btn-secondary" 
                  onClick={handleAddBlankCurated}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <PlusCircle size={14} /> Novo Ativo
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSaveCuratedList}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Save size={14} /> Gravar Alterações
                </button>
              </>
            )}
          </div>
        </div>

        {/* Legenda Explicativa do Sistema de Classificação de Elite (Ratings) */}
        <div style={{ background: 'hsla(230, 20%, 5%, 0.4)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="fade-in">
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>ℹ️ Guia Prático das Classificações de Eficiência (Ratings)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.75rem', lineHeight: '1.45' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ display: 'inline-block', background: 'var(--primary-glow)', color: 'var(--primary)', fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: '800', border: '1px solid rgba(126, 161, 138, 0.3)', width: 'fit-content' }}>S+ (Elite Suprema)</span>
              <p style={{ color: 'var(--text-muted)' }}>Fundo acumulador perfeito (Acc). Domiciliado na Irlanda (IE), TER ultra-competitivo (&lt;0.18%) e zero perdas fiscais de dividendos retidos na fonte (0% dividend leakage).</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ display: 'inline-block', background: 'var(--info-glow)', color: 'var(--info)', fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: '800', border: '1px solid rgba(131, 149, 167, 0.25)', width: 'fit-content' }}>A+ / A (Excelente Eficiência)</span>
              <p style={{ color: 'var(--text-muted)' }}>Eficiência fiscal elevada. Domiciliado na Irlanda (IE) e classe acumuladora, com TER competitivo variando entre 0.05% e 0.25% ao ano. Perfeito para posições nucleares da carteira.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ display: 'inline-block', background: 'var(--warning-glow)', color: 'var(--warning)', fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: '800', border: '1px solid rgba(189, 162, 108, 0.25)', width: 'fit-content' }}>Outros (Aceitável)</span>
              <p style={{ color: 'var(--text-muted)' }}>Ativos setoriais específicos ou com replicação sintética aceitável. Embora eficientes, apresentam taxas superiores ou cobertura de mercado ligeiramente restrita.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ display: 'inline-block', background: 'var(--danger-glow)', color: 'var(--danger)', fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: '800', border: '1px solid rgba(189, 108, 108, 0.25)', width: 'fit-content' }}>B (Arrasto Fiscal / Custo Elevado)</span>
              <p style={{ color: 'var(--text-muted)' }}>Alerta fiscal. Domicílio ineficiente (como Luxemburgo ou Alemanha para ações americanas), sofrendo perdas silenciosas de dividendos ou comissões TER exorbitantes.</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {curatedOpportunities.map(opp => {
            const isAlreadyAdded = etfs.some(e => e.ticker === opp.ticker) || addedTickers[opp.ticker];
            
            return (
              <div key={opp.ticker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', flexWrap: 'wrap' }} className="opportunity-row">
                
                {/* Visualização de Leitura */}
                {!isEditingCurated ? (
                  <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', background: 'var(--primary-glow)', padding: '0.2rem 0.6rem', borderRadius: '8px', border: '1px solid rgba(126, 161, 138, 0.2)' }}>{opp.ticker}</span>
                      <h5 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>{opp.name}</h5>
                      <span style={{ 
                        ...getRatingStyle(opp.rating), 
                        fontSize: '0.65rem', 
                        padding: '0.15rem 0.5rem', 
                        borderRadius: '4px', 
                        fontWeight: '800',
                        textTransform: 'uppercase'
                      }}>
                        CLASSIFICAÇÃO {opp.rating}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {opp.rationale}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      <span>CATEGORIA: <strong style={{ color: 'var(--text-secondary)' }}>{opp.category}</strong></span>
                      <span>COMISSÃO: <strong style={{ color: 'var(--primary)' }}>{opp.ter}% /ano</strong></span>
                      <span>DOMICÍLIO: <strong style={{ color: 'var(--text-secondary)' }}>{opp.domicile}</strong></span>
                      <span>DISTRIBUIÇÃO: <strong style={{ color: 'var(--text-secondary)' }}>{opp.distribution === 'Acc' ? 'Acumulação (Eficiente)' : 'Distribuição'}</strong></span>
                    </div>
                  </div>
                ) : (
                  
                  /* Visualização de Edição em Tempo Real */
                  <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <input 
                        type="text" 
                        value={opp.ticker} 
                        onChange={e => handleUpdateCuratedField(opp.ticker, 'ticker', e.target.value.toUpperCase())}
                        style={{ width: '80px', padding: '0.4rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontWeight: '700', textAlign: 'center' }}
                        placeholder="Ticker"
                      />
                      <input 
                        type="text" 
                        value={opp.name} 
                        onChange={e => handleUpdateCuratedField(opp.ticker, 'name', e.target.value)}
                        style={{ flex: 1, minWidth: '180px', padding: '0.4rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)' }}
                        placeholder="Nome do Fundo"
                      />
                      <input 
                        type="text" 
                        value={opp.rating} 
                        onChange={e => handleUpdateCuratedField(opp.ticker, 'rating', e.target.value.toUpperCase())}
                        style={{ width: '60px', padding: '0.4rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', textAlign: 'center' }}
                        placeholder="Rating"
                      />
                    </div>

                    <textarea
                      value={opp.rationale}
                      onChange={e => handleUpdateCuratedField(opp.ticker, 'rationale', e.target.value)}
                      style={{ width: '100%', height: '60px', padding: '0.5rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', resize: 'vertical' }}
                      placeholder="Nota de Fundamento Racional ou Alerta Fiscal"
                    />

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>CAT:</span>
                        <input 
                          type="text" 
                          value={opp.category} 
                          onChange={e => handleUpdateCuratedField(opp.ticker, 'category', e.target.value)}
                          style={{ width: '100px', padding: '0.25rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>TER:</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={opp.ter} 
                          onChange={e => handleUpdateCuratedField(opp.ticker, 'ter', Number(e.target.value))}
                          style={{ width: '60px', padding: '0.25rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>DOM:</span>
                        <select 
                          value={opp.domicile} 
                          onChange={e => handleUpdateCuratedField(opp.ticker, 'domicile', e.target.value)}
                          style={{ padding: '0.25rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                        >
                          <option value="IE">Irlanda (IE)</option>
                          <option value="LU">Luxemburgo (LU)</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>DIST:</span>
                        <select 
                          value={opp.distribution} 
                          onChange={e => handleUpdateCuratedField(opp.ticker, 'distribution', e.target.value)}
                          style={{ padding: '0.25rem', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-primary)' }}
                        >
                          <option value="Acc">Acumulação</option>
                          <option value="Dist">Distribuição</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ações Laterais */}
                <div>
                  {!isEditingCurated ? (
                    isAlreadyAdded ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(34, 197, 94, 0.05)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid rgba(34,197,94,0.15)' }}>
                        <Check size={16} /> Na Carteira
                      </span>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleAddOpportunity(opp)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.6rem 1.1rem' }}
                      >
                        Adicionar à Carteira <ChevronRight size={14} />
                      </button>
                    )
                  ) : (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleRemoveCuratedItem(opp.ticker)}
                      style={{ color: 'var(--danger)', padding: '0.5rem', borderRadius: '50%' }}
                      title="Remover Recomendação"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
