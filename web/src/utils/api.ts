export async function fetchEtfPrice(ticker: string): Promise<number | null> {
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

    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooTicker}?interval=1d&range=1d`;
    // Utilizamos o AllOrigins como um CORS proxy público para contornar bloqueios do browser
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) return null;

    const data = await response.json();
    const result = data.chart?.result?.[0];
    if (result && result.meta && result.meta.regularMarketPrice) {
      return result.meta.regularMarketPrice;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao obter cotação para ${ticker}:`, error);
    return null;
  }
}
