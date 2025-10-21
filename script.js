const resultsBody = document.getElementById("results-body");
const checkBtn = document.getElementById("checkBtn");
const exchangeSelect = document.getElementById('exchange');

// Static fallback fee structure (approximation or placeholder)
const staticFees = {
  binance: { BTC: { fee: "0.0005 BTC", min: "0.001 BTC" }, ETH: { fee: "0.01 ETH", min: "0.02 ETH" }, USDT: { fee: "3 USDT", min: "10 USDT" }},
  kucoin: { BTC: { fee: "0.0004 BTC", min: "0.002 BTC" }, ETH: { fee: "0.008 ETH", min: "0.015 ETH" }, USDT: { fee: "2 USDT", min: "8 USDT" }},
  coinbase: { BTC: { fee: "0.0006 BTC", min: "0.001 BTC" }, ETH: { fee: "0.015 ETH", min: "0.03 ETH" }, USDT: { fee: "5 USDT", min: "15 USDT" }}
};

// Populate exchanges dynamically from CoinGecko
async function populateExchanges() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/exchanges');
    const exchanges = await response.json();

    // Clear existing options
    exchangeSelect.innerHTML = '';

    // Add top 20 exchanges for brevity
    exchanges.slice(0, 20).forEach(exchange => {
      const option = document.createElement('option');
      option.value = exchange.id;   // API ID like 'binance'
      option.textContent = exchange.name;
      exchangeSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Error fetching exchanges:', err);
  }
}

// Fetch live price data from CoinGecko
async function fetchLivePrice(coin) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
    const data = await response.json();
    return data[coin]?.usd ? `$${data[coin].usd}` : "N/A";
  } catch {
    return "Unavailable";
  }
}

// Call populateExchanges when page loads
populateExchanges();

checkBtn.addEventListener("click", async () => {
  const exchange = exchangeSelect.value;
  const coin = document.getElementById("coin").value;
  const coinIdMap = { BTC: "bitcoin", ETH: "ethereum", USDT: "tether" };

  resultsBody.innerHTML = `<tr><td colspan="4">Fetching data...</td></tr>`;

  // Use static fees if available, else show N/A
  let localFees = staticFees[exchange]?.[coin];
  if (!localFees) {
    localFees = { fee: "N/A", min: "N/A" };
  }

  // Fetch live price
  const livePriceUSD = await fetchLivePrice(coinIdMap[coin]);

  resultsBody.innerHTML = `
    <tr>
      <td>${exchange.charAt(0).toUpperCase() + exchange.slice(1)}</td>
      <td>${coin}</td>
      <td>${localFees.fee}</td>
      <td>${localFees.min}</td>
    </tr>
    <tr>
      <td colspan="4">Live price (CoinGecko): ${livePriceUSD}</td>
    </tr>
  `;
});
