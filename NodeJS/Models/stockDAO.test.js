import axios from 'axios';
import {tickerModel} from "../utilities/MongooseModels";
import {getStock, getStockIntraday, formatStocks, getTickers, getTicker, updateTickerBuy, updateTickerSell} from './stockDAO';

axios.get = jest.fn(() => {
  return {
    then: jest.fn(() => {
      return {catch: jest.fn()}
    })
  }
});

tickerModel.findOne = jest.fn(() => {
  return {
    then: jest.fn(() => {
      return {catch: jest.fn()}
    }),
    catch: jest.fn()
  }
});

const monthCall = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT&apikey=WIOGAHD0RJEEZ59V';
const allCall = 'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=MSFT&apikey=WIOGAHD0RJEEZ59V';
const dailyCall = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=WIOGAHD0RJEEZ59V';
const dateNow = '2018-09-25T22:00:23.109Z';

const bogusData = {
  "2018-09-27": {
    "4. close": "114.4100",
    "5. adjusted close": "114.4100"
  },
  "2018-09-26": {
    "4. close": "113.9800",
    "5. adjusted close": "113.9800"
  },
  "2018-09-25": {
    "4. close": "114.4500",
    "5. adjusted close": "114.4500"
  },
  "2018-09-24": {
    "4. close": "114.6700",
    "5. adjusted close": "114.6700"
  }
};

const formattedData = [
  {"x": 1537747200000, "y": 114.67},
  {"x": 1537833600000, "y": 114.45},
  {"x": 1537920000000, "y": 113.98},
  {"x": 1538006400000, "y": 114.41}
];

const formattedDataDateRestricted = [
  {"x": 1537920000000, "y": 113.98},
  {"x": 1538006400000, "y": 114.41}
];

describe('Positive Stock Calls', function () {
  let dateLimit;
  beforeAll(() => {
    dateLimit = new Date(dateNow);
  });

  it('should call the API with the proper URL - Daily', async function () {
    await getStockIntraday('MSFT');
    expect(axios.get).toHaveBeenCalledWith(dailyCall);
  });

  it('should call the API with the proper URL - MONTH/TriMonth', async function () {
    await getStock('MSFT', 'Daily', dateLimit);
    expect(axios.get).toHaveBeenCalledWith(monthCall);
  });

  it('should call the API with the proper URL - ALL/Year', async function () {
    await getStock('MSFT', 'Monthly', 9);
    expect(axios.get).toHaveBeenCalledWith(allCall);
  });

  it('should format the data returned by the API call into x/y coordinates', async function () {
    const alteredData = await formatStocks(bogusData, '5. adjusted close');
    expect(alteredData).toEqual(formattedData);
  });

  it('should only have data that is more recent than date limit', async function () {
    const alteredData = await formatStocks(bogusData, '5. adjusted close', dateLimit);
    expect(alteredData).toEqual(formattedDataDateRestricted);
  });

  it('should call findOne for all tickers', async function () {
    await getTickers();
    expect(tickerModel.findOne).toHaveBeenCalledWith({}, {tickers: 1, _id: 0});
  });

  it('should call findOne for one ticker', async function () {
    await getTicker('AAPL');
    expect(tickerModel.findOne).toHaveBeenCalledWith({'tickers.symbol': 'AAPL'}, {'tickers.$': 1, '_id': 0});
  });
});

// describe('stockDAO', function () {
//   // TODO mock getTicker
//   it('should call findOneAndUpdate with the correct information', async function () {
//     let ticker = {
//       buyCount: 5,
//       currentCount: 2,
//       dailyBuyCount: 3,
//       weeklyBuyCount: 1
//     };
//
//     const updateClause = {
//       '$set': {
//         'tickers.$.buyCount': ticker.buyCount + 10,
//         'tickers.$.currentCount': ticker.currentCount + 10,
//         'tickers.$.dailyBuyCount': ticker.dailyBuyCount + 10,
//         'tickers.$.weeklyBuyCount': ticker.weeklyBuyCount + 10
//       }
//     };
//
//     const options = {
//       new: true,
//       passRawResult: true
//     };
//
//     const mockGetTicker = jest.mock();
//     //jest.spyOn(stockDAO, 'getTicker').mockImplementationOnce(mockGetTicker)
//     jest.spyOn(stockDAO, 'getTicker').mockReturnValue(ticker);
//
//     await updateTickerBuy('AAPL', 10);
//     expect(tickerModel.findOne).toHaveBeenCalledWith(
//       {'tickers.symbol': 'AAPL'},
//       updateClause,
//       options
//     );
//
//     stockDAO.getTicker.mockRestore();
//   });
//
//   // TODO mock getTicker
//   it('should call findOneAndUpdate with the correct information', async function () {
//     let ticker = {
//       sellCount: 8,
//       currentCount: 14
//     };
//     //console.log(ticker.sellCount);
//
//     const updateClause = {
//       '$set': {
//         'tickers.$.sellCount': ticker.sellCount + 10,
//         'tickers.$.currentCount': ticker.currentCount - 10
//       }
//     };
//
//     const options = {
//       new: true,
//       passRawResult: true
//     };
//
//     const mockGetTicker = jest.mock();
//     //jest.spyOn(stockDAO, 'getTicker').mockImplementationOnce(mockGetTicker);
//     mockGetTicker.spyOn(stockDAO, 'getTicker').mockReturnValue(ticker);
//
//     await updateTickerSell('AAPL', 10);
//     stockDAO.getTicker.mockRestore();
//
//     expect(tickerModel.findOne).toHaveBeenCalledWith(
//       {'tickers.symbol': 'AAPL'},
//       updateClause,
//       options
//     );
//
//   });
// });
