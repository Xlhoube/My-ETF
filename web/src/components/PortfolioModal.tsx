import { useState, useEffect } from 'react';
import { Portfolio, ETF } from '../types';
import { X, Save, FolderKanban, ChevronRight, ChevronLeft, Shield, TrendingUp, BarChart2, Zap, Clock, Wallet, Globe, Cpu, Building2, Leaf, Check } from 'lucide-react';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (portfolio: Partial<Portfolio> & { starterEtfs?: ETF[] }) => void;
  onDelete?: (id: string) => void;
  existingPortfolio: Portfolio | null;
  userProfileBroker?: string;
  onImportFromPrint?: (portfolioId?: string) => void;
}

type RiskProfile = 'conservador' | 'moderado' | 'agressivo';
type Theme = 'global' | 'tech' | 'europe' | 'emerging' | 'mixed';

interface WizardState {
  name: string;
  broker: string;
  // Wizard-only fields
  riskProfile: RiskProfile;
  horizon: number;         // years
  monthlyAmount: number;   // euros
  initialAmount: number;   // capital inicial
  etfCount: number;        // 1–8
  theme: Theme;
  cashBalance?: number;
}

interface EtfTemplate {
  ticker: string;
  name: string;
  ter: number;
  domicile: 'IE' | 'LU';
  distribution: 'Acc' | 'Dist';
  replication: 'Physical' | 'Synthetic';
  weight: number;          // suggested weight %
  rationale: string;
  tags: Array<RiskProfile | Theme | 'core' | 'satellite'>;
}

// Full library of curated ETF candidates
const ETF_LIBRARY: EtfTemplate[] = [
  // ── Núcleo Global ────────────────────────────────────────────────────────────
  { ticker: 'SPYI',  name: 'SPDR MSCI ACWI IMI (Acc)',                      ter: 0.17, domicile: 'IE', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'Cobertura global de 9000+ empresas incluindo Small Caps — a carteira de ETF único ideal.',             tags: ['conservador','moderado','agressivo','global','mixed','core'] },
  { ticker: 'SXR8',  name: 'iShares Core S&P 500 (Acc)',                    ter: 0.07, domicile: 'IE', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'O padrão dourado do mercado americano — TER 0.07%, liquidez máxima e eficiência fiscal perfeita.', tags: ['conservador','moderado','agressivo','global','mixed','core'] },
  { ticker: 'VWCE',  name: 'Vanguard FTSE All-World (Acc)',                  ter: 0.22, domicile: 'IE', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'Referência buy-and-hold da Vanguard com 3700+ empresas globais.',                                  tags: ['conservador','moderado','agressivo','global','mixed','core'] },
  { ticker: 'IUSQ',  name: 'iShares MSCI ACWI (Acc)',                       ter: 0.20, domicile: 'IE', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'Global desenvolvido + emergente, gerido pela BlackRock. Simples e eficiente.',                      tags: ['conservador','moderado','global','mixed','core'] },
  // ── Tecnologia ───────────────────────────────────────────────────────────────
  { ticker: 'QDVE',  name: 'iShares S&P 500 Information Technology (Acc)',  ter: 0.15, domicile: 'IE', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'Exposição pura ao setor tech americano — TER 0.15%, mais barato que o Nasdaq 100.',             tags: ['moderado','agressivo','tech','mixed','satellite'] },
  { ticker: 'CNDX',  name: 'iShares Nasdaq 100 (Acc)',                      ter: 0.33, domicile: 'IE', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'As 100 maiores tech americanas — índice de referência do crescimento tecnológico.',             tags: ['moderado','agressivo','tech','mixed','satellite'] },
  { ticker: 'SMH',   name: 'VanEck Semiconductor UCITS ETF',                ter: 0.35, domicile: 'IE', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'Semicondutores — espinha dorsal da economia digital e IA. Alta volatilidade, alto potencial.',  tags: ['agressivo','tech','satellite'] },
  { ticker: 'IQQH',  name: 'iShares Global Clean Energy (Acc)',              ter: 0.65, domicile: 'IE', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'Exposição às energias renováveis globais — tema de crescimento a longo prazo.',                 tags: ['agressivo','tech','satellite'] },
  // ── Europa ───────────────────────────────────────────────────────────────────
  { ticker: 'MEUD',  name: 'Amundi MSCI Europe (Acc)',                       ter: 0.15, domicile: 'LU', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'Diversificação regional europeia com avaliações mais atrativas que o mercado americano.',      tags: ['conservador','moderado','europe','mixed','satellite'] },
  { ticker: 'EXW1',  name: 'iShares Core MSCI Europe (Acc)',                 ter: 0.12, domicile: 'IE', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'Cobertura ampla da Europa desenvolvida com TER ultra-competitivo de 0.12%.',                   tags: ['conservador','moderado','europe','mixed','core'] },
  // ── Emergentes ───────────────────────────────────────────────────────────────
  { ticker: 'IMEA',  name: 'iShares MSCI EM Asia (Acc)',                     ter: 0.50, domicile: 'IE', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'Exposição ao crescimento asiático emergente — China, Índia, Taiwan, Coreia.',               tags: ['moderado','agressivo','emerging','mixed','satellite'] },
  { ticker: 'IIND',  name: 'iShares MSCI India (Acc)',                       ter: 0.65, domicile: 'IE', distribution: 'Acc', replication: 'Synthetic', weight: 0, rationale: 'A aposta de crescimento na maior democracia do mundo — PIB a crescer 7%/ano.',             tags: ['agressivo','emerging','satellite'] },
  // ── Defensivos ───────────────────────────────────────────────────────────────
  { ticker: 'VAGF',  name: 'Vanguard Global Aggregate Bond (Acc)',           ter: 0.10, domicile: 'IE', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'Âncora defensiva de obrigações globais — reduz a volatilidade da carteira.',                tags: ['conservador','core'] },
  { ticker: 'SGLD',  name: 'iShares Physical Gold ETC',                     ter: 0.12, domicile: 'IE', distribution: 'Acc', replication: 'Physical', weight: 0, rationale: 'Reserva de valor em ouro físico — hedge contra inflação e crises de mercado.',             tags: ['conservador','moderado','core'] },
];


