import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ETF, MarketEtf } from '../types';
import { 
  X, 
  Upload, 
  CheckCircle, 
  Trash2, 
  Plus, 
  Sparkles, 
  Camera, 
  ListPlus, 
  Building2, 
  FileText
} from 'lucide-react';

interface BrokerImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (etfs: ETF[], cashBalance: number, name?: string, broker?: string) => void;
  isNewPortfolio?: boolean;
  availableMarketEtfs?: MarketEtf[];
}

interface ScannerLog {
  time: string;
  text: string;
  type: 'info' | 'success' | 'warning';
}

export const POPULAR_BROKERS = [
  { id: 'XTB', name: 'XTB', country: 'Europa / Portugal', zeroCommission: true },
  { id: 'DEGIRO', name: 'DEGIRO', country: 'Holanda / Europa', zeroCommission: false },
  { id: 'Trading212', name: 'Trading 212', country: 'Reino Unido / UE', zeroCommission: true },
  { id: 'Interactive Brokers', name: 'Interactive Brokers (IBKR)', country: 'Global', zeroCommission: false },
  { id: 'Trade Republic', name: 'Trade Republic', country: 'Alemanha', zeroCommission: true },
  { id: 'Revolut', name: 'Revolut Invest', country: 'Global / UE', zeroCommission: false },
  { id: 'Banco Invest / BiG / Best', name: 'Bancos Portugueses (Invest, BiG, Best)', country: 'Portugal', zeroCommission: false },
  { id: 'Outra Corretora', name: 'Outra Corretora', country: 'Global', zeroCommission: false }
];

