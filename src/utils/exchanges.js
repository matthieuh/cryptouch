import ccxt from 'ccxt';

export const availableExchanges = ['kraken'];
export const ccxtExchanges = ['kraken'];

export const isExchangeAvailable = exchangeName => availableExchanges.includes(exchangeName);

export const getBalanceIn = async ({ name, apiKey, apiSecret }, balances, currency) => {
  const exchange = new ccxt[name]();
  exchange.apiKey = apiKey;
  exchange.secret = apiSecret;
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

export const getTopPrices = async ({ name, apiKey, apiSecret }, topCurrencies = ['USD', 'EUR']) => {
  const exchange = new ccxt[name]();
  exchange.apiKey = apiKey;
  exchange.secret = apiSecret;
  const tickers = await exchange.fetchTickers();
  return Object.assign(...topCurrencies.map(tc => ({ [tc]: tickers[`BTC/${tc.toUpperCase()}`].last })));
};

export const fetchBalance = ({ name, apiKey, apiSecret }) => {
  if (!isExchangeAvailable(name)) {
    throw new Error('This exchange is not available yet');
  }

  if (ccxtExchanges.includes(name)) {
    const exchange = new ccxt[name]();
    exchange.apiKey = apiKey;
    exchange.secret = apiSecret;

    return exchange.fetchBalance();
  }

  throw new Error('Error fetching balance.');
};

export const fetchTradeHistory = async ({ name, apiKey, apiSecret }) => {
  console.log('fetchTradeHistory', name, apiKey, apiSecret);
  const exchange = new ccxt[name]();
  exchange.apiKey = apiKey;
  exchange.secret = apiSecret;

  const orders = await exchange.fetchMyTrades('BTC');
  console.log('orders', orders);
};

export const fetchOHLCV = async ({ name, apiKey, apiSecret }) => {
  if (!isExchangeAvailable(name)) {
    throw new Error('This exchange is not available yet');
  }

  if (ccxtExchanges.includes(name)) {
    const exchange = new ccxt[name]();
    exchange.apiKey = apiKey;
    exchange.secret = apiSecret;
    await exchange.loadMarkets();

    return exchange.fetchOHLCV('BTC/EUR', '1h');
  }

  throw new Error('Error fetching OHLCV.');
};
