interface AppLogoProps {
  size?: number;
  showText?: boolean;
  subtitle?: string;
  onClick?: () => void;
  useImage?: boolean;
}

export default function AppLogo({ 
  size = 40, 
  showText = true, 
  subtitle,
  onClick,
  useImage = false 
}: AppLogoProps) {
  return (
    <div 
      className="brand" 
      onClick={onClick} 
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.85rem',
        userSelect: 'none'
      }}
    >
      {/* Ícone Emblemático do Logótipo */}
      <div 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          borderRadius: `${Math.round(size * 0.28)}px`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.2))',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.25), inset 0 0 12px rgba(16, 185, 129, 0.2)',
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
      >
        {useImage ? (
          <img 
            src="/logo.jpg" 
            alt="My ETF Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <svg 
            width={Math.round(size * 0.8)} 
            height={Math.round(size * 0.8)} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Gradiente de Marca: Esmeralda Longo Prazo -> Ciano Radar Ativo */}
              <linearGradient id="myEtfGrad" x1="10%" y1="90%" x2="90%" y2="10%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              {/* Filtro Neon Glow */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ondas Concéntricas de Radar (Caça de Oportunidades & Scanner) */}
            <path 
              d="M 16,50 A 34,34 0 0,1 84,50" 
              stroke="url(#myEtfGrad)" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              opacity="0.35"
            />
            <path 
              d="M 25,50 A 25,25 0 0,1 75,50" 
              stroke="url(#myEtfGrad)" 
              strokeWidth="4" 
              strokeLinecap="round" 
              opacity="0.65"
            />

            {/* Escudo de Proteção Patrimonial (Investimento a Longo Prazo) */}
            <path 
              d="M 50,18 L 76,28 C 76,55 50,82 50,82 C 50,82 24,55 24,28 Z" 
              stroke="url(#myEtfGrad)" 
              strokeWidth="4" 
              strokeLinejoin="round"
              fill="rgba(16, 185, 129, 0.08)"
            />

            {/* Seta Dinâmica de Crescimento Financeiro & Juros Compostos */}
            <g filter="url(#neonGlow)">
              <path 
                d="M 33,56 L 44,43 L 53,52 L 72,28" 
                stroke="url(#myEtfGrad)" 
                strokeWidth="5.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M 60,27 L 73,27 L 73,40" 
                stroke="url(#myEtfGrad)" 
                strokeWidth="5.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </g>
          </svg>
        )}
      </div>

      {/* Tipografia da Marca */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            fontSize: `${Math.round(size * 0.5)}px`, 
            fontWeight: 800, 
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <span>My</span>
            <span style={{ 
              background: 'linear-gradient(135deg, #10b981, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900
            }}>
              ETF
            </span>
          </div>
          {subtitle && (
            <div style={{ 
              fontSize: '0.65rem', 
              color: 'var(--primary)', 
              fontWeight: 700, 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase',
              marginTop: '0.15rem'
            }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
