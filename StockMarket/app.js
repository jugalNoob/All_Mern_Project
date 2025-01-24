const axios = require("axios");
const ccxt = require("ccxt");
const talib = require("ta-lib"); // Use talib-binding for Node.js integration

// Configuration
const config = {
  exchange: "binance", // Use any supported exchange in ccxt
  symbol: "BTC/USDT",  // Trading pair
  apiKey: "YOUR_API_KEY", // Your API key
  secret: "YOUR_API_SECRET", // Your API secret
  timeframe: "1m",     // Timeframe for candlestick data
  shortMA: 5,          // Short moving average period
  longMA: 20,          // Long moving average period
  tradeAmount: 0.001,  // Trade amount
};

// Initialize exchange
const exchange = new ccxt.binance({
  apiKey: config.apiKey,
  secret: config.secret,
});

// Fetch historical data
async function fetchOHLCV() {
  try {
    const ohlcv = await exchange.fetchOHLCV(config.symbol, config.timeframe, undefined, config.longMA + 1);
    return ohlcv.map(candle => ({
      time: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
    }));
  } catch (error) {
    console.error("Error fetching OHLCV:", error.message);
    return [];
  }
}

// Calculate moving averages
function calculateMA(data, period) {
  const prices = data.map(candle => candle.close);
  return talib.MA(prices, period, "SMA"); // Simple Moving Average
}

// Execute a trade
async function executeTrade(side) {
  try {
    const order = await exchange.createMarketOrder(config.symbol, side, config.tradeAmount);
    console.log(`Trade executed: ${side} ${config.tradeAmount} ${config.symbol}`);
    console.log(order);
  } catch (error) {
    console.error("Error executing trade:", error.message);
  }
}

// Main logic
async function runBot() {
  const data = await fetchOHLCV();
  if (data.length < config.longMA) return;

  const shortMA = calculateMA(data.slice(-config.shortMA), config.shortMA);
  const longMA = calculateMA(data.slice(-config.longMA), config.longMA);

  const lastShortMA = shortMA[shortMA.length - 1];
  const lastLongMA = longMA[longMA.length - 1];
  const prevShortMA = shortMA[shortMA.length - 2];
  const prevLongMA = longMA[longMA.length - 2];

  if (prevShortMA < prevLongMA && lastShortMA > lastLongMA) {
    await executeTrade("buy");
  } else if (prevShortMA > prevLongMA && lastShortMA < lastLongMA) {
    await executeTrade("sell");
  } else {
    console.log("No trade signal.");
  }
}

// Run the bot every minute
setInterval(runBot, 60 * 1000);
