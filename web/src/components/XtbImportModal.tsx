import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ETF } from '../types';
import { X, Upload, CheckCircle, RefreshCw, Trash2, Plus, Info, Sparkles } from 'lucide-react';

interface XtbImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (etfs: ETF[], cashBalance: number, name?: string, broker?: string) => void;
  isNewPortfolio?: boolean;
}

interface ScannerLog {
  time: string;
  text: string;
  type: 'info' | 'success' | 'warning';
}



export default function XtbImportModal({ isOpen, onClose, onImport, isNewPortfolio = false }: XtbImportModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [logs, setLogs] = useState<ScannerLog[]>([]);
  const [scanStep, setScanStep] = useState(0); // 0: Import input, 1: Scan animation, 2: Review/Edit spreadsheet
  const [scanResults, setScanResults] = useState<ETF[]>([]);
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [portfolioName, setPortfolioName] = useState('Carteira Importada');
  const [portfolioBroker, setPortfolioBroker] = useState('XTB');
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  // Limpa o estado quando o modal Ã© aberto
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setImagePreview(null);
      setLogs([]);
      setScanStep(0);
      setScanResults([]);
      setCashBalance(0);
      setPortfolioName('Carteira Importada');
      setPortfolioBroker('XTB');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Lida com o arrastar do ficheiro sobre a Ã¡rea
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
      alert('Por favor, carrega um ficheiro de imagem vÃ¡lido (PNG, JPG, WEBP).');
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

  // Executa a leitura Vision AI
  const startScanning = async () => {
    if (!selectedFile || !imagePreview) return;

    if (isNewPortfolio && !portfolioName.trim()) {
      alert('Por favor, indica um nome para a tua nova carteira antes de iniciar a digitalização.');
      return;
    }

    if (!geminiApiKey.trim()) {
      alert('Por favor, introduza a chave da API do Gemini para prosseguir com a Visão Artificial.');
      return;
    }

    setLogs([]);
    setScanStep(1);

    const timeStr = () => new Date().toLocaleTimeString('pt-PT', { hour12: false });
    
    const addLog = (text: string, type: 'info' | 'success' | 'warning' = 'info') => {
      setLogs(prev => [...prev, { time: timeStr(), text, type }]);
    };

    addLog(`[Vision AI Engine] Ficheiro inicializado: ${selectedFile.name}`);
    addLog("[Vision AI Engine] A contactar o modelo Google Gemini 1.5 Flash...");

    try {
      const base64Data = imagePreview.split(',')[1];
      const mimeType = imagePreview.split(';')[0].split(':')[1];

      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Analisa este print screen de uma corretora financeira (como a XTB, Degiro, etc.). Extrai todos os ETFs detetados.
Devolve EXCLUSIVAMENTE um objeto JSON válido com a seguinte estrutura:
{
  "etfs": [
    {
      "name": "Nome do ETF (ex: iShares Core S&P 500)",
      "ticker": "Código em Bolsa (ex: SXR8.DE, VWCE.DE). Se não souberes, deduz a partir do nome ou usa 'ETF'.",
      "amountInvested": 1234.56,
      "currentValue": 1500.20
    }
  ],
  "cashBalance": 0
}
ATENÇÃO: Extrai apenas números nas propriedades de valor, sem símbolos de moeda. A resposta deve ser APENAS o JSON puro, sem blocos de markdown.`;

      addLog(`[Vision AI Progress] Imagem enviada. A interpretar estrutura visual do portefólio...`);

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
      let cleanText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      addLog("✨ Leitura concluída! A processar dados devolvidos...", 'success');
      
      const parsed = JSON.parse(cleanText);
      const foundEtfs = (parsed.etfs || []).map((etf: any) => ({
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

      foundEtfs.forEach((e: any) => {
        addLog(`✔️ Ativo detetado: ${e.name} (${e.ticker}). Investido: €${e.amountInvested} | Atual: €${e.currentValue}`, 'success');
      });

      if (foundEtfs.length === 0) {
        addLog("⚠️ A IA não encontrou nenhum ETF na imagem. A preencher com linha vazia.", 'warning');
      }

      setScanStep(2);
      setCashBalance(Number(parsed.cashBalance || 0));
      setScanResults(foundEtfs);

    } catch (err) {
      console.error(err);
      addLog(`❌ Erro crítico na IA: verifique a sua chave de API ou se a imagem é válida.`, 'warning');
      setScanStep(2);
    }
  };


  // FunÃ§Ãµes de manipulaÃ§Ã£o da folha de cÃ¡lculo interativa do Step 2
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
    setScanResults(prev => [
      ...prev,
      {
        id: newId,
        ticker: 'VWCE',
        name: 'Vanguard FTSE All-World UCITS ETF (Acc)',
        ter: 0.22,
        domicile: 'IE',
        distribution: 'Acc',
        replication: 'Physical',
        weight: 0,
        amountInvested: 1000,
        currentValue: 1000,
        lastPrice: 115.00
      }
    ]);
  };

  const handleRemoveRow = (id: string) => {
    setScanResults(prev => prev.filter(item => item.id !== id));
  };

  const handleConfirmImport = () => {
    if (scanResults.length === 0) {
      alert('A tua lista de importaÃ§Ã£o estÃ¡ vazia. Adiciona pelo menos uma linha.');
      return;
    }

    if (isNewPortfolio && !portfolioName.trim()) {
      alert('Por favor, indica um nome para a tua nova carteira.');
      return;
    }

    // Normaliza os pesos antes de salvar
    const totalAmount = scanResults.reduce((sum, item) => sum + item.amountInvested, 0);
    const finalized = scanResults.map(item => ({
      ...item,
      weight: totalAmount > 0 ? Number(((item.amountInvested / totalAmount) * 100).toFixed(1)) : 0
    }));

    onImport(finalized, cashBalance, portfolioName, portfolioBroker);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '750px', width: '95%' }} onClick={e => e.stopPropagation()}>
        
        {/* CabeÃ§alho do Modal */}
        <div className="modal-header">
          <h3>
            ðŸ“· Importar PortefÃ³lio da Corretora (XTB / xStation)
          </h3>
          <button className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '82vh', overflowY: 'auto' }}>
          
          {scanStep === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {isNewPortfolio && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1rem', 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid var(--border-color)', 
                  padding: '1rem', 
                  borderRadius: '12px' 
                }}>
                  <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                      Nome da Carteira
                    </label>
                    <input
                      type="text"
                      value={portfolioName}
                      onChange={e => setPortfolioName(e.target.value)}
                      placeholder="Ex: Minha Carteira XTB, Reforma..."
                      style={{ 
                        padding: '0.4rem 0.6rem', 
                        background: 'rgba(0,0,0,0.2)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '6px', 
                        color: 'var(--text-primary)', 
                        fontSize: '0.82rem', 
                        outline: 'none' 
                      }}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                      Corretora Vinculada
                    </label>
                    <select
                      value={portfolioBroker}
                      onChange={e => setPortfolioBroker(e.target.value)}
                      style={{ 
                        padding: '0.4rem 0.6rem', 
                        background: 'rgba(0,0,0,0.2)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '6px', 
                        color: 'var(--text-primary)', 
                        fontSize: '0.82rem', 
                        outline: 'none' 
                      }}
                    >
                      <option value="XTB">XTB</option>
                      <option value="DEGIRO">DEGIRO</option>
                      <option value="Trading212">Trading212</option>
                      <option value="Interactive Brokers">Interactive Brokers</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* IMPORTAÇÃO POR IMAGEM E CHAVE API */}
              {(
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '12px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={14} style={{ color: 'var(--primary)' }} /> Chave API do Google Gemini (Opcional se já estiver guardada)
                    </label>
                    <input
                      type="password"
                      value={geminiApiKey}
                      onChange={e => {
                        setGeminiApiKey(e.target.value);
                        localStorage.setItem('gemini_api_key', e.target.value);
                      }}
                      placeholder="Introduza a sua API Key (começa por AIza...)"
                      style={{ 
                        padding: '0.4rem 0.6rem', 
                        background: 'rgba(0,0,0,0.2)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '6px', 
                        color: 'var(--text-primary)', 
                        fontSize: '0.82rem', 
                        outline: 'none' 
                      }}
                    />
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Esta funcionalidade de ponta requer o uso de Visão Artificial. A chave fica guardada no seu browser e nunca é partilhada.</p>
                  </div>

                  <div 
                    className={`drag-area ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    style={{
                      border: dragActive ? '2px dashed var(--primary)' : '2px dashed var(--border-color)',
                      borderRadius: '16px',
                      padding: '2.5rem 1.5rem',
                      textAlign: 'center',
                      background: dragActive ? 'hsla(142, 76%, 42%, 0.03)' : 'hsla(230, 20%, 5%, 0.2)',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)'
                    }}
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                  >
                    <Upload size={44} style={{ color: dragActive ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '0.75rem', transition: 'var(--transition-smooth)' }} />
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Arraste o print screen das suas posiÃ§Ãµes</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Suporta ficheiros de imagem PNG, JPG ou WEBP da xStation.
                    </p>
                    <input 
                      id="file-upload-input"
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleFileInput}
                    />
                  </div>

                  {imagePreview && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-glass)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Ficheiro carregado:</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>Pronto para DigitalizaÃ§Ã£o</span>
                      </div>
                      <div style={{ height: '90px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)' }}>
                        <img src={imagePreview} alt="Screenshot da XTB" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                      </div>
                      <button className="btn btn-primary" style={{ width: '100%' }} onClick={startScanning}>
                        ðŸš€ ComeÃ§ar DigitalizaÃ§Ã£o OCR Inteligente
                      </button>
                    </div>
                  )}
                </div>
              )}



            </div>
          )}

          {/* STEP 1: ANIMAÃ‡ÃƒO DE SCANNER OCR */}
          {scanStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative', width: '70px', height: '70px' }}>
                  <div style={{ position: 'absolute', inset: 0, border: '3px solid var(--border-color)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', inset: 0, border: '3px solid var(--primary)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                  <div style={{ position: 'absolute', inset: '8px', background: 'var(--bg-surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    ðŸ“·
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>A Correr HeurÃ­sticas OCR...</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>O modelo de IA está a 'olhar' e a decifrar a estrutura financeira...</p>
                </div>
              </div>

              {/* Terminal de Rede Neural */}
              <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', fontFamily: 'monospace', fontSize: '0.75rem', height: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {logs.map((log, idx) => (
                  <div key={idx} style={{ 
                    color: log.type === 'success' ? 'var(--primary)' : log.type === 'warning' ? 'var(--primary)' : 'var(--text-primary)',
                    lineHeight: '1.4'
                  }}>
                    <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>[{log.time}]</span>
                    {log.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: FOLHA DE CÃLCULO INTERATIVA (EDITÃVEL) - SOLUÃ‡ÃƒO PERFEITA PARA O UTILIZADOR */}
          {scanStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'hsla(142, 76%, 42%, 0.08)', border: '1px solid hsla(142, 76%, 42%, 0.25)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
                <CheckCircle size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>PosiÃ§Ãµes ExtraÃ­das Prontas para ValidaÃ§Ã£o</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Fizemos uma leitura automÃ¡tica, mas para garantir 100% de rigor, pode <strong>ajustar, adicionar ou remover</strong> dados na tabela abaixo antes de guardar.
                  </p>
                </div>
              </div>

              {isNewPortfolio && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '1rem', 
                  background: 'rgba(255, 255, 255, 0.02)', 
                  border: '1px solid var(--border-color)', 
                  padding: '1rem', 
                  borderRadius: '12px' 
                }}>
                  <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                      Nome da Carteira
                    </label>
                    <input
                      type="text"
                      value={portfolioName}
                      onChange={e => setPortfolioName(e.target.value)}
                      placeholder="Ex: Minha Carteira XTB, Reforma..."
                      style={{ 
                        padding: '0.4rem 0.6rem', 
                        background: 'rgba(0,0,0,0.2)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '6px', 
                        color: 'var(--text-primary)', 
                        fontSize: '0.82rem', 
                        outline: 'none' 
                      }}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                      Corretora Vinculada
                    </label>
                    <select
                      value={portfolioBroker}
                      onChange={e => setPortfolioBroker(e.target.value)}
                      style={{ 
                        padding: '0.4rem 0.6rem', 
                        background: 'rgba(0,0,0,0.2)', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '6px', 
                        color: 'var(--text-primary)', 
                        fontSize: '0.82rem', 
                        outline: 'none' 
                      }}
                    >
                      <option value="XTB">XTB</option>
                      <option value="DEGIRO">DEGIRO</option>
                      <option value="Trading212">Trading212</option>
                      <option value="Interactive Brokers">Interactive Brokers</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Tabela EditÃ¡vel Estilo Excel (Sleek Dark SpreadSheet) */}
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: 'hsla(230, 20%, 5%, 0.5)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.75rem', width: '110px' }}>Ticker</th>
                      <th style={{ padding: '0.75rem' }}>Nome do ETF</th>
                      <th style={{ padding: '0.75rem', width: '95px' }}>Investido (â‚¬)</th>
                      <th style={{ padding: '0.75rem', width: '95px' }}>Valor Atual (â‚¬)</th>
                      <th style={{ padding: '0.75rem', width: '80px' }}>TER (%)</th>
                      <th style={{ padding: '0.75rem', width: '100px' }}>DomicÃ­lio</th>
                      <th style={{ padding: '0.75rem', width: '100px' }}>DistribuiÃ§Ã£o</th>
                      <th style={{ padding: '0.75rem', width: '50px', textAlign: 'center' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanResults.map((etf) => (
                      <tr key={etf.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        {/* Ticker Input */}
                        <td style={{ padding: '0.5rem' }}>
                          <input 
                            type="text"
                            value={etf.ticker}
                            onChange={(e) => handleUpdateResult(etf.id, 'ticker', e.target.value.toUpperCase())}
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'uppercase' }}
                          />
                        </td>
                        {/* Name Input */}
                        <td style={{ padding: '0.5rem' }}>
                          <input 
                            type="text"
                            value={etf.name}
                            onChange={(e) => handleUpdateResult(etf.id, 'name', e.target.value)}
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem', color: 'var(--text-primary)' }}
                          />
                        </td>
                        {/* Amount Input */}
                        <td style={{ padding: '0.5rem' }}>
                          <input 
                            type="number"
                            step="0.01"
                            value={etf.amountInvested}
                            onChange={(e) => handleUpdateResult(etf.id, 'amountInvested', Number(e.target.value))}
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem', fontWeight: 'bold' }}
                          />
                        </td>
                        {/* Current Value Input */}
                        <td style={{ padding: '0.5rem' }}>
                          <input 
                            type="number"
                            step="0.01"
                            value={etf.currentValue}
                            onChange={(e) => handleUpdateResult(etf.id, 'currentValue', Number(e.target.value))}
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}
                          />
                        </td>
                        {/* TER Input */}
                        <td style={{ padding: '0.5rem' }}>
                          <input 
                            type="number"
                            step="0.01"
                            value={etf.ter}
                            onChange={(e) => handleUpdateResult(etf.id, 'ter', Number(e.target.value))}
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem' }}
                          />
                        </td>
                        {/* Domicile Select */}
                        <td style={{ padding: '0.5rem' }}>
                          <select 
                            value={etf.domicile}
                            onChange={(e) => handleUpdateResult(etf.id, 'domicile', e.target.value)}
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                          >
                            <option value="IE">IE (Irlanda)</option>
                            <option value="LU">LU (Luxemburgo)</option>
                          </select>
                        </td>
                        {/* Distribution Select */}
                        <td style={{ padding: '0.5rem' }}>
                          <select 
                            value={etf.distribution}
                            onChange={(e) => handleUpdateResult(etf.id, 'distribution', e.target.value)}
                            style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'rgba(0,0,0,0.2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}
                          >
                            <option value="Acc">AcumulaÃ§Ã£o</option>
                            <option value="Dist">DistribuiÃ§Ã£o</option>
                          </select>
                        </td>
                        {/* Trash Action */}
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                          <button 
                            className="btn" 
                            style={{ padding: '0.35rem', background: 'none', border: 'none', color: 'var(--danger)' }}
                            onClick={() => handleRemoveRow(etf.id)}
                            title="Remover Ativo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Saldo de Caixa / Reservas */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed var(--border-color)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Reservas de Dinheiro (Saldo na Corretora):</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>â‚¬</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={cashBalance || ''}
                    placeholder="0,00"
                    onChange={(e) => setCashBalance(Math.max(0, Number(e.target.value) || 0))}
                    style={{ width: '120px', padding: '0.4rem 0.6rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', fontWeight: 'bold' }}
                  />
                </div>
              </div>

              {/* BotÃµes de AÃ§Ã£o na tabela */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                  onClick={handleAddRow}
                >
                  <Plus size={14} /> Adicionar Linha Manualmente
                </button>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Info size={14} style={{ color: 'var(--primary)' }} />
                  <span>Total de Ativos: <strong>{scanResults.length}</strong> | Total ExtraÃ­do: <strong>{scanResults.reduce((s, i) => s + i.amountInvested, 0).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</strong></span>
                </div>
              </div>

              {/* Confirmar ImportaÃ§Ã£o definitiva */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={() => setScanStep(0)}>
                  <RefreshCw size={14} /> ComeÃ§ar de Novo
                </button>
                <button className="btn btn-primary" onClick={handleConfirmImport}>
                  Confirmar e Importar para a Carteira
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}