// Risk-profile descriptions
const RISK_OPTIONS: { id: RiskProfile; label: string; desc: string; icon: typeof Shield; color: string }[] = [
  { id: 'conservador', label: 'Conservador',  desc: 'Foco em preservar capital. Inclui obrigações e ETFs globais diversificados com baixa volatilidade.',                       icon: Shield,      color: 'var(--primary)' },
  { id: 'moderado',    label: 'Moderado',     desc: 'Equilíbrio entre crescimento e segurança. ETFs globais com exposição controlada a setores de maior retorno.',            icon: BarChart2,   color: 'var(--primary)' },
  { id: 'agressivo',   label: 'Agressivo',    desc: 'Maximizar retorno a longo prazo. Foco em tecnologia, markets emergentes e setores de alto crescimento.',                icon: Zap,         color: 'var(--primary)' },
];

const THEME_OPTIONS: { id: Theme; label: string; icon: typeof Globe }[] = [
  { id: 'global',    label: 'Global (diversificado)', icon: Globe },
  { id: 'tech',      label: 'Tecnologia & Inovação',  icon: Cpu },
  { id: 'europe',    label: 'Europa',                  icon: Building2 },
  { id: 'emerging',  label: 'Mercados Emergentes',     icon: Leaf },
  { id: 'mixed',     label: 'Misto (sem preferência)', icon: BarChart2 },
];

