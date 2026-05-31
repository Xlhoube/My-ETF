async function run() {
  const response = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/SPYI.DE?interval=1d&range=1d');
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
