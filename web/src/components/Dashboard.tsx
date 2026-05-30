import { useState } from 'react';
import { ETF, PortfolioAlert } from '../types';
import { PiggyBank, Percent, Coins, ShieldAlert, AlertTriangle, CheckCircle, Info, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { getActiveBroker } from '../utils/advisorEngine';

interface DashboardProps {
  etfs: ETF[];
  alerts: PortfolioAlert[];
  onEdit?: (etf: ETF) => void;
  onUpdateEtfs?: (updatedEtfs: ETF[]) => void;
  portfolioName?: string;
  portfolioBroker?: string;
  userProfileBroker?: string;
}

// Componente principal do Dashboard que calcula estatísticas gerais e mostra alertas fiscais/financeiros.
export default function Dashboard({ etfs, alerts, onEdit, onUpdateEtfs, portfolioName, portfolioBroker, userProfileBroker }: DashboardProps) {
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  const totalInvested = etfs.reduce((acc, curr) => acc + curr.amountInvested, 0);
  const totalCurrent = etfs.reduce((acc, curr) => acc + (curr.currentValue || curr.amountInvested), 0);
  const profitEuro = totalCurrent - totalInvested;
  const profitPct = totalInvested > 0 ? (profitEuro / totalInvested) * 100 : 0;

  // Formata o valor monetário em euros para apresentação clara ao investidor.
  const formatMoney = (value: number) => {
    return value.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });
  };

  // Mapeia o tipo de alerta do motor para os ícones de feedback correspondentes.
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <ShieldAlert size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const dangerAlertsCount = alerts.filter(a => a.type === 'danger').length;

  const getAssociatedEtf = (alertId: string) => {
    // Procura por um ETF cujo id faça parte do alertId
    return etfs.find(e => alertId.endsWith(e.id));
  };

  const handleApplyQuickFix = (alertId: string, associatedEtfId?: string) => {
    if (!onUpdateEtfs) return;

    let updatedEtfs = [...etfs];

    if (alertId.startsWith('dist-tax-') && associatedEtfId) {
      // Altera de Distribuição para Acumulação
      updatedEtfs = etfs.map(e => e.id === associatedEtfId ? { ...e, distribution: 'Acc' } : e);
    } else if ((alertId.startsWith('lu-domicile-us-assets-') || alertId.startsWith('us-domicile-')) && associatedEtfId) {
      // Altera o Domicílio para Irlanda (IE)
      updatedEtfs = etfs.map(e => e.id === associatedEtfId ? { ...e, domicile: 'IE' } : e);
    } else if (alertId.startsWith('synthetic-') && associatedEtfId) {
      // Altera a Replicação para Física
      updatedEtfs = etfs.map(e => e.id === associatedEtfId ? { ...e, replication: 'Physical' } : e);
    } else if (alertId === 'weight-mismatch') {
      // Normaliza proporcionalmente os pesos de modo a somarem 100%
      const totalWeight = etfs.reduce((acc, curr) => acc + curr.weight, 0);
      if (totalWeight > 0) {
        updatedEtfs = etfs.map(e => ({
          ...e,
          weight: Number(((e.weight / totalWeight) * 100).toFixed(0))
        }));
        
        // Ajusta pequena discrepância residual para somar exatamente 100
        const normalizedSum = updatedEtfs.reduce((acc, curr) => acc + curr.weight, 0);
        if (normalizedSum !== 100 && updatedEtfs.length > 0) {
          updatedEtfs[0].weight += (100 - normalizedSum);
        }
      } else {
        // Se todos forem 0, divide igualmente
        const equalWeight = Math.floor(100 / etfs.length);
        updatedEtfs = etfs.map((e, idx) => ({
          ...e,
          weight: idx === 0 ? equalWeight + (100 - (equalWeight * etfs.length)) : equalWeight
        }));
      }
    }

    onUpdateEtfs(updatedEtfs);
    setExpandedAlertId(null); // Fecha o painel após aplicar
  };

  const renderAlertGuide = (alert: PortfolioAlert) => {
    const etf = getAssociatedEtf(alert.id);
    const hasQuickFix = 
      alert.id.startsWith('dist-tax-') || 
      alert.id.startsWith('lu-domicile-us-assets-') || 
      alert.id.startsWith('us-domicile-') || 
      alert.id.startsWith('synthetic-') || 
      alert.id === 'weight-mismatch';

    // Identifica os ativos associados, quer seja um individual quer sejam múltiplos para alertas agregados
    let offendingEtfs: ETF[] = [];
    if (etf) {
      offendingEtfs = [etf];
    } else if (alert.id === 'high-ter-avg' || alert.id === 'med-ter-avg') {
      offendingEtfs = etfs.filter(e => e.ter > 0.15);
    } else if (alert.id === 'sp500-overlap') {
      offendingEtfs = etfs.filter(e => e.name.toLowerCase().includes('s&p 500') || e.name.toLowerCase().includes('sp500') || e.ticker.toLowerCase().includes('vusa') || e.ticker.toLowerCase().includes('susa') || e.ticker.toLowerCase().includes('iusa'));
    } else if (alert.id === 'world-overlap') {
      offendingEtfs = etfs.filter(e => e.name.toLowerCase().includes('world') || e.ticker.toLowerCase().includes('iwda') || e.ticker.toLowerCase().includes('vcwe') || e.ticker.toLowerCase().includes('vwce'));
    } else if (alert.id === 'weight-mismatch') {
      offendingEtfs = etfs;
    }

    return (
      <div 
        className="alert-details-guide" 
        style={{ 
          marginTop: '1rem', 
          padding: '1.25rem', 
          background: 'rgba(255, 255, 255, 0.02)', 
          border: '1px solid var(--border-color)', 
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
        onClick={(e) => e.stopPropagation()} // Impede que feche o alert ao clicar dentro do guia
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.05em' }}>
          <Sparkles size={16} /> GUIA DE RESOLUÇÃO INSIDER
        </div>
        
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>
          {alert.id.startsWith('dist-tax-') && (
            "Para eliminar a retenção automática de 28% de IRS em Portugal, deves mudar o ETF para a versão de Acumulação (Acc). Isso faz com que os dividendos sejam reinvestidos brutos de imediato pela gestora do fundo."
          )}
          {alert.id.startsWith('lu-domicile-') && (
            "Domiciliar na Irlanda (IE) reduz a retenção na fonte americana em dividendos de 30% para 15% devido ao tratado preferencial. Isto estanca um vazamento silencioso de rentabilidade anual."
          )}
          {alert.id.startsWith('us-domicile-') && (
            "Ao mudar para domicílio irlandês (IE), esquivas-te da exposição ao Estate Tax dos EUA (imposto sucessório draconiano) e ficas coberto pelas regras de proteção UCITS europeias."
          )}
          {alert.id.startsWith('synthetic-') && (
            "Substituir o ETF sintético por um de Replicação Física Direta elimina o risco de contraparte financeira e garante que deténs os ativos reais em custódia direta."
          )}
          {alert.id === 'weight-mismatch' && (
            "Para uma representação correta da carteira e um rebalanceamento eficaz, deves normalizar os pesos dos teus ETFs de forma a totalizarem exatamente 100%."
          )}
          {alert.id.startsWith('high-ter-') && (
            "Recomendamos estudar a troca desta posição por um ETF alternativo de menor TER (ex: Vanguard ou iShares) no separador de 'Oportunidades de Elite' para maximizar o retorno futuro."
          )}
          {alert.id === 'high-ter-avg' && (
            "Para baixar o teu custo médio ponderado, deves focar o teu capital em ETFs mais eficientes na Irlanda e que tenham taxas de gestão baixas (abaixo de 0.20%)."
          )}
          {alert.id === 'sp500-overlap' && (
            "Deves concentrar o teu capital num único ETF de S&P 500 (ex: SXR8) para poupar comissões e simplificar a gestão. Vende a outra posição redundante e aloca os fundos na principal."
          )}
          {alert.id === 'world-overlap' && (
            "Simplifica a tua carteira fundindo os ETFs globais redundantes num único fundo All-World de alta liquidez. Menos comissões, mais foco."
          )}
        </p>

        {/* SECÇÃO DETALHADA: PORQUE DEVES CORRIGIR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', margin: 0 }}>
          <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>⚠️ Porque deves corrigir isto:</strong>
          <ul style={{ margin: 0, paddingLeft: '1.15rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {alert.id.startsWith('dist-tax-') && (
              <>
                <li><strong>Retenção Imediata:</strong> Cada dividendo pago sofre retenção automática de 28% de IRS em Portugal, mutilando o teu efeito de capitalização.</li>
                <li><strong>Eficiência Nula:</strong> O mesmo ETF em versão de Acumulação reinveste 100% dos dividendos brutos sem pagar IRS anual.</li>
              </>
            )}
            {alert.id.startsWith('lu-domicile-') && (
              <>
                <li><strong>Fuga de Dividendos (Leakage):</strong> O Luxemburgo retém 30% na fonte dos dividendos americanos, enquanto a Irlanda só retém 15% devido ao tratado preferencial.</li>
                <li><strong>Perda Silenciosa:</strong> Perdes cerca de 0.30% de rentabilidade ao ano descontados diretamente do valor de cotização do teu fundo de forma invisível.</li>
              </>
            )}
            {alert.id.startsWith('us-domicile-') && (
              <>
                <li><strong>Imposto Sucessório (Estate Tax):</strong> O fisco dos EUA cobra até 40% de imposto sucessório sobre ativos americanos de não-residentes acima de $60.000 em caso de morte.</li>
                <li><strong>Sem Proteção UCITS:</strong> Os fundos domiciliados fora da UE não beneficiam dos mesmos padrões rigorosos de custódia e proteção de retalho.</li>
              </>
            )}
            {alert.id.startsWith('synthetic-') && (
              <>
                <li><strong>Risco de Falência (Contraparte):</strong> Se a instituição financeira que emite o swap de derivados falir, o teu ETF pode sofrer perdas severas.</li>
                <li><strong>Dificuldade de Auditoria:</strong> É mais difícil auditar a transparência e as garantias reais que servem de colateral aos fundos sintéticos.</li>
              </>
            )}
            {alert.id === 'weight-mismatch' && (
              <>
                <li><strong>Estatísticas Distorcidas:</strong> Sem pesos que somem 100%, os algoritmos de rebalanceamento por reforço não conseguem aproximar a carteira do teu perfil real.</li>
                <li><strong>Perda de Rastreio:</strong> Torna-se impossível calcular com exatidão o teu TER médio ponderado e o arrasto de custos reais sobre o portefólio global.</li>
              </>
            )}
            {(alert.id === 'high-ter-avg' || alert.id === 'med-ter-avg' || alert.id.startsWith('high-ter-')) && (
              <>
                <li><strong>Arrasto de Rentabilidade (TER Drag):</strong> Comissões elevadas reduzem diretamente a quantidade de ações compradas de forma silenciosa e diária.</li>
                <li><strong>Juros Compostos Canibalizados:</strong> Um TER de 0.33% face a um de 0.07% pode roubar-te dezenas de milhares de euros ao fim de 25-30 anos de acumulação.</li>
              </>
            )}
            {alert.id === 'sp500-overlap' && (
              <>
                <li><strong>Falsa Diversificação:</strong> Deter múltiplos ETFs que seguem o S&P 500 apenas duplica custos de transação sem adicionar qualquer proteção macroeconómica.</li>
                <li><strong>Custos Redundantes:</strong> Fundos diferentes cobram taxas diferentes. Deves concentrar todo o capital no fundo com o menor TER e política Acc.</li>
              </>
            )}
            {alert.id === 'world-overlap' && (
              <>
                <li><strong>Ineficiência Operacional:</strong> Os índices globais têm sobreposições de 95%+. Estás a pagar taxas duplicadas por ativos idênticos.</li>
                <li><strong>Complexidade Fiscal:</strong> Ter mais ativos do que o necessário dificulta enormemente a declaração de IRS (Anexo J) no momento da venda.</li>
              </>
            )}
          </ul>
        </div>

        {/* SECÇÃO DETALHADA: COMO AGIR NO TEU BROKER */}
        {(() => {
          const broker = getActiveBroker(portfolioName || '', portfolioBroker, userProfileBroker);
          return (
            <div style={{
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--info)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>🛡️ Orientações Práticas p/ a tua Corretora ({broker})</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
                {broker === 'XTB' && (
                  <>
                    Como usas a <strong>XTB</strong>, recorda que tens <strong>0% de comissão</strong> de compra/venda de ETFs. No entanto, se o teu alerta for sobre taxas de gestão (TER) ou domicílio e decidires trocar de ativo, <strong>NÃO vendas as tuas unidades se tiveres mais-valias acumuladas significativas</strong>, para evitar a cobrança de 28% de IRS sobre a venda. Em vez disso, aconselhamos-te a <strong>manter (HOLD)</strong> o ativo atual e passar a reforçar o novo ETF otimizado nas tuas ordens mensais. Evita ETFs cotados em USD devido à taxa de câmbio de 0.50% da XTB.
                  </>
                )}
                {broker === 'DEGIRO' && (
                  <>
                    Como usas a <strong>DEGIRO</strong>, podes usufruir da <strong>Lista de ETFs Populares Sem Comissão</strong> se escolheres as bolsas qualificadas (ex: Tradegate). Caso optes por rebalancear e substituir o teu ativo por um melhor, podes fazê-lo comprando o novo sem custos de transação na listagem grátis. Para declarar IRS, não te esqueças de anexar o <strong>IBAN estrangeiro da conta Flatex (Alemanha) no Quadro 11 do Anexo J do IRS</strong>, mesmo que apenas mantenhas as tuas unidades sem qualquer venda ou dividendos pagos!
                  </>
                )}
                {broker === 'Trading212' && (
                  <>
                    Como usas a <strong>Trading212</strong>, as tuas transações são isentas de comissão e a taxa de câmbio é de apenas <strong>0.15%</strong>. Se precisas de trocar de ativos ineficientes (ex: de Distribuição para Acumulação), podes fazê-lo comprando frações do novo ETF sem qualquer custo extra. Para efeitos fiscais em Portugal, deves declarar detalhadamente os teus dividendos e mais-valias no <strong>Anexo J do IRS</strong>, bem como a tua conta de liquidação estrangeira no Quadro 11.
                  </>
                )}
                {broker === 'Interactive Brokers' && (
                  <>
                    Como usas a <strong>Interactive Brokers (IBKR)</strong>, as tuas ordens de substituição têm taxas de transação baixas (geralmente entre 1.25€ e 3.00€) com a melhor taxa de câmbio Spot real do mercado. Se alterares a tua carteira para ETFs mais eficientes na Irlanda (IE) e Acumulação (Acc), lembra-te que os relatórios anuais da IBKR são complexos; reserva tempo extra para extrair as transações para o <strong>Anexo J do IRS</strong>.
                  </>
                )}
                {broker === 'Outro' && (
                  <>
                    Como a tua carteira não tem uma corretora identificada no nome, recordamos a regra de ouro fiscal portuguesa: <strong>nunca vendas ETFs com lucro para trocar por outros</strong>, pois perdes imediatamente 28% do teu capital acumulado em imposto sobre mais-valias. Em vez disso, faz <strong>HOLD (manter)</strong> no ETF ineficiente e canaliza 100% dos teus novos capitais de reforço para o ETF recomendado! Declara todas as vendas e dividendos no <strong>Anexo J do IRS</strong>.
                  </>
                )}
              </p>
            </div>
          );
        })()}

        {/* SECÇÃO DETALHADA: ONDE PODES CORRIGIR (ATIVOS EM CAUSA) */}
        {offendingEtfs.length > 0 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📍 Onde deves corrigir (Ativos afetados):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {offendingEtfs.map(e => (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'var(--border-color)', padding: '0.2rem 0.4rem', borderRadius: '4px', color: 'var(--text-primary)' }}>{e.ticker}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>{e.name}</span>
                    <span style={{ fontSize: '0.75rem', color: e.ter > 0.2 ? 'var(--danger)' : 'var(--text-muted)' }}>(TER: {e.ter}%)</span>
                  </div>
                  {onEdit && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', gap: '0.25rem' }}
                      onClick={(evt) => {
                        evt.stopPropagation();
                        onEdit(e);
                      }}
                    >
                      ✏️ Alterar Ativo
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {alert.details && (
          <div className="alert-details" style={{ margin: 0, padding: '0.75rem', background: 'rgba(255, 255, 255, 0.01)', borderLeft: '3px solid var(--primary)' }}>
            <strong>Análise "Insider":</strong> {alert.details}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          {hasQuickFix && onUpdateEtfs && (
            <button 
              className="btn btn-primary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.3rem' }}
              onClick={() => handleApplyQuickFix(alert.id, etf?.id)}
            >
              ⚡ Correção de 1-Clique
            </button>
          )}

          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.3rem' }}
            onClick={() => {
              const text = `Como corrigir o alerta "${alert.title}": ${alert.details || alert.message}`;
              navigator.clipboard.writeText(text);
              window.alert("Instruções de correção copiadas para a área de transferência!");
            }}
          >
            📋 Copiar Instruções
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Grelha de Estatísticas Financeiras Premium */}
      <div className="stats-grid">
        
        {/* Total Investido */}
        <div className="card">
          <div className="stat-card">
            <span className="stat-label">Total Investido (Custo)</span>
            <span className="stat-value text-secondary" style={{ color: 'var(--text-muted)' }}>{formatMoney(totalInvested)}</span>
            <div className="stat-icon">
              <PiggyBank size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Alocado em {etfs.length} ETF{etfs.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Valor de Mercado Atual */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="stat-card">
            <span className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Valor de Mercado <span style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block' }} />
            </span>
            <span className="stat-value primary" style={{ transition: 'color 0.5s ease-out' }}>
              {formatMoney(totalCurrent)}
            </span>
            <div className="stat-icon" style={{ color: 'var(--primary)' }}>
              <Coins size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>
              Preços de mercado em direto
            </span>
          </div>
        </div>

        {/* Rentabilidade Global (Tempo Real) */}
        <div className="card">
          <div className="stat-card">
            <span className="stat-label">Rentabilidade Global</span>
            <span className={`stat-value ${profitEuro >= 0 ? 'text-success' : 'text-danger'}`} style={{ color: profitEuro >= 0 ? 'var(--primary)' : 'var(--danger)' }}>
              {profitEuro >= 0 ? '+' : ''}{formatMoney(profitEuro)}
            </span>
            <div className="stat-icon" style={{ color: profitEuro >= 0 ? 'var(--primary)' : 'var(--danger)' }}>
              <Percent size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: profitEuro >= 0 ? 'var(--primary)' : 'var(--danger)' }}>
              {profitEuro >= 0 ? '▲' : '▼'} {profitPct.toFixed(2)}% de retorno
            </span>
          </div>
        </div>

        {/* Custos do TER anual / Alertas Ativos */}
        <div className="card">
          <div className="stat-card">
            <span className="stat-label">Fugas & Fricção Fiscal</span>
            <span className="stat-value" style={{ color: dangerAlertsCount > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
              {dangerAlertsCount} Alertas
            </span>
            <div className="stat-icon" style={{ color: dangerAlertsCount > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
              <ShieldAlert size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Inconsistências de domiciliação ou de distribuição
            </span>
          </div>
        </div>

      </div>

      {/* Secção de Alertas Gerados pelo Motor Cético */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Relatório do Consultor Cético</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Análise em tempo real de vulnerabilidades fiscais, de custódia e redundância. Clica num alerta para ver o guia de resolução passo-a-passo.
          </p>
        </div>

        <div className="alerts-list">
          {alerts.map(alert => {
            const isExpanded = expandedAlertId === alert.id;
            const hasGuide = alert.id !== 'welcome';

            return (
              <div 
                key={alert.id} 
                className={`alert-item ${alert.type}`}
                style={{ cursor: hasGuide ? 'pointer' : 'default', transition: 'var(--transition-smooth)', display: 'block', padding: '1.25rem' }}
                onClick={() => hasGuide && setExpandedAlertId(isExpanded ? null : alert.id)}
              >
                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                  <div className="alert-icon" style={{ marginTop: '0.15rem' }}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="alert-content" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h4 style={{ margin: 0, fontWeight: '700' }}>{alert.title}</h4>
                      {hasGuide && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                          {isExpanded ? 'Fechar Guia' : 'Como Corrigir?'}
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </span>
                      )}
                    </div>
                    <p style={{ marginTop: '0.35rem', marginBottom: 0, fontSize: '0.9rem' }}>{alert.message}</p>
                    
                    {alert.details && !isExpanded && (
                      <div className="alert-details" style={{ marginTop: '0.50rem', fontSize: '0.85rem' }}>
                        <strong>Análise "Insider":</strong> {alert.details}
                      </div>
                    )}
                  </div>
                </div>

                {/* Painel de Correção em Dropdown */}
                {isExpanded && renderAlertGuide(alert)}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