const HORIZON_OPTIONS = [
  { years: 3,  label: '1–3 anos',    desc: 'Curto prazo' },
  { years: 7,  label: '4–7 anos',    desc: 'Médio prazo' },
  { years: 15, label: '8–15 anos',   desc: 'Longo prazo' },
  { years: 25, label: '15+ anos',    desc: 'Reforma / geração' },
];

const AMOUNT_OPTIONS = [
  { value: 50,   label: '< €100/mês' },
  { value: 250,  label: '€100–€500/mês' },
  { value: 750,  label: '€500–€1000/mês' },
  { value: 1500, label: '€1000+/mês' },
];

/** Gera rationale personalizada com base nos inputs do utilizador */
function buildPersonalRationale(etf: EtfTemplate, state: WizardState): string {
  const { riskProfile, horizon, monthlyAmount, theme } = state;
  const parts: string[] = [];

  // Perfil de risco
  if (riskProfile === 'conservador') {
    if (etf.tags.includes('core')) parts.push(`Escolha ideal para um perfil conservador — este ETF oferece estabilidade e diversificação ampla sem exposição concentrada.`);
    else parts.push(`Complementa bem uma carteira conservadora ao adicionar diversificação temática com risco controlado.`);
  } else if (riskProfile === 'moderado') {
    parts.push(`Excelente equilíbrio risco/retorno para um perfil moderado.`);
  } else {
    if (etf.tags.includes('tech') || etf.tags.includes('satellite')) {
      parts.push(`Para um perfil agressivo, este ETF amplifica o potencial de crescimento com maior concentração em setores de alto retorno.`);
    } else {
      parts.push(`Forma uma base sólida para uma carteira agressiva antes de adicionar satélites de maior risco.`);
    }
  }

  // Horizonte temporal
  if (horizon >= 15) {
    parts.push(`Com ${horizon} anos de horizonte, os juros compostos maximizam o potencial de acumulação sem preocupações de curto prazo.`);
  } else if (horizon >= 7) {
    parts.push(`O horizonte de ${horizon} anos permite absorver volatilidade de mercado e recuperar de correções.`);
  } else {
    parts.push(`Para ${horizon} anos, o TER baixo de ${etf.ter}% é crucial — cada décima de ponto conta a curto prazo.`);
  }

  // Montante mensal
  if (monthlyAmount >= 750) {
    parts.push(`Com €${monthlyAmount.toLocaleString('pt-PT')}/mês, a diversificação entre múltiplos ETFs faz sentido financeiro — o custo de transação por unidade é diluído.`);
  } else if (monthlyAmount <= 50) {
    parts.push(`Para valores mais reduzidos, um ETF único como este simplifica a gestão e elimina custos de rebalanceamento.`);
  }

  // Temática
  if (theme === etf.tags.find(t => ['global','tech','europe','emerging'].includes(t))) {
    parts.push(`Alinha-se diretamente com a tua preferência temática — ${etf.domicile === 'IE' ? 'e o domicílio irlandês garante máxima eficiência fiscal em Portugal' : 'atenção ao domicílio luxemburguês que pode implicar menor eficiência fiscal'}.`);
  }

  return parts.join(' ');
}

