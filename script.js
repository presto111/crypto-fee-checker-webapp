const resultsBody = document.getElementById("results-body");
const checkBtn = document.getElementById("checkBtn");
const exchangeSelect = document.getElementById('exchange');
const coinSelect = document.getElementById('coin');

let coinChoices; // Choices.js instance

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

    exchangeSelect.innerHTML = '';
    exchanges.slice(0, 20).forEach(exchange => {
      const option = document.createElement('option');
      option.value = exchange.id;
      option.textContent = exchange.name;
      exchangeSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Error fetching exchanges:', err);
  }
}

// Populate coins dynamically from CoinGecko
async function populateCoins() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
    const coins = await response.json();

    const popularSymbols = ['btc', 'eth', 'usdt', 'bnb', 'ada', 'xrp', 'doge', 'dot', 'sol', 'ltc'];
    const options = popularSymbols.map(symbol => {
      const coin = coins.find(c => c.symbol.toLowerCase() === symbol);
      if (coin) {
        return { value: coin.id, label: `${coin.name} (${coin.symbol.toUpperCase()})` };
      }
      return null;
    }).filter(Boolean);

    if (coinChoices) {
      coinChoices.setChoices(options, 'value', 'label', true);
    } else {
      coinSelect.innerHTML = options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
    }
  } catch (err) {
    console.error('Error fetching coins:', err);
  }
}

// Fetch live price data from CoinGecko using coin id
async function fetchLivePrice(coinId) {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
    const data = await response.json();
    return data[coinId]?.usd ? `$${data[coinId].usd}` : "N/A";
  } catch {
    return "Unavailable";
  }
}

// Initialize dropdowns and Choices.js
async function initialize() {
  await populateExchanges();
  await populateCoins();

  // Initialize Choices.js for coin dropdown without search
  coinChoices = new Choices('#coin', {
    searchEnabled: false, // Disable search
    itemSelectText: '',
    shouldSort: false,
  });
}

initialize();

checkBtn.addEventListener("click", async () => {
  const exchange = exchangeSelect.value;
  const coinId = coinSelect.value;

  resultsBody.innerHTML = `<tr><td colspan="4">Fetching data...</td></tr>`;

  // Approximate coin symbol from coinId (take string after last dash if present)
  const coinSymbol = coinId.split('-').pop().toUpperCase();
  let localFees = staticFees[exchange]?.[coinSymbol];
  if (!localFees) {
    localFees = { fee: "N/A", min: "N/A" };
  }

  const livePriceUSD = await fetchLivePrice(coinId);

  resultsBody.innerHTML = `
    <tr>
      <td>${exchange.charAt(0).toUpperCase() + exchange.slice(1)}</td>
      <td>${coinSymbol}</td>
      <td>${localFees.fee}</td>
      <td>${localFees.min}</td>
    </tr>
    <tr>
      <td colspan="4">Live price (CoinGecko): ${livePriceUSD}</td>
    </tr>
  `;
});
