import ccxt from 'ccxt';
import Config from 'react-native-config';

export const availableExchanges = ['kraken'];
export const ccxtExchanges = ['kraken'];

export const isExchangeAvailable = exchangeName => availableExchanges.includes(exchangeName);

export const asyncReduce = async (arr, fn, val, pure) => {
  for (let i = 0; i < arr.length; i++) {
    const v = await fn(val, arr[i], i, arr);
    if (pure !== false) val = v;
  }
  return val;
};

export const getBalanceValue = async (exchangeName, balance, currency = 'BTC') => {
  const exchange = new ccxt[exchangeName]();
  exchange.apiKey = Config.KRAKEN_API_KEY;
  exchange.secret = Config.KRAKEN_SECRET;

  await exchange.loadMarkets();

  const balanceArray = Object.entries(balance);
  const totaPrice = await asyncReduce(
    balanceArray,
    async (total, [currencyName, amount]) => {
      if (currencyName.toUpperCase() === currency.toUpperCase()) {
        return total + amount;
      }
      const marketId = `${currencyName.toUpperCase()}/${currency.toUpperCase()}`;
      try {
        const ticker = await exchange.fetchTicker(marketId);
        const price = ticker.last * amount;
        return total + price;
      } catch (error) {
        return total + 0;
      }
    },
    0,
  );

  return totaPrice;
};

export const getBalancePrice = async (balance, currency) => {
  const valueTasks = balance.map(async b => getBalanceValue(b.id, b.value, currency));
  const valueTasksRes = await Promise.all(valueTasks);

  return balance.map((b, index) => ({
    ...b,
    total: {
      ...b.total,
      [currency]: valueTasksRes[index],
    },
  }));
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