/** Motor de recomendação por pontuação — garante sempre etfCount resultados */
function generateRecommendations(state: WizardState): Array<EtfTemplate & { suggestedWeight: number; isTopPick: boolean; personalRationale: string }> {
  const { riskProfile, theme, etfCount, horizon } = state;

  // Pontua cada ETF com base nos critérios selecionados
  const scored = ETF_LIBRARY.map(etf => {
    let score = 0;

    // Correspondência de perfil de risco (peso máximo)
    if (etf.tags.includes(riskProfile)) score += 4;

    // Correspondência de temática
    if (theme === 'mixed') {
      score += 1; // neutro — qualquer ETF serve
    } else if (etf.tags.includes(theme)) {
      score += 3; // correspondência direta
    } else if (etf.tags.includes('global') || etf.tags.includes('mixed')) {
      score += 1; // correspondência parcial
    }

    // Horizonte curto → favorece ETFs core e defensivos
    if (horizon <= 3) {
      if (etf.tags.includes('core')) score += 2;
      if (etf.tags.includes('conservador')) score += 1;
      // Penaliza satélites arriscados em horizontes curtos
      if (etf.tags.includes('satellite') && !etf.tags.includes('conservador')) score -= 2;
    }

    // Favorece TER baixo
    score += Math.max(0, 1 - etf.ter);

    // Favorece domicílio IE (mais eficiente fiscalmente)
    if (etf.domicile === 'IE') score += 0.5;

    return { ...etf, _score: score };
  });

  // Ordena por pontuação e remove duplicados
  scored.sort((a, b) => b._score - a._score);

  // Garante sempre exatamente etfCount ETFs (pega os top N independentemente)
  const picked = scored.slice(0, etfCount) as Array<EtfTemplate & { _score: number }>;

  // Calcula pesos sugeridos: ETFs core recebem mais peso, satélites menos
  const total = picked.length || 1;
  const coreItems = picked.filter(e => e.tags.includes('core'));
  const satItems  = picked.filter(e => !e.tags.includes('core'));

  let weights: Record<string, number> = {};
  if (coreItems.length > 0 && satItems.length > 0) {
    const coreShare = 70;
    const satShare  = 30;
    coreItems.forEach(e => { weights[e.ticker] = Math.round(coreShare / coreItems.length); });
    satItems.forEach(e  => { weights[e.ticker] = Math.round(satShare  / satItems.length);  });
  } else {
    picked.forEach(e => { weights[e.ticker] = Math.round(100 / total); });
  }

  // Determina top picks: os 1 ou 2 com maior score recebem isTopPick=true
  const topPickCount = etfCount >= 4 ? 2 : 1;
  const maxScore = picked[0]?._score ?? 0;

  return picked.map((e, idx) => ({ 
    ...e, 
    suggestedWeight: weights[e.ticker] ?? Math.round(100 / total),
    isTopPick: idx < topPickCount && e._score >= maxScore * 0.75,
    personalRationale: buildPersonalRationale(e, state)
  }));
}


