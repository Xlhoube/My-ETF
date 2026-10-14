import { ETF, MarketEtf } from '../types';
import { 
  Building2, 
  Upload, 
  Camera, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Trash2, 
  MessageSquare,
  Plus
} from 'lucide-react';

interface UserPortfolioTabProps {
  userPortfolio: {
    name: string;
    broker: string;
    etfs: ETF[];
    cashBalance: number;
  } | null;
  marketEtfs: MarketEtf[];
  onOpenBrokerImport: (broker?: string) => void;
  onAskAdvisor: (query: string) => void;
  onClearPortfolio: () => void;
  onLoadDemoExample: () => void;
}

export default function UserPortfolioTab({
  userPortfolio,
  marketEtfs,
  onOpenBrokerImport,
  onAskAdvisor,
  onClearPortfolio,
  onLoadDemoExample
}: UserPortfolioTabProps) {

  // Mapeia os ETFs do portefólio com as cotações reais das bolsas do scanner
  const enrichedEtfs = (userPortfolio?.etfs || []).map(etf => {
    const liveMarket = marketEtfs.find(m => m.ticker === etf.ticker);
    const livePrice = liveMarket ? liveMarket.currentPrice : (etf.lastPrice || 100);
    const cost = etf.amountInvested;
    const currentVal = etf.currentValue > 0 ? etf.currentValue : cost;
    const pnl = currentVal - cost;
    const pnlPercent = cost > 0 ? (pnl / cost) * 100 : 0;

    return {
      ...etf,
      livePrice,
      pnl,
      pnlPercent,
      signal: liveMarket?.signal || 'NEUTRAL',
      score: liveMarket?.score || 50,
      ter: liveMarket?.fundamental.ter || etf.ter || 0.20,
      domicile: liveMarket?.fundamental.domicile || etf.domicile || 'IE',
      accumulating: liveMarket ? liveMarket.fundamental.accumulating : (etf.distribution === 'Acc')
    };
  });

  const totalInvested = enrichedEtfs.reduce((sum, e) => sum + e.amountInvested, 0);
  const totalCurrentValue = enrichedEtfs.reduce((sum, e) => sum + e.currentValue, 0);
  const cash = userPortfolio?.cashBalance || 0;
  const totalNetWorth = totalCurrentValue + cash;
  const totalPnl = totalCurrentValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  // Custo médio ponderado de gestão (TER)
  const weightedTer = totalCurrentValue > 0 
    ? enrichedEtfs.reduce((sum, e) => sum + (e.currentValue * e.ter), 0) / totalCurrentValue 
    : 0.18;

  // Verificações fiscais portuguesas
  const allIrishDomicile = enrichedEtfs.length > 0 && enrichedEtfs.every(e => e.domicile === 'IE');
  const allAccumulating = enrichedEtfs.length > 0 && enrichedEtfs.every(e => e.accumulating);

  // ESTADO VAZIO: UTILIZADOR AINDA NÃO CARREGOU CARTEIRA
  if (!userPortfolio || userPortfolio.etfs.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        
        {/* BANNER PRINCIPAL DE CAPTURA DE ECRÃ XTB */}
        <div className="card" style={{ 
          padding: '2.5rem',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(56, 189, 248, 0.08) 50%, rgba(0, 0, 0, 0.95))',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ 
                width: '54px', height: '54px', borderRadius: '14px', 
                background: 'rgba(16, 185, 129, 0.2)', color: '#10b981',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(16, 185, 129, 0.5)'
              }}>
                <Building2 size={28} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                    O Meu Portefólio Real
                  </h2>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#10b981', color: '#000', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                    Universal
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                  Acompanha a tua carteira real, recebe alertas de rebalanceamento e otimização fiscal contínua.
                </p>
              </div>
            </div>

            <span style={{ fontSize: '0.78rem', padding: '0.3rem 0.75rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              Totalmente Privado • Armazenamento Local
            </span>
          </div>

          <div style={{ maxWidth: '780px', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Queres que a aplicação te oriente sobre quando comprar, reforçar ou realizar lucros?
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Não precisas de ligar contas bancárias nem partilhar palavras-passe. 
              Basta tirares uma <strong>captura de ecrã (print)</strong> da tua carteira em qualquer corretora ou banco (DEGIRO, XTB, Trading 212, Interactive Brokers, Trade Republic, Revolut, etc.) e o nosso motor de Inteligência Artificial lê de imediato os teus ETFs e cotações.
            </p>
          </div>

          {/* AÇÕES DE IMPORTAÇÃO */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button 
              onClick={() => onOpenBrokerImport()}
              className="btn btn-primary"
              style={{ 
                padding: '0.85rem 1.6rem', 
                fontSize: '0.95rem', 
                background: '#10b981', 
                color: '#000', 
                fontWeight: 800,
                gap: '0.6rem',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Camera size={20} />
              <span>Importar da Corretora (Captura de Ecrã)</span>
            </button>

            <button 
              onClick={onLoadDemoExample}
              className="btn btn-secondary"
              style={{ padding: '0.85rem 1.4rem', fontSize: '0.92rem', gap: '0.55rem' }}
            >
              <Sparkles size={18} style={{ color: '#38bdf8' }} />
              <span>Carregar Carteira Exemplo Real</span>
            </button>
          </div>

        </div>

        {/* GUIA EM 3 PASSOS SIMPLES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.85rem' }}>
              1
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Abre a tua Corretora ou Banco
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Navega até ao separador de <strong>"Portfólio"</strong> ou <strong>"Posições Abertas"</strong> onde aparecem os teus ETFs e o valor investido.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.85rem' }}>
              2
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Tira um Print do Ecrã
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Tira uma fotografia ou captura de ecrã (screenshot) onde sejam visíveis os nomes dos ativos e os valores.
            </p>
          </div>

          <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '0.85rem' }}>
              3
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Arrasta para a Aplicação
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Clica em <strong>"Importar da Corretora"</strong>. O motor de Visão Artificial interpreta os dados e cria o teu radar personalizado.
            </p>
          </div>

        </div>

      </div>
    );
  }

  // ESTADO PREENCHIDO: O PORTEFÓLIO XTB ESTÁ CARREGADO E ATIVO
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      
      {/* 1. CABEÇALHO DO PORTEFÓLIO XTB */}
      <div className="card" style={{ 
        padding: '2rem 2.25rem',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 0, 0, 0.95))',
        border: '1px solid rgba(16, 185, 129, 0.35)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '12px', 
              background: 'rgba(16, 185, 129, 0.2)', color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }}>
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0 }}>
                  {userPortfolio.name || 'O Meu Portefólio Real'}
                </h2>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#10b981', color: '#000', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                  {userPortfolio.broker || 'Corretora'}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                {enrichedEtfs.length} {enrichedEtfs.length === 1 ? 'ativo monitorizado' : 'ativos monitorizados'} em direto nas bolsas europeias
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onOpenBrokerImport(userPortfolio.broker || undefined)}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.55rem 0.95rem', gap: '0.45rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
              title="Carregar nova captura de ecrã para atualizar dados"
            >
              <Upload size={15} />
              <span>Atualizar Captura de Ecrã</span>
            </button>

            <button 
              onClick={() => onAskAdvisor(`Audita o meu portefólio da ${userPortfolio.broker || 'minha corretora'}. Tenho ${totalNetWorth.toFixed(2)}€ investidos distribuídos por: ${enrichedEtfs.map(e => `${e.ticker} (${e.currentValue.toFixed(0)}€)`).join(', ')}. Quais são os pontos fortes e os riscos de diversificação ou fiscais em Portugal?`)}
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '0.55rem 1rem', gap: '0.45rem', background: '#10b981', color: '#000' }}
            >
              <MessageSquare size={15} />
              <span>Auditar com Consultor</span>
            </button>

            <button 
              onClick={onClearPortfolio}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.55rem 0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              title="Limpar portefólio importado"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* 4 CARDS DE MÉTRICAS CHAVE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          
          <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Património Total {userPortfolio.broker ? `(${userPortfolio.broker})` : ''}
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {totalNetWorth.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Investido: {totalInvested.toFixed(2)} € • Caixa: {cash.toFixed(2)} €
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Mais-Valia Acumulada
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: totalPnl >= 0 ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {totalPnl >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              <span>{totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)} €</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: totalPnl >= 0 ? '#10b981' : '#ef4444', marginTop: '0.2rem', fontWeight: 700 }}>
              {totalPnl >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}% desde o início
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Custo Médio de Gestão (TER)
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10b981' }}>
              {weightedTer.toFixed(2)}% <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ ano</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#10b981', marginTop: '0.2rem' }}>
              Poupas ~2.3%/ano face a fundos de banco tradicional
            </div>
          </div>

          <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Eficiência Fiscal Portugal
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: allIrishDomicile && allAccumulating ? '#10b981' : '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={20} />
              <span>{allIrishDomicile && allAccumulating ? '100% Otimizado' : 'Atenção Fiscal'}</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {allIrishDomicile && allAccumulating ? 'Domicílio Irlanda (15%) & Sem retenção IRS 28%' : 'Revê dividendos ou domicílio dos ativos'}
            </div>
          </div>

        </div>
      </div>

      {/* 2. RECOMENDAÇÃO INTELIGENTE DO CONSULTOR PARA A CARTEIRA */}
      <div className="card" style={{ 
        padding: '1.5rem', 
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(0, 0, 0, 0.95))',
        border: '1px solid rgba(56, 189, 248, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ 
            width: '42px', height: '42px', borderRadius: '10px', 
            background: 'rgba(56, 189, 248, 0.2)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(56, 189, 248, 0.4)', flexShrink: 0
          }}>
            <Sparkles size={22} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                Orientação Estratégica do Consultor para a tua carteira {userPortfolio.broker ? `(${userPortfolio.broker})` : ''}
              </h4>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Auditoria Algorítmica Contínua
              </span>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 0.85rem 0' }}>
              {enrichedEtfs.some(e => e.pnlPercent > 15) ? (
                <span>Tens posições com ganhos superiores a +15%. O mercado está em níveis saudáveis. Considera manter a estratégia de acumulação e reservar novos reforços para ETFs com RSI mais baixo.</span>
              ) : (
                <span>A tua carteira apresenta uma base sólida. Lembra-te de manter a disciplina de aportes mensais constantes (DCA) sem tentar adivinhar topos ou fundos diários.</span>
              )}
            </p>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => onAskAdvisor(`Faz um raio-X completo à minha carteira ${userPortfolio.broker || 'de investimentos'}. Compara as ponderações atuais dos meus ETFs (${enrichedEtfs.map(e => `${e.ticker}: ${e.weight}%`).join(', ')}) com as melhores práticas de investimento passivo global.`)}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', gap: '0.4rem', color: 'var(--primary)', borderColor: 'rgba(56, 189, 248, 0.35)' }}
              >
                <MessageSquare size={14} />
                <span>Pedir Raio-X de Ponderação</span>
              </button>

              <button 
                onClick={() => onAskAdvisor(`Como posso rebalancear a minha carteira ${userPortfolio.broker || 'de investimentos'} sem incorrer em pagamento desnecessário de impostos de 28% sobre mais-valias em Portugal?`)}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem', gap: '0.4rem' }}
              >
                <ShieldCheck size={14} style={{ color: '#10b981' }} />
                <span>Rebalanceamento sem IRS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABELA DETALHADA DE POSIÇÕES */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              Posições Ativas {userPortfolio.broker ? `(${userPortfolio.broker})` : ''}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
              Cotações sincronizadas em direto com as bolsas XETRA e Euronext.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => onOpenBrokerImport(userPortfolio.broker || undefined)}
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem', gap: '0.35rem' }}
            >
              <Plus size={14} />
              <span>Adicionar ETF</span>
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.65rem 0.5rem' }}>Ativo</th>
                <th style={{ padding: '0.65rem 0.5rem' }}>Cotação em Bolsa</th>
                <th style={{ padding: '0.65rem 0.5rem' }}>Capital Investido</th>
                <th style={{ padding: '0.65rem 0.5rem' }}>Valor Atual</th>
                <th style={{ padding: '0.65rem 0.5rem' }}>Mais-Valia</th>
                <th style={{ padding: '0.65rem 0.5rem' }}>Peso na Carteira</th>
                <th style={{ padding: '0.65rem 0.5rem', textAlign: 'center' }}>Sinal do Radar</th>
              </tr>
            </thead>
            <tbody>
              {enrichedEtfs.map(etf => {
                const weight = totalCurrentValue > 0 ? (etf.currentValue / totalCurrentValue) * 100 : 0;

                return (
                  <tr key={etf.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    
                    {/* ATIVO */}
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#10b981' }}>
                        {etf.ticker}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {etf.name}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        TER {etf.ter}% • {etf.domicile} • {etf.distribution}
                      </div>
                    </td>

                    {/* COTAÇÃO EM BOLSA */}
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        {etf.livePrice.toFixed(2)} €
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 600 }}>
                        ● Direto XETRA
                      </span>
                    </td>

                    {/* INVESTIDO */}
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 700 }}>
                        {etf.amountInvested.toFixed(2)} €
                      </div>
                    </td>

                    {/* VALOR ATUAL */}
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                        {etf.currentValue.toFixed(2)} €
                      </div>
                    </td>

                    {/* MAIS-VALIA */}
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ fontWeight: 800, color: etf.pnl >= 0 ? '#10b981' : '#ef4444' }}>
                        {etf.pnl >= 0 ? '+' : ''}{etf.pnl.toFixed(2)} €
                      </div>
                      <div style={{ fontSize: '0.72rem', color: etf.pnl >= 0 ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                        {etf.pnl >= 0 ? '+' : ''}{etf.pnlPercent.toFixed(2)}%
                      </div>
                    </td>

                    {/* PESO NA CARTEIRA */}
                    <td style={{ padding: '0.85rem 0.5rem', width: '130px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                        <span>{weight.toFixed(1)}%</span>
                      </div>
                      <div style={{ width: '100%', height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(weight, 100)}%`, height: '100%', background: '#10b981', borderRadius: '3px' }} />
                      </div>
                    </td>

                    {/* SINAL DO RADAR */}
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                      <span style={{ 
                        fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '4px',
                        background: etf.signal === 'STRONG_BUY' || etf.signal === 'BUY' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)',
                        color: etf.signal === 'STRONG_BUY' || etf.signal === 'BUY' ? '#10b981' : 'var(--text-muted)'
                      }}>
                        {etf.signal === 'STRONG_BUY' ? 'COMPRA FORTE' : (etf.signal === 'BUY' ? 'COMPRA' : 'MANTER')}
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
