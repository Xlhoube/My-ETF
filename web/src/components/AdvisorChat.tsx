import { useState, useRef, useEffect } from 'react';
import { ETF, ChatMessage } from '../types';
import { generateAdvisorReply } from '../utils/advisorEngine';
import { Send, AlertTriangle, ShieldCheck, Briefcase } from 'lucide-react';

interface AdvisorChatProps {
  etfs: ETF[];
  triggeredQuery?: { text: string; timestamp: number } | null;
  onClearTrigger?: () => void;
  portfolioName?: string;
  portfolioBroker?: string;
  userProfileBroker?: string;
}

// Helper para formatar o texto do consultor que contém markdown simples
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
          background: 'rgba(0, 0, 0, 0.4)', 
          padding: '2px 6px', 
          borderRadius: '4px', 
          color: 'var(--primary)', 
          fontFamily: 'monospace',
          fontSize: '0.82rem',
          border: '1px solid rgba(255, 255, 255, 0.05)'
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
          borderBottom: '1px solid rgba(255,255,255,0.06)',
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
          <span style={{ color: 'var(--secondary)', fontSize: '0.85rem', marginTop: '0.1rem' }}>•</span>
          <span style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{content}</span>
        </div>
      );
    }

    return (
      <p key={idx} style={{ 
        fontSize: '0.88rem', 
        lineHeight: '1.45', 
        marginBottom: '0.45rem', 
        color: 'var(--text-secondary)',
        margin: '0 0 0.45rem 0'
      }}>
        {content}
      </p>
    );
  });
}

// Componente do chat com o consultor cético focado em custos e fiscalidade de ETFs.
export default function AdvisorChat({ etfs, triggeredQuery, onClearTrigger, portfolioName, portfolioBroker, userProfileBroker }: AdvisorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Efeito para carregar a mensagem de introdução profissional do consultor financeiro.
  useEffect(() => {
    const welcomeText = etfs.length === 0
      ? "Olá. Sou o teu Consultor Financeiro. Estou disponível para auditar a tua carteira de ETFs, analisando vulnerabilidades de custos, comissões de gestão e ineficiências fiscais que possam prejudicar a tua rentabilidade. Para começar a auditar, regista pelo menos um ETF na tua carteira. No entanto, podes colocar questões de cariz geral de imediato."
      : "Portefólio registado. Estou disponível para analisar qualquer questão sobre eficiência de custos, impostos (IRS) ou otimizações de ETFs na tua carteira. Pergunta-me o que desejares ou utiliza os atalhos rápidos abaixo.";

    setMessages([
      {
        id: 'welcome-msg',
        sender: 'advisor',
        text: welcomeText,
        timestamp: new Date()
      }
    ]);
  }, [etfs.length]);

  // Efeito para fazer scroll automático até à última mensagem enviada no painel.
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Envia a mensagem do utilizador e gera a resposta imediata cética do consultor.
  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    try {
      const newUserMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: textToSend,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newUserMessage]);
      setInputValue('');

      // Simular pequeno delay para dar mais realismo ao feedback do assistente "pesado"
      setTimeout(() => {
        const replyText = generateAdvisorReply(textToSend, etfs, portfolioName, portfolioBroker, userProfileBroker);
        const newAdvisorMessage: ChatMessage = {
          id: `advisor-${Date.now()}`,
          sender: 'advisor',
          text: replyText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newAdvisorMessage]);
      }, 400);

    } catch (err) {
      console.error('Erro ao processar as mensagens no chat:', err);
    }
  };

  // Efeito para escutar e processar perguntas disparadas do exterior (ex: cartões de ETFs)
  useEffect(() => {
    if (triggeredQuery && triggeredQuery.text) {
      handleSendMessage(triggeredQuery.text);
      if (onClearTrigger) {
        onClearTrigger();
      }
    }
  }, [triggeredQuery]);

  // Envia uma sugestão/pergunta pré-definida de um clique diretamente para o chat.
  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="card advisor-glow advisor-panel">
      <div className="chat-header">
        <div className="avatar" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '36px', height: '36px' }}>
          <Briefcase size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Consultor Financeiro
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <ShieldCheck size={12} style={{ color: 'var(--primary)' }} /> Auditoria e Otimização Fiscal
          </span>
        </div>
      </div>

      <div className="chat-messages custom-scroll">
        {messages.map(msg => (
          <div key={msg.id} className={`msg-bubble ${msg.sender}`}>
            {msg.sender === 'advisor' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                <span>CONSULTOR FINANCEIRO</span>
              </div>
            )}
            <div style={{ wordBreak: 'break-word' }}>
              {renderFormattedText(msg.text)}
            </div>
            <span style={{ display: 'block', textAlign: 'right', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              {msg.timestamp.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {etfs.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid hsla(354, 85%, 56%, 0.2)' }}
              onClick={() => handleQuickQuestion('Auditar a eficiência fiscal e IRS da minha carteira')}
            >
              <AlertTriangle size={12} style={{ color: 'var(--danger)' }} /> Auditoria Fiscal/IRS
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid hsla(38, 92%, 50%, 0.2)' }}
              onClick={() => handleQuickQuestion('Verificar custos ocultos e TER anual')}
            >
              📊 Auditar Comissões e Custos
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid hsla(199, 89%, 48%, 0.2)' }}
              onClick={() => handleQuickQuestion('Detetar redundância ou overlap de índices na minha carteira')}
            >
              <ShieldCheck size={12} style={{ color: 'var(--info)' }} /> Overlaps
            </button>
          </div>
        )}

        <form 
          className="chat-input-container" 
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
        >
          <input
            className="chat-input"
            type="text"
            placeholder="Faz-me uma pergunta sobre custos, taxas ou IRS..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