export default function PortfolioModal({ isOpen, onClose, onSave, onDelete, existingPortfolio, userProfileBroker, onImportFromPrint }: PortfolioModalProps) {
  // Simple edit mode (no wizard) for existing portfolios
  const [name, setName] = useState('');
  const [broker, setBroker] = useState<string>('Outro');

  // Wizard state
  const [step, setStep] = useState(1); // 1=básico 2=perfil 3=configuração 4=sugestões
  const [wizard, setWizard] = useState<WizardState>({
    name: '',
    broker: userProfileBroker || 'Outro',
    riskProfile: 'moderado',
    horizon: 15,
    monthlyAmount: 250,
    initialAmount: 0,
    etfCount: 3,
    theme: 'global',
  });
  const [selectedEtfs, setSelectedEtfs] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<Array<EtfTemplate & { suggestedWeight: number; isTopPick: boolean; personalRationale: string }>>([]);

  useEffect(() => {
    if (isOpen) {
      if (existingPortfolio) {
        setName(existingPortfolio.name);
        setBroker(existingPortfolio.broker || userProfileBroker || 'Outro');
      } else {
        setStep(1);
        setWizard(w => ({ ...w, name: '', broker: userProfileBroker || 'Outro' }));
        setSelectedEtfs(new Set());
        setRecommendations([]);
      }
    }
  }, [isOpen, existingPortfolio, userProfileBroker]);

  if (!isOpen) return null;

  // ─── Edit mode (existing portfolio) ───────────────────────────────────────
  if (existingPortfolio) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              <FolderKanban size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--primary)' }} />
              Editar Carteira
            </h3>
            <button className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }} onClick={onClose}><X size={18} /></button>
          </div>
          <form
            onSubmit={e => { e.preventDefault(); onSave({ name, broker: broker as any }); }}
            className="modal-body"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div className="form-group">
              <label>Nome da Carteira</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Conta Pessoal, Reforma..." required />
            </div>
            <div className="form-group">
              <label>Corretora Vinculada</label>
              <select value={broker} onChange={e => setBroker(e.target.value)}>
                <option value="XTB">XTB</option>
                <option value="DEGIRO">DEGIRO</option>
                <option value="Trading212">Trading212</option>
                <option value="Interactive Brokers">Interactive Brokers</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                {onDelete && (
                  <button 
                    type="button" 
                    className="btn" 
                    style={{ background: 'var(--danger)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }} 
                    onClick={() => {
                      if (window.confirm(`Tem a certeza que deseja eliminar a carteira "${existingPortfolio.name}"?`)) {
                        onDelete(existingPortfolio.id);
                      }
                    }}
                  >
                    Eliminar Carteira
                  </button>
                )}
                <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                  <button type="submit" className="btn btn-primary"><Save size={16} /> Guardar Alterações</button>
                </div>
              </div>
              
              {onImportFromPrint && (
                <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Recarregar Carteira</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.55rem' }}
                    onClick={() => onImportFromPrint(existingPortfolio.id)}
                  >
                    📷 Importar de Print Screen
                  </button>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Atualiza ou adiciona ativos automaticamente lendo uma captura de ecrã da corretora.
                  </span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ─── Wizard (new portfolio) ────────────────────────────────────────────────
  const totalSteps = 4;

  const goNext = () => {
    if (step === 3) {
      const recs = generateRecommendations(wizard);
      setRecommendations(recs);
      setSelectedEtfs(new Set(recs.map(e => e.ticker)));
    }
    setStep(s => Math.min(s + 1, totalSteps));
  };
  const goBack = () => setStep(s => Math.max(s - 1, 1));

  const canAdvance = () => {
    if (step === 1) return wizard.name.trim().length > 0;
    if (step === 3) return wizard.initialAmount > 0;
    return true;
  };

  const handleFinish = () => {
    const chosen = recommendations.filter(r => selectedEtfs.has(r.ticker));
    const totalWeight = chosen.reduce((s, r) => s + r.suggestedWeight, 0) || 1;

    const chosenEtfs: ETF[] = chosen.map((r, i) => {
      // Distribui o capital inicial proporcionalmente ao peso
      const allocated = wizard.initialAmount > 0
        ? Math.round((r.suggestedWeight / totalWeight) * wizard.initialAmount * 100) / 100
        : 0;
      return {
        id: `init-${r.ticker}-${i}`,
        ticker: r.ticker,
        name: r.name,
        ter: r.ter,
        domicile: r.domicile,
        distribution: r.distribution,
        replication: r.replication,
        weight: r.suggestedWeight,
        amountInvested: allocated,
        currentValue: allocated,
      };
    });

    onSave({
      name: wizard.name,
      broker: wizard.broker as any,
      starterEtfs: chosenEtfs,
    });
  };

  const toggleEtf = (ticker: string) => {
    setSelectedEtfs(prev => {
      const next = new Set(prev);
      next.has(ticker) ? next.delete(ticker) : next.add(ticker);
      return next;
    });
  };

  // ─── Step indicators ───────────────────────────────────────────────────────
  const stepLabels = ['Identificação', 'Perfil de Risco', 'Configuração', 'Sugestões'];

  const inputStyle: React.CSSProperties = {
    padding: '0.7rem 1rem',
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    outline: 'none',
    width: '100%',
    fontSize: '0.9rem',
  };

  const cardBase: React.CSSProperties = {
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    background: 'rgba(255,255,255,0.02)',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  };

  const cardActive: React.CSSProperties = {
    border: '1.5px solid var(--primary)',
    background: 'rgba(34,197,94,0.07)',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '540px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FolderKanban size={20} style={{ color: 'var(--primary)' }} />
            Nova Carteira
          </h3>
          <button className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }} onClick={onClose}><X size={18} /></button>
        </div>

        {/* Step progress bar */}
        <div style={{ padding: '0 1.5rem', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.4rem' }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1, height: '3px', borderRadius: '99px',
                  background: i < step ? 'var(--primary)' : 'var(--border-color)',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Passo {step} de {totalSteps} — <strong style={{ color: 'var(--text-secondary)' }}>{stepLabels[step - 1]}</strong>
          </p>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* ── STEP 1: Identificação ─────────────────────────────── */}
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Nome da Carteira</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={wizard.name}
                  onChange={e => setWizard(w => ({ ...w, name: e.target.value }))}
                  placeholder="Ex: Conta Pessoal, Reforma, Filhos..."
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label>Corretora Vinculada</label>
                <select
                  style={inputStyle}
                  value={wizard.broker}
                  onChange={e => setWizard(w => ({ ...w, broker: e.target.value }))}
                >
                  <option value="XTB">XTB</option>
                  <option value="DEGIRO">DEGIRO</option>
                  <option value="Trading212">Trading212</option>
                  <option value="Interactive Brokers">Interactive Brokers</option>
                  <option value="Outro">Outro</option>
                </select>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  A consultoria fiscal será ajustada à corretora selecionada.
                </p>
              </div>

              {onImportFromPrint && (
                <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '0.6rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Importar ETFs por imagem</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.55rem' }}
                    onClick={() => onImportFromPrint()}
                  >
                    📷 Importar de Print Screen da Corretora
                  </button>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Podes carregar uma captura de ecrã da tua lista de posições para extrair os ETFs automaticamente.
                  </span>
                </div>
              )}
            </>
          )}

          {/* ── STEP 2: Perfil de Risco ───────────────────────────── */}
          {step === 2 && (
            <>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                O perfil de risco define a agressividade da carteira. Sê honesto — escolhe o que te deixa dormir bem à noite mesmo quando o mercado cai 20%.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {RISK_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  const active = wizard.riskProfile === opt.id;
                  return (
                    <div
                      key={opt.id}
                      style={{ ...cardBase, ...(active ? cardActive : {}) }}
                      onClick={() => setWizard(w => ({ ...w, riskProfile: opt.id }))}
                    >
                      <div style={{ background: `${opt.color}22`, padding: '0.5rem', borderRadius: '8px', flexShrink: 0 }}>
                        <Icon size={20} style={{ color: opt.color }} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: active ? opt.color : 'var(--text-primary)' }}>{opt.label}</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: '1.4' }}>{opt.desc}</p>
                      </div>
                      {active && <Check size={16} style={{ marginLeft: 'auto', color: 'var(--primary)', flexShrink: 0 }} />}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── STEP 3: Configuração ─────────────────────────────── */}
          {step === 3 && (
            <>
              {/* Horizonte temporal */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Clock size={14} /> Horizonte Temporal
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {HORIZON_OPTIONS.map(h => {
                    const active = wizard.horizon === h.years;
                    return (
                      <div
                        key={h.years}
                        style={{ ...cardBase, flexDirection: 'column', alignItems: 'flex-start', padding: '0.7rem 0.85rem', ...(active ? cardActive : {}) }}
                        onClick={() => setWizard(w => ({ ...w, horizon: h.years }))}
                      >
                        <strong style={{ fontSize: '0.85rem', color: active ? 'var(--primary)' : 'var(--text-primary)' }}>{h.label}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{h.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Montante mensal */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Wallet size={14} /> Investimento Mensal Estimado
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {AMOUNT_OPTIONS.map(a => {
                    const active = wizard.monthlyAmount === a.value;
                    return (
                      <div
                        key={a.value}
                        style={{ ...cardBase, justifyContent: 'center', textAlign: 'center', padding: '0.65rem', ...(active ? cardActive : {}) }}
                        onClick={() => setWizard(w => ({ ...w, monthlyAmount: a.value }))}
                      >
                        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: active ? 'var(--primary)' : 'var(--text-primary)' }}>{a.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Temática preferencial */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <TrendingUp size={14} /> Temática Preferencial
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {THEME_OPTIONS.map(t => {
                    const Icon = t.icon;
                    const active = wizard.theme === t.id;
                    return (
                      <div
                        key={t.id}
                        style={{ ...cardBase, flex: '0 0 auto', padding: '0.45rem 0.8rem', alignItems: 'center', gap: '0.4rem', ...(active ? cardActive : {}) }}
                        onClick={() => setWizard(w => ({ ...w, theme: t.id }))}
                      >
                        <Icon size={13} style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.78rem', color: active ? 'var(--primary)' : 'var(--text-primary)', fontWeight: active ? '700' : '400' }}>{t.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Capital Inicial */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Wallet size={14} /> Capital Inicial
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  {[0, 500, 1000, 2500, 5000, 10000].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setWizard(w => ({ ...w, initialAmount: v }))}
                      style={{
                        padding: '0.35rem 0.7rem', fontSize: '0.75rem', borderRadius: '20px', cursor: 'pointer',
                        border: wizard.initialAmount === v ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                        background: wizard.initialAmount === v ? 'rgba(34,197,94,0.1)' : 'rgba(0,0,0,0.2)',
                        color: wizard.initialAmount === v ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: wizard.initialAmount === v ? '700' : '400',
                        transition: 'all 0.15s',
                      }}
                    >
                      {v === 0 ? 'Sem capital inicial' : `€${v.toLocaleString('pt-PT')}`}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0 }}>€</span>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={wizard.initialAmount || ''}
                    placeholder="Outro valor..."
                    onChange={e => setWizard(w => ({ ...w, initialAmount: Math.max(0, Number(e.target.value) || 0) }))}
                    style={{ flex: 1, padding: '0.55rem 0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
                {wizard.initialAmount > 0 && (
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    💡 O capital será distribuído proporcionalmente pelos ETFs selecionados.
                  </p>
                )}
              </div>

              {/* Número de ETFs */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <BarChart2 size={14} /> Número de ETFs na carteira: <strong style={{ color: 'var(--primary)', marginLeft: '0.25rem' }}>{wizard.etfCount}</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={8}
                  value={wizard.etfCount}
                  onChange={e => setWizard(w => ({ ...w, etfCount: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  <span>1 — Simples</span><span>4 — Equilibrado</span><span>8 — Diversificado</span>
                </div>
                {wizard.etfCount === 1 && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--primary)', marginTop: '0.35rem' }}>
                    💡 Um único ETF é uma excelente estratégia — menos decisões, menos erros.
                  </p>
                )}
              </div>
            </>
          )}

          {/* ── STEP 4: Sugestões ────────────────────────────────── */}
          {step === 4 && (
            <>
              <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Com base no teu perfil <strong style={{ color: 'var(--primary)' }}>{wizard.riskProfile}</strong>, horizonte de <strong style={{ color: 'var(--primary)' }}>{wizard.horizon} anos</strong> e temática <strong style={{ color: 'var(--primary)' }}>{THEME_OPTIONS.find(t => t.id === wizard.theme)?.label}</strong>, o consultor identificou as melhores opções. Seleciona os que queres adicionar.
              </div>

              {/* Top Picks — destaque especial */}
              {recommendations.some(r => r.isTopPick) && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>⭐ Escolha do Consultor</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(56, 189, 248, 0.25)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {recommendations.filter(r => r.isTopPick).map(r => {
                      const selected = selectedEtfs.has(r.ticker);
                      return (
                        <div
                          key={r.ticker}
                          onClick={() => toggleEtf(r.ticker)}
                          style={{
                            ...cardBase,
                            border: selected ? '2px solid var(--primary)' : '1.5px solid rgba(56, 189, 248, 0.4)',
                            background: selected ? 'rgba(56, 189, 248, 0.08)' : 'rgba(56, 189, 248, 0.03)',
                            cursor: 'pointer',
                            position: 'relative',
                          }}
                        >
                          <div style={{
                            width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                            border: selected ? '2px solid var(--primary)' : '2px solid rgba(56, 189, 248, 0.4)',
                            background: selected ? 'var(--primary)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                          }}>
                            {selected && <Check size={11} style={{ color: 'var(--bg-primary)' }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <strong style={{ fontSize: '0.95rem', color: 'var(--primary)' }}>{r.ticker}</strong>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.name}</span>
                              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: '700', color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.12)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                Peso sugerido: {r.suggestedWeight}%
                              </span>
                            </div>
                            {/* Rationale personalizada */}
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: '1.5', fontStyle: 'italic' }}>
                              {r.personalRationale}
                            </p>
                            {/* Rationale genérica */}
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: '1.4' }}>{r.rationale}</p>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.3rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              <span>TER: <strong style={{ color: 'var(--text-secondary)' }}>{r.ter}%</strong></span>
                              <span>Dom: <strong style={{ color: r.domicile === 'IE' ? 'var(--primary)' : 'var(--warning)' }}>{r.domicile}</strong></span>
                              <span>{r.distribution === 'Acc' ? '📈 Acumulação' : '💰 Distribuição'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ETFs complementares */}
              {recommendations.some(r => !r.isTopPick) && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Complementares</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {recommendations.filter(r => !r.isTopPick).map(r => {
                      const selected = selectedEtfs.has(r.ticker);
                      return (
                        <div
                          key={r.ticker}
                          onClick={() => toggleEtf(r.ticker)}
                          style={{
                            ...cardBase,
                            border: selected ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                            background: selected ? 'rgba(56, 189, 248, 0.06)' : 'rgba(255,255,255,0.01)',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{
                            width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, marginTop: '2px',
                            border: selected ? '2px solid var(--primary)' : '2px solid var(--border-color)',
                            background: selected ? 'var(--primary)' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                          }}>
                            {selected && <Check size={10} style={{ color: 'var(--bg-primary)' }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <strong style={{ fontSize: '0.85rem', color: selected ? 'var(--primary)' : 'var(--text-primary)' }}>{r.ticker}</strong>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{r.name}</span>
                              <span style={{ marginLeft: 'auto', fontSize: '0.67rem', fontWeight: '700', color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.08)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                                {r.suggestedWeight}%
                              </span>
                            </div>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: '1.4' }}>{r.rationale}</p>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem', fontSize: '0.67rem', color: 'var(--text-muted)' }}>
                              <span>TER: <strong>{r.ter}%</strong></span>
                              <span>Dom: <strong style={{ color: r.domicile === 'IE' ? 'var(--primary)' : 'var(--warning)' }}>{r.domicile}</strong></span>
                              <span>{r.distribution === 'Acc' ? '📈 Acc' : '💰 Dist'}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedEtfs.size === 0 && (
                <p style={{ fontSize: '0.78rem', color: 'var(--warning)', textAlign: 'center' }}>
                  ⚠️ Nenhum ETF selecionado — a carteira será criada vazia.
                </p>
              )}
            </>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {step > 1 ? (
                <button type="button" className="btn btn-secondary" onClick={goBack} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChevronLeft size={16} /> Anterior
                </button>
              ) : (
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              )}

              {!existingPortfolio && onImportFromPrint && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => onImportFromPrint()}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderColor: 'var(--primary)' }}
                  title="Importar a partir de um print screen da corretora"
                >
                  📷 Carregar Print
                </button>
              )}
            </div>

            {step < totalSteps ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={goNext}
                disabled={!canAdvance()}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                Seguinte <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleFinish}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Save size={16} /> Criar Carteira
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
