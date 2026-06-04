export async function fetchEtfPrice(ticker: string): Promise<{ price: number; change: number; previousClose: number } | null> {
  try {
    // Adicionar sufixo automaticamente para ETFs europeus se não tiver sufixo
    let yahooTicker = ticker.toUpperCase().trim();
    if (!yahooTicker.includes('.')) {
      if (['VWCE', 'SXR8', 'SPYI', 'SXRV', 'QDVE', 'EUNL', 'IUSQ', 'IS3S'].includes(yahooTicker)) {
        yahooTicker = `${yahooTicker}.DE`; // Xetra (Alemanha)
      } else if (['VUSA', 'VUAA', 'IWDA'].includes(yahooTicker)) {
        yahooTicker = `${yahooTicker}.AS`; // Euronext Amsterdam
      } else {
        yahooTicker = `${yahooTicker}.DE`; // Default para bolsa alemã
      }
    }

    const cacheBuster = `&t=${Date.now()}`;
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooTicker}?interval=1d&range=1d${cacheBuster}`;
    
    // Array of proxies to try
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
    ];

    let lastError = null;

    for (const proxyUrl of proxies) {
      try {
        const response = await fetch(proxyUrl, { cache: 'no-store' });
        if (!response.ok) continue;

        const data = await response.json();
        const result = data.chart?.result?.[0];
        
        if (result?.meta?.regularMarketPrice && result?.meta?.chartPreviousClose) {
          const price = result.meta.regularMarketPrice;
          const previousClose = result.meta.chartPreviousClose;
          const change = ((price - previousClose) / previousClose) * 100;
          return { price, change, previousClose };
        } else if (result?.meta?.regularMarketPrice) {
          return { price: result.meta.regularMarketPrice, change: 0, previousClose: result.meta.regularMarketPrice };
        }
      } catch (err) {
        lastError = err;
        // Continue to the next proxy
      }
    }

    console.error(`Falha a obter cotação para ${ticker} após tentar proxies.`, lastError);
    return null;
  } catch (error) {
    console.error(`Erro ao obter cotação para ${ticker}:`, error);
    return null;
  }
}
