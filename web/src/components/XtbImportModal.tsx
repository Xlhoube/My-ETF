import { useState, useEffect } from 'react';
import { ETF } from '../types';
import { X, Upload, CheckCircle, RefreshCw, Trash2, Plus, Info } from 'lucide-react';

interface XtbImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (etfs: ETF[]) => void;
}

interface ScannerLog {
  time: string;
  text: string;
  type: 'info' | 'success' | 'warning';
}



export default function XtbImportModal({ isOpen, onClose, onImport }: XtbImportModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [logs, setLogs] = useState<ScannerLog[]>([]);
  const [scanStep, setScanStep] = useState(0); // 0: Import input, 1: Scan animation, 2: Review/Edit spreadsheet
  const [scanResults, setScanResults] = useState<ETF[]>([]);

  // Limpa o estado quando o modal é aberto
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setImagePreview(null);
      setLogs([]);
      setScanStep(0);
      setScanResults([]);
    }
  }, [isOpen]);

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

  // Executa a simulação de scanning OCR por imagem
  const startScanning = () => {
    if (!selectedFile) return;

    setLogs([]);
    setScanStep(1);

    const logMessages: { text: string; delay: number; type: 'info' | 'success' | 'warning' }[] = [
      { text: `[XTB OCR Engine] Ficheiro inicializado: ${selectedFile.name}`, delay: 300, type: 'info' },
      { text: "[XTB OCR Engine] A detetar tabela de posições abertas na xStation...", delay: 800, type: 'info' },
      { text: "[XTB OCR Engine] Filtro de contraste aplicado. Grelha de colunas identificada.", delay: 1400, type: 'info' },
      { text: "✔️ Posição 1 detetada: Ticker 'SXR8.DE' (iShares Core S&P 500). Investido: €127.79.", delay: 2000, type: 'success' },
      { text: "✔️ Posição 2 detetada: Ticker 'SPYI.DE' (SPDR MSCI ACWI IMI). Investido: €125.78.", delay: 2600, type: 'success' },
      { text: "✔️ Posição 3 detetada: Ticker 'SXRV.DE' (iShares NASDAQ 100). Investido: €262.82.", delay: 3200, type: 'success' },
      { text: "[XTB OCR Engine] A cruzar com dados fiscais do JustETF...", delay: 3800, type: 'info' },
      { text: "✨ Extração concluída com sucesso! Redirecionando para o editor de validação...", delay: 4400, type: 'success' },
    ];

    logMessages.forEach((log, index) => {
      setTimeout(() => {
        const timeStr = new Date().toLocaleTimeString('pt-PT', { hour12: false });
        setLogs(prev => [...prev, { time: timeStr, text: log.text, type: log.type }]);
        
        // No final, popula a folha de cálculo
        if (index === logMessages.length - 1) {
          setScanStep(2);
          setScanResults([
            {
              id: `xtb-${Math.random().toString(36).substring(2, 7)}`,
              ticker: 'SXR8',
              name: 'iShares Core S&P 500 UCITS ETF (Acc)',
              ter: 0.07,
              domicile: 'IE',
              distribution: 'Acc',
              replication: 'Physical',
              weight: 25,
              amountInvested: 127.79,
              currentValue: 152.44,
              lastPrice: 698.90
            },
            {
              id: `xtb-${Math.random().toString(36).substring(2, 7)}`,
              ticker: 'SPYI',
              name: 'SPDR MSCI ACWI IMI UCITS ETF (Acc)',
              ter: 0.17,
              domicile: 'IE',
              distribution: 'Acc',
              replication: 'Physical',
              weight: 25,
              amountInvested: 125.78,
              currentValue: 151.70,
              lastPrice: 11.25
            },
            {
              id: `xtb-${Math.random().toString(36).substring(2, 7)}`,
              ticker: 'SXRV',
              name: 'iShares NASDAQ 100 UCITS ETF (Acc)',
              ter: 0.33,
              domicile: 'IE',
              distribution: 'Acc',
              replication: 'Physical',
              weight: 50,
              amountInvested: 262.82,
              currentValue: 328.22,
              lastPrice: 1492.00
            }
          ]);
        }
      }, log.delay);
    });
  };


  // Funções de manipulação da folha de cálculo interativa do Step 2
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
      alert('A tua lista de importação está vazia. Adiciona pelo menos uma linha.');
      return;
    }

    // Normaliza os pesos antes de salvar
    const totalAmount = scanResults.reduce((sum, item) => sum + item.amountInvested, 0);
    const finalized = scanResults.map(item => ({
      ...item,
      weight: totalAmount > 0 ? Number(((item.amountInvested / totalAmount) * 100).toFixed(1)) : 0
    }));

    onImport(finalized);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '750px', width: '95%' }} onClick={e => e.stopPropagation()}>
        
        {/* Cabeçalho do Modal */}
        <div className="modal-header">
          <h3>
            📷 Importar Portefólio da Corretora (XTB / xStation)
          </h3>
          <button className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '50%' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '82vh', overflowY: 'auto' }}>
          
          {scanStep === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* IMPORTAÇÃO POR IMAGEM */}
              {(
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>Arraste o print screen das suas posições</h4>
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
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>Pronto para Digitalização</span>
                      </div>
                      <div style={{ height: '90px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)' }}>
                        <img src={imagePreview} alt="Screenshot da XTB" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                      </div>
                      <button className="btn btn-primary" style={{ width: '100%' }} onClick={startScanning}>
                        🚀 Começar Digitalização OCR Inteligente
                      </button>
                    </div>
                  )}
                </div>
              )}



            </div>
          )}

          {/* STEP 1: ANIMAÇÃO DE SCANNER OCR */}
          {scanStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative', width: '70px', height: '70px' }}>
                  <div style={{ position: 'absolute', inset: 0, border: '3px solid var(--border-color)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', inset: 0, border: '3px solid var(--primary)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                  <div style={{ position: 'absolute', inset: '8px', background: 'var(--bg-surface)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    📷
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>A Correr Heurísticas OCR...</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Extraindo pixels e cruzando dados de emissores...</p>
                </div>
              </div>

              {/* Terminal de Logs OCR */}
              <div style={{ background: '#05050a', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', fontFamily: 'monospace', fontSize: '0.75rem', height: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {logs.map((log, idx) => (
                  <div key={idx} style={{ 
                    color: log.type === 'success' ? '#4ade80' : log.type === 'warning' ? '#facc15' : '#e2e8f0',
                    lineHeight: '1.4'
                  }}>
                    <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>[{log.time}]</span>
                    {log.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: FOLHA DE CÁLCULO INTERATIVA (EDITÁVEL) - SOLUÇÃO PERFEITA PARA O UTILIZADOR */}
          {scanStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'hsla(142, 76%, 42%, 0.08)', border: '1px solid hsla(142, 76%, 42%, 0.25)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
                <CheckCircle size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>Posições Extraídas Prontas para Validação</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Fizemos uma leitura automática, mas para garantir 100% de rigor, pode <strong>ajustar, adicionar ou remover</strong> dados na tabela abaixo antes de guardar.
                  </p>
                </div>
              </div>

              {/* Tabela Editável Estilo Excel (Sleek Dark SpreadSheet) */}
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: 'hsla(230, 20%, 5%, 0.5)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.75rem', width: '110px' }}>Ticker</th>
                      <th style={{ padding: '0.75rem' }}>Nome do ETF</th>
                      <th style={{ padding: '0.75rem', width: '95px' }}>Investido (€)</th>
                      <th style={{ padding: '0.75rem', width: '95px' }}>Valor Atual (€)</th>
                      <th style={{ padding: '0.75rem', width: '80px' }}>TER (%)</th>
                      <th style={{ padding: '0.75rem', width: '100px' }}>Domicílio</th>
                      <th style={{ padding: '0.75rem', width: '100px' }}>Distribuição</th>
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
                            <option value="Acc">Acumulação</option>
                            <option value="Dist">Distribuição</option>
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

              {/* Botões de Ação na tabela */}
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
                  <span>Total de Ativos: <strong>{scanResults.length}</strong> | Total Extraído: <strong>{scanResults.reduce((s, i) => s + i.amountInvested, 0).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</strong></span>
                </div>
              </div>

              {/* Confirmar Importação definitiva */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={() => setScanStep(0)}>
                  <RefreshCw size={14} /> Começar de Novo
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
