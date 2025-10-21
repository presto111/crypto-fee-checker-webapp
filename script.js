const resultsBody = document.getElementById("results-body");
const checkBtn = document.getElementById("checkBtn");

checkBtn.addEventListener("click", async () => {
  const exchange = document.getElementById("exchange").value;
  const coin = document.getElementById("coin").value;

  resultsBody.innerHTML = `<tr><td colspan="4">Loading...</td></tr>`;

  // Simulated data (replace later with real API)
  const feeData = {
    binance: { BTC: { fee: "0.0005 BTC", min: "0.001 BTC" }, ETH: { fee: "0.01 ETH", min: "0.02 ETH" }, USDT: { fee: "3 USDT", min: "10 USDT" }},
    kucoin: { BTC: { fee: "0.0004 BTC", min: "0.002 BTC" }, ETH: { fee: "0.008 ETH", min: "0.015 ETH" }, USDT: { fee: "2 USDT", min: "8 USDT" }},
    coinbase: { BTC: { fee: "0.0006 BTC", min: "0.001 BTC" }, ETH: { fee: "0.015 ETH", min: "0.03 ETH" }, USDT: { fee: "5 USDT", min: "15 USDT" }}
  };

  const result = feeData[exchange][coin];

  resultsBody.innerHTML = `
    <tr>
      <td>${exchange.charAt(0).toUpperCase() + exchange.slice(1)}</td>
      <td>${coin}</td>
      <td>${result.fee}</td>
      <td>${result.min}</td>
    </tr>
  `;
});
