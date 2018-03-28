import ccxt from 'ccxt';
import Config from 'react-native-config';

console.log('Config', Config);

export const availableExchanges = ['kraken'];
export const ccxtExchanges = ['kraken'];

export const isExchangeAvailable = exchangeName => availableExchanges.includes(exchangeName);

export const getBalanceIn = async (exchangeName, balances, currency) => {
  const exchange = new ccxt[exchangeName]();
  exchange.apiKey = Config.KRAKEN_API_KEY;
  exchange.secret = Config.KRAKEN_SECRET;
  const tickers = await exchange.fetchTickers();
  return Object.entries(balances).reduce((res, [key, amount]) => {
    if (key === currency) {
      res[key] = balances[key];
      return res;
    }

    const ticker = tickers[`${key}/${currency}`];
    res[key] = ticker ? ticker.last * amount : 0;
    return res;
  }, {});
};

export const getTopPrices = async (exchangeName, topCurrencies = ['USD', 'EUR']) => {
  const exchange = new ccxt[exchangeName]();
  exchange.apiKey = Config.KRAKEN_API_KEY;
  exchange.secret = Config.KRAKEN_SECRET;
  const tickers = await exchange.fetchTickers();
  return Object.assign(...topCurrencies.map(tc => ({ [tc]: tickers[`BTC/${tc.toUpperCase()}`].last })));
};

export const fetchBalance = (exchangeName) => {
  if (!isExchangeAvailable(exchangeName)) {
    throw new Error('This exchange is not available yet');
  }

  if (ccxtExchanges.includes(exchangeName)) {
    const exchange = new ccxt[exchangeName]();
    exchange.apiKey = Config.KRAKEN_API_KEY;
    exchange.secret = Config.KRAKEN_SECRET;

    return exchange.fetchBalance();
  }

  throw new Error('Error fetching balance.');
};

export const fetchOHLCV = async (exchangeName) => {
  if (!isExchangeAvailable(exchangeName)) {
    throw new Error('This exchange is not available yet');
  }

  if (ccxtExchanges.includes(exchangeName)) {
    const exchange = new ccxt[exchangeName]();
    exchange.apiKey = Config.KRAKEN_API_KEY;
    exchange.secret = Config.KRAKEN_SECRET;
    await exchange.loadMarkets();

    return exchange.fetchOHLCV('BTC/EUR', '1h');
  }

  throw new Error('Error fetching OHLCV.');
};