export default function BrokerImportModal({ 
  isOpen, 
  onClose, 
  onImport, 
  isNewPortfolio: _isNewPortfolio = false,
  availableMarketEtfs = []
}: BrokerImportModalProps) {
  const [selectedBroker, setSelectedBroker] = useState<string>('XTB');
  const [importMethod, setImportMethod] = useState<'screenshot' | 'quick_add'>('screenshot');
  const [portfolioName, setPortfolioName] = useState<string>('A Minha Carteira');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [logs, setLogs] = useState<ScannerLog[]>([]);
  const [scanStep, setScanStep] = useState(0); // 0: Config/Upload, 1: Processamento IA, 2: Revisão Tabela
  const [scanResults, setScanResults] = useState<ETF[]>([]);
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('gemini_api_key') || '';
    } catch {
      return '';
    }
  });

  // Limpa o estado quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setImagePreview(null);
      setLogs([]);
      setScanStep(0);
      setScanResults([]);
      setCashBalance(0);
      setPortfolioName(`Carteira ${selectedBroker}`);
    }
  }, [isOpen, selectedBroker]);

  if (!isOpen) return null;

  // Lida com o arrastar do ficheiro sobre a área
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Carrega e valida o ficheiro de imagem
  const processFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, carrega um ficheiro de imagem válido (PNG, JPG, WEBP).');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Executa a leitura inteligente via Visão Artificial
  const startScanning = async () => {
    if (!selectedFile || !imagePreview) return;

    if (!geminiApiKey.trim()) {
      alert('Para usar a leitura automática por imagem, introduz a tua chave da API do Google Gemini. Se não tiveres chave, podes usar a opção "Adição Rápida Assistida" sem qualquer chave.');
      return;
    }

    setLogs([]);
    setScanStep(1);

    const timeStr = () => new Date().toLocaleTimeString('pt-PT', { hour12: false });
    const addLog = (text: string, type: 'info' | 'success' | 'warning' = 'info') => {
      setLogs(prev => [...prev, { time: timeStr(), text, type }]);
    };

    addLog(`[Vision AI Engine] Ficheiro inicializado: ${selectedFile.name}`);
    addLog(`[Vision AI Engine] Corretora identificada: ${selectedBroker}`);
    addLog("[Vision AI Engine] A contactar o modelo Google Gemini 1.5 Flash...");

    try {
      const base64Data = imagePreview.split(',')[1];
      const mimeType = imagePreview.split(';')[0].split(':')[1];

      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Analisa esta captura de ecrã da corretora financeira "${selectedBroker}" (ou similar: XTB, DEGIRO, Trading 212, Interactive Brokers, Trade Republic, Revolut, bancos).
Extrai todos os ETFs e posições financeiras detetadas no ecrã.
Devolve EXCLUSIVAMENTE um objeto JSON válido com a seguinte estrutura:
{
  "etfs": [
    {
      "name": "Nome oficial do ETF (ex: Vanguard FTSE All-World ou iShares Core S&P 500)",
      "ticker": "Código em Bolsa (ex: VWCE, SXR8, IWDA, QDVE, etc.)",
      "amountInvested": 1234.56,
      "currentValue": 1500.20
    }
  ],
  "cashBalance": 0
}
ATENÇÃO: Extrai apenas números nas propriedades de valor, sem símbolos de moeda (€ ou $). A resposta deve ser APENAS o JSON puro, sem blocos de markdown.`;

      addLog(`[Vision AI Progress] Imagem enviada. A interpretar tabela de posições da ${selectedBroker}...`);

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ]);

      const responseText = result.response.text();
      const cleanText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      addLog("✨ Leitura concluída! A processar dados devolvidos...", 'success');
      
      const parsed = JSON.parse(cleanText);
      const foundEtfs: ETF[] = (parsed.etfs || []).map((etf: any) => ({
        id: `ai-${Math.random().toString(36).substring(2, 7)}`,
        ticker: etf.ticker || 'ETF',
        name: etf.name || 'Ativo Lido por IA',
        ter: 0.20,
        domicile: 'IE',
        distribution: 'Acc',
        replication: 'Physical',
        weight: 0,
        amountInvested: Number(etf.amountInvested || 0),
        currentValue: Number(etf.currentValue || 0),
        lastPrice: 0
      }));

      foundEtfs.forEach((e: ETF) => {
        addLog(`✔️ Ativo detetado: ${e.name} (${e.ticker}). Investido: ${e.amountInvested.toFixed(2)} € | Atual: ${e.currentValue.toFixed(2)} €`, 'success');
      });

      if (foundEtfs.length === 0) {
        addLog("⚠️ A IA não encontrou nenhum ETF com clareza na imagem. A preencher com linha vazia para edição.", 'warning');
        handleAddRow();
      }

      setScanStep(2);
      setCashBalance(Number(parsed.cashBalance || 0));
      setScanResults(foundEtfs);

    } catch (err) {
      console.error(err);
      addLog(`❌ Erro na leitura automática: verifica a tua chave de API ou experimenta o modo de adição assistida.`, 'warning');
      setScanStep(2);
    }
  };

  // Carrega exemplo padrão de teste rápido (sem necessidade de upload nem chave)
  const handleLoadDemoExample = () => {
    const exampleEtfs: ETF[] = [
      {
        id: 'demo-1',
        ticker: 'VWCE',
        name: 'Vanguard FTSE All-World UCITS ETF (Acc)',
        ter: 0.22,
        domicile: 'IE',
        distribution: 'Acc',
        replication: 'Physical',
        weight: 70,
        amountInvested: 3500,
        currentValue: 3680,
        lastPrice: 172.74
      },
      {
        id: 'demo-2',
        ticker: 'SXR8',
        name: 'iShares Core S&P 500 UCITS ETF (Acc)',
        ter: 0.07,
        domicile: 'IE',
        distribution: 'Acc',
        replication: 'Physical',
        weight: 30,
        amountInvested: 1500,
        currentValue: 1560,
        lastPrice: 752.28
      }
    ];

    setScanResults(exampleEtfs);
    setCashBalance(250);
    setScanStep(2);
  };

  // Manipulação da tabela de revisão
  const handleUpdateResult = (id: string, field: keyof ETF, value: any) => {
    setScanResults(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleAddRow = () => {
    const newId = `manual-${Math.random().toString(36).substring(2, 7)}`;
    const defaultEtf = availableMarketEtfs[0] || { ticker: 'VWCE', name: 'Vanguard FTSE All-World UCITS ETF', currentPrice: 172.74 };

    setScanResults(prev => [
      ...prev,
      {
        id: newId,
        ticker: defaultEtf.ticker,
        name: defaultEtf.name,
        ter: 0.20,
        domicile: 'IE',
        distribution: 'Acc',
        replication: 'Physical',
        weight: 0,
        amountInvested: 1000,
        currentValue: 1000,
        lastPrice: defaultEtf.currentPrice || 100
      }
    ]);
  };

  const handleRemoveRow = (id: string) => {
    setScanResults(prev => prev.filter(item => item.id !== id));
  };

  const handleConfirmImport = () => {
    if (scanResults.length === 0) {
      alert('A tua lista de importação está vazia. Adiciona pelo menos uma posição.');
      return;
    }

    // Normaliza as ponderações antes de guardar
    const totalAmount = scanResults.reduce((sum, item) => sum + item.amountInvested, 0);
    const finalized = scanResults.map(item => ({
      ...item,
      weight: totalAmount > 0 ? Number(((item.amountInvested / totalAmount) * 100).toFixed(1)) : 0
    }));

    onImport(finalized, cashBalance, portfolioName, selectedBroker);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        
        {/* CABEÇALHO DO MODAL */}
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                Importar Portefólio da Corretora
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Suporta XTB, DEGIRO, Trading 212, Interactive Brokers, Trade Republic, Revolut ou bancos.
              </p>
            </div>
          </div>

          <button className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* CORPO DO MODAL */}
        <div className="modal-body" style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          
          {/* PASSO 0: ESCOLHA DA CORRETORA E MÉTODO */}
          {scanStep === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* 1. SELETOR DE CORRETORA */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  1. Onde tens a tua conta de corretagem?
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.6rem' }}>
                  {POPULAR_BROKERS.map(broker => {
                    const isSelected = selectedBroker === broker.id;
                    return (
                      <button
                        key={broker.id}
                        type="button"
                        onClick={() => {
                          setSelectedBroker(broker.id);
                          setPortfolioName(`Carteira ${broker.id}`);
                        }}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: isSelected ? '1px solid #10b981' : '1px solid var(--border-color)',
                          background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                          color: isSelected ? '#10b981' : 'var(--text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{broker.name}</div>
                        <div style={{ fontSize: '0.7rem', color: isSelected ? '#10b981' : 'var(--text-muted)' }}>
                          {broker.country}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. ALTERNADOR DE MÉTODO: CAPTURA DE ECRÃ vs ADIÇÃO ASSISTIDA */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  2. Como preferes importar os teus ativos?
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setImportMethod('screenshot')}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: importMethod === 'screenshot' ? '1px solid #10b981' : '1px solid var(--border-color)',
                      background: importMethod === 'screenshot' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      color: importMethod === 'screenshot' ? '#10b981' : 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      textAlign: 'left'
                    }}
                  >
                    <Camera size={20} style={{ color: importMethod === 'screenshot' ? '#10b981' : 'var(--text-muted)', marginTop: '0.1rem' }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Captura de Ecrã (Screenshot)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Tira print do ecrã de posições na app da {selectedBroker} e a IA lê automaticamente.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImportMethod('quick_add');
                      handleAddRow();
                      setScanStep(2);
                    }}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: importMethod === 'quick_add' ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                      background: importMethod === 'quick_add' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      color: importMethod === 'quick_add' ? '#38bdf8' : 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      textAlign: 'left'
                    }}
                  >
                    <ListPlus size={20} style={{ color: importMethod === 'quick_add' ? '#38bdf8' : 'var(--text-muted)', marginTop: '0.1rem' }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Adição Rápida Assistida</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Sem chave de API. Escolhe o ETF e escreve apenas quanto tens investido em 10 segundos.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. ZONA DE UPLOAD DA CAPTURA DE ECRÃ */}
              {importMethod === 'screenshot' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* CHAVE DE API DO GEMINI */}
                  <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      <Sparkles size={14} style={{ color: '#10b981' }} /> Chave de API Google Gemini (para Visão Artificial):
                    </label>
                    <input
                      type="password"
                      value={geminiApiKey}
                      onChange={e => {
                        setGeminiApiKey(e.target.value);
                        localStorage.setItem('gemini_api_key', e.target.value);
                      }}
                      placeholder="Cola a tua chave do Gemini (começa por AIza...)"
                      style={{ 
                        width: '100%', 
                        padding: '0.45rem 0.65rem', 
                        borderRadius: '6px', 
                        background: 'rgba(0, 0, 0, 0.4)', 
                        border: '1px solid var(--border-color)', 
                        color: 'var(--text-primary)',
                        fontSize: '0.82rem'
                      }}
                    />
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      Não tens chave? Podes clicar em <strong>"Adição Rápida Assistida"</strong> acima ou no botão <strong>"Carregar Exemplo de Teste"</strong> abaixo.
                    </div>
                  </div>

                  {/* ZONA DE ARRASTO */}
                  <div 
                    className={`drag-area ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    style={{
                      border: dragActive ? '2px dashed #10b981' : '2px dashed var(--border-color)',
                      borderRadius: '12px',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                      background: dragActive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0, 0, 0, 0.25)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => document.getElementById('broker-file-upload')?.click()}
                  >
                    <input 
                      id="broker-file-upload" 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleFileInput} 
                    />

                    {imagePreview ? (
                      <div>
                        <img 
                          src={imagePreview} 
                          alt="Pré-visualização" 
                          style={{ maxHeight: '160px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '0.75rem' }} 
                        />
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>
                          ✓ Ficheiro selecionado: {selectedFile?.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Clica para escolher outra imagem</div>
                      </div>
                    ) : (
                      <div>
                        <Upload size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem', opacity: 0.6 }} />
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                          Arrasta para aqui a captura de ecrã da {selectedBroker}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Ou clica para selecionar o ficheiro de imagem (PNG, JPG, WEBP)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={handleLoadDemoExample}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.8rem', padding: '0.55rem 0.9rem', gap: '0.4rem' }}
                    >
                      <FileText size={14} />
                      <span>Carregar Exemplo Real ({selectedBroker})</span>
                    </button>

                    <button
                      type="button"
                      disabled={!selectedFile}
                      onClick={startScanning}
                      className="btn btn-primary"
                      style={{ 
                        fontSize: '0.85rem', 
                        padding: '0.65rem 1.4rem', 
                        background: selectedFile ? '#10b981' : 'var(--text-muted)',
                        color: '#000',
                        gap: '0.45rem',
                        cursor: selectedFile ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <Sparkles size={16} />
                      <span>Iniciar Leitura Inteligente</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* PASSO 1: ANIMAÇÃO DE PROCESSAMENTO */}
          {scanStep === 1 && (
            <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', animation: 'spin 1s linear infinite', margin: '0 auto 1.25rem' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>A Ler o Teu Portefólio da {selectedBroker}...</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                A Inteligência Artificial está a extrair os teus ETFs, unidades e valores investidos.
              </p>

              {/* LOGS DE ATIVIDADE */}
              <div style={{ 
                maxWidth: '520px', 
                margin: '0 auto', 
                background: 'rgba(0, 0, 0, 0.5)', 
                borderRadius: '8px', 
                padding: '0.85rem', 
                textAlign: 'left',
                border: '1px solid var(--border-color)',
                fontSize: '0.75rem',
                fontFamily: 'monospace'
              }}>
                {logs.map((log, idx) => (
                  <div key={idx} style={{ color: log.type === 'success' ? '#10b981' : (log.type === 'warning' ? '#f59e0b' : 'var(--text-secondary)'), marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span> {log.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 2: REVISÃO E CONFIRMAÇÃO DA TABELA */}
          {scanStep === 2 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                    Revê os Ativos da Tua Carteira ({selectedBroker})
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Podes ajustar os valores ou adicionar mais ETFs antes de confirmar.
                  </p>
                </div>

                <button 
                  type="button"
                  onClick={handleAddRow}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '0.45rem 0.8rem', gap: '0.35rem' }}
                >
                  <Plus size={14} /> Adicionar ETF
                </button>
              </div>

              {/* TABELA DE EDIÇÃO */}
              <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.6rem 0.4rem' }}>Ticker</th>
                      <th style={{ padding: '0.6rem 0.4rem' }}>Nome do ETF</th>
                      <th style={{ padding: '0.6rem 0.4rem' }}>Total Investido (€)</th>
                      <th style={{ padding: '0.6rem 0.4rem' }}>Valor Atual (€)</th>
                      <th style={{ padding: '0.6rem 0.4rem', textAlign: 'center' }}>Tipo</th>
                      <th style={{ padding: '0.6rem 0.4rem', textAlign: 'right' }}>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanResults.map(item => (
                      <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '0.5rem 0.4rem', width: '110px' }}>
                          <input 
                            type="text" 
                            value={item.ticker}
                            onChange={e => handleUpdateResult(item.id, 'ticker', e.target.value.toUpperCase())}
                            style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#10b981', fontWeight: 800, fontSize: '0.8rem' }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem 0.4rem' }}>
                          <input 
                            type="text" 
                            value={item.name}
                            onChange={e => handleUpdateResult(item.id, 'name', e.target.value)}
                            style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem 0.4rem', width: '130px' }}>
                          <input 
                            type="number" 
                            value={item.amountInvested}
                            onChange={e => handleUpdateResult(item.id, 'amountInvested', Number(e.target.value))}
                            style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem 0.4rem', width: '130px' }}>
                          <input 
                            type="number" 
                            value={item.currentValue}
                            onChange={e => handleUpdateResult(item.id, 'currentValue', Number(e.target.value))}
                            style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#38bdf8', fontWeight: 700, fontSize: '0.8rem' }}
                          />
                        </td>
                        <td style={{ padding: '0.5rem 0.4rem', textAlign: 'center', width: '90px' }}>
                          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
                            Acc • IE
                          </span>
                        </td>
                        <td style={{ padding: '0.5rem 0.4rem', textAlign: 'right', width: '40px' }}>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveRow(item.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                            title="Remover linha"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SALDO DE LIQUIDEZ E NOME */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1rem', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Nome da Carteira:
                  </label>
                  <input 
                    type="text" 
                    value={portfolioName}
                    onChange={e => setPortfolioName(e.target.value)}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Liquidez por Investir (€):
                  </label>
                  <input 
                    type="number" 
                    value={cashBalance}
                    onChange={e => setCashBalance(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* BOTÕES DE CONFIRMAÇÃO */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  onClick={() => setScanStep(0)} 
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '0.6rem 1rem' }}
                >
                  Voltar
                </button>

                <button 
                  type="button" 
                  onClick={handleConfirmImport} 
                  className="btn btn-primary"
                  style={{ fontSize: '0.85rem', padding: '0.6rem 1.4rem', background: '#10b981', color: '#000', gap: '0.4rem' }}
                >
                  <CheckCircle size={16} />
                  <span>Gravar e Ativar Orientação da Carteira</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
