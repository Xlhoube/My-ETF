import { useState, useRef, useEffect } from 'react';
import { MarketEtf, ChatMessage } from '../types';
import { generateMarketAdvisorReply } from '../utils/marketAdvisorEngine';
import { Send, Bot, Zap } from 'lucide-react';

interface MarketChatProps {
  etfs: MarketEtf[];
  triggeredQuery?: { text: string; timestamp: number } | null;
  onClearTrigger?: () => void;
}

// Helper para formatar o texto do consultor que contém markdown
function parseInlineFormatting(text: string): React.ReactNode[] {
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  const matches = text.split(regex);
  
  return matches.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} style={{ color: 'var(--text-primary)', fontWeight: '800' }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} style={{ 
          background: 'rgba(56, 189, 248, 0.1)', 
          padding: '2px 6px', 
          borderRadius: '4px', 
          color: 'var(--primary)', 
          fontFamily: 'monospace',
          fontSize: '0.84rem',
          border: '1px solid rgba(56, 189, 248, 0.2)'
        }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function renderFormattedText(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const currentLine = line;
    
    if (!currentLine.trim()) {
      return <div key={idx} style={{ height: '0.5rem' }} />;
    }

    if (currentLine.startsWith('###')) {
      const title = currentLine.replace('###', '').trim();
      return (
        <h4 key={idx} style={{ 
          fontSize: '1rem', 
          fontWeight: '800', 
          color: 'var(--primary)', 
          marginTop: '0.85rem', 
          marginBottom: '0.45rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          {parseInlineFormatting(title)}
        </h4>
      );
    }

    let isBullet = false;
    let bulletText = currentLine;
    if (currentLine.trim().startsWith('*') || currentLine.trim().startsWith('-') || currentLine.trim().startsWith('•')) {
      isBullet = true;
      bulletText = currentLine.trim().replace(/^[\s*•-]+/, '').trim();
    }

    const content = parseInlineFormatting(bulletText);

    if (isBullet) {
      return (
        <div key={idx} style={{ 
          display: 'flex', 
          gap: '0.4rem', 
          alignItems: 'flex-start', 
          marginLeft: '0.5rem', 
          marginBottom: '0.35rem', 
          lineHeight: '1.45' 
        }}>
          <span style={{ color: 'var(--primary)', fontSize: '0.85rem', marginTop: '0.1rem' }}>•</span>
          <span style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{content}</span>
        </div>
      );
    }

    return (
      <p key={idx} style={{ 
        fontSize: '0.88rem', 
        lineHeight: '1.45', 
        color: 'var(--text-secondary)',
        marginBottom: '0.35rem'
      }}>
        {content}
      </p>
    );
  });
}

export default function MarketChat({ etfs, triggeredQuery, onClearTrigger }: MarketChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'advisor',
      text: `### Consultor de Mercados & Radar de ETFs Ativado

Estou a acompanhar o mercado contínuo de ETFs UCITS europeus em direto. 

Podes colocar questões como:
* **"Quais são as melhores oportunidades de compra hoje?"**
* **"O SXR8 (S&P 500) ou QDVE estão sobreaquecidos?"**
* **"Audita o SPYI e o VWCE — qual tem melhor relação custo/eficiência?"**
* **"Para onde está o capital institucional a rotacionar neste ciclo?"**`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateMarketAdvisorReply(text, etfs);
      const advisorMsg: ChatMessage = {
        id: `advisor-${Date.now()}`,
        sender: 'advisor',
        text: reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, advisorMsg]);
      setIsTyping(false);
    }, 450);
  };

  // Responde a consultas disparadas a partir de outros ecrãs
  useEffect(() => {
    if (triggeredQuery?.text) {
      handleSendMessage(triggeredQuery.text);
      if (onClearTrigger) onClearTrigger();
    }
  }, [triggeredQuery]);

  const quickPrompts = [
    'Quais são as melhores oportunidades de compra hoje?',
    'Quais os ETFs mais arriscados / sobrecomprados para realizar mais-valias?',
    'Audita o ETF SPYI vs VWCE',
    'Que ativos defensivos protegem melhor contra inflação e volatilidade?'
  ];

  return (
    <div className="chat-wrapper">
      
      {/* CABEÇALHO DO CHAT */}
      <div style={{ 
        padding: '0.85rem 1.25rem', 
        borderBottom: '1px solid var(--border-color)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.02)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '36px', height: '36px', borderRadius: '10px', 
            background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary)', border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Consultor de Mercados & Radar de Oportunidades
            </div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              Conectado aos dados em direto de {etfs.length} ETFs europeus
            </div>
          </div>
        </div>

        <button 
          onClick={() => setMessages([messages[0]])}
          className="btn btn-secondary"
          style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
        >
          Limpar Conversa
        </button>
      </div>

      {/* ÁREA DE MENSAGENS COM SCROLL INTERNO */}
      <div style={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={msg.id} 
              style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: isUser ? '75%' : '88%'
              }}
            >
              {!isUser && (
                <div style={{ 
                  width: '30px', height: '30px', borderRadius: '8px', 
                  background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)', flexShrink: 0, marginTop: '0.2rem'
                }}>
                  <Zap size={15} />
                </div>
              )}

              <div style={{ 
                background: isUser ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                color: isUser ? 'var(--text-on-primary)' : 'var(--text-primary)',
                border: isUser ? 'none' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '0.85rem 1.1rem',
                boxShadow: isUser ? '0 4px 12px var(--primary-glow)' : 'none'
              }}>
                {isUser ? (
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.45, fontWeight: 500, color: 'inherit' }}>
                    {msg.text}
                  </p>
                ) : (
                  <div>{renderFormattedText(msg.text)}</div>
                )}
                
                <div style={{ 
                  fontSize: '0.65rem', 
                  color: isUser ? 'rgba(0,0,0,0.6)' : 'var(--text-muted)', 
                  textAlign: 'right', 
                  marginTop: '0.4rem' 
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Zap size={14} />
            </div>
            O Consultor está a analisar dados técnicos e fundamentais...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* CHIPS DE SUGESTÃO RÁPIDA */}
      <div style={{ padding: '0.45rem 1.25rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', borderTop: '1px solid var(--border-color)', flexShrink: 0, background: 'rgba(0, 0, 0, 0.15)' }}>
        {quickPrompts.map((p, idx) => (
          <button 
            key={idx}
            onClick={() => handleSendMessage(p)}
            style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '20px', 
              padding: '0.3rem 0.75rem', 
              color: 'var(--text-secondary)', 
              fontSize: '0.75rem', 
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* BARRA DE INPUT */}
      <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', flexShrink: 0, background: 'var(--bg-surface)' }}>
        <input 
          type="text"
          placeholder="Escreve uma pergunta sobre mercados, tickers, oportunidades de compra ou venda..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        />
        <button 
          onClick={() => handleSendMessage()}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.25rem', gap: '0.4rem' }}
        >
          <Send size={15} /> Enviar
        </button>
      </div>

    </div>
  );
}
