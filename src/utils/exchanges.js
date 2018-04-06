import ccxt from 'ccxt';

export const availableExchanges = ['kraken'];
export const ccxtExchanges = ['kraken'];

export const isExchangeAvailable = exchangeName => availableExchanges.includes(exchangeName);

export const getBalanceIn = async (exchangeName, { apiKey, apiSecret }, balances, currency) => {
  const exchange = new ccxt[exchangeName]();
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

export const getTopPrices = async (
  exchangeName,
  { apiKey, apiSecret },
  topCurrencies = ['USD', 'EUR'],
) => {
  const exchange = new ccxt[exchangeName]();
  exchange.apiKey = apiKey;
  exchange.secret = apiSecret;
  const tickers = await exchange.fetchTickers();
  return Object.assign(...topCurrencies.map(tc => ({ [tc]: tickers[`BTC/${tc.toUpperCase()}`].last })));
};

export const fetchBalance = (exchangeName, { apiKey, apiSecret }) => {
  console.log('fetchBalance', exchangeName, apiKey, apiSecret, ccxt);
  if (!isExchangeAvailable(exchangeName)) {
    throw new Error('This exchange is not available yet');
  }

  if (ccxtExchanges.includes(exchangeName)) {
    console.log('exchangeName', exchangeName);
    const exchange = new ccxt[exchangeName]();
    exchange.apiKey = apiKey;
    exchange.secret = apiSecret;

    return exchange.fetchBalance();
  }

  throw new Error('Error fetching balance.');
};

export const fetchTradeHistory = async (exchangeName, { apiKey, apiSecret }) => {
  console.log('fetchTradeHistory', exchangeName);
  const exchange = new ccxt[exchangeName]();
  exchange.apiKey = apiKey;
  exchange.secret = apiSecret;

  const orders = await exchange.fetchOrders('BTC');
  console.log('orders', orders);
};

export const fetchOHLCV = async (exchangeName, { apiKey, apiSecret }) => {
  if (!isExchangeAvailable(exchangeName)) {
    throw new Error('This exchange is not available yet');
  }

  if (ccxtExchanges.includes(exchangeName)) {
    const exchange = new ccxt[exchangeName]();
    exchange.apiKey = apiKey;
    exchange.secret = apiSecret;
    await exchange.loadMarkets();

    return exchange.fetchOHLCV('BTC/EUR', '1h');
  }

  throw new Error('Error fetching OHLCV.');
};
