"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StockGenerator {
    constructor() {
        this.stocks = [
            { "ticker": "NBR", "value": 83.72 },
            { "ticker": "ABC", "value": 2813.41 },
            { "ticker": "XYZ", "value": 14.91 }
        ];
        this.getHourlyData = (ticker) => {
            const index = this.getStockIndex(ticker);
            let results = [];
            for (let i = 0; i < 24; i++) {
                let val = Math.random() * (this.stocks[index].value / 4);
                let plusMinus = Math.random() < 0.5 ? -1 : 1;
                results.push(this.stocks[index].value + (val * plusMinus));
            }
            return results;
        };
        this.getOneStock = (ticker, timestamp) => {
            const data = this.getHourlyData(ticker);
            return {
                symbol: ticker,
                data: [{
                        timestamp: timestamp,
                        open: data[0],
                        high: this.getLargest(data),
                        low: this.getSmallest(data),
                        close: data[data.length - 1]
                    }]
            };
        };
        this.getLiveData = (tickers) => {
            let result = [];
            for (let ticker of tickers) {
                let index = this.getStockIndex(ticker);
                if (index > -1) {
                    result.push(this.getOneStock(ticker, new Date().toISOString()));
                }
                else
                    result.push({ 'error': 'Ticker not available' });
            }
            return result;
        };
        this.getHistoricalData = () => {
        };
        this.getTickers = () => {
            let result = [];
            for (let i = 0; i < this.stocks.length; i++)
                result.push(this.stocks[i].ticker);
            return result;
        };
        this.getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
        this.getLargest = (arr) => {
            let max = -Infinity;
            arr.filter(a => { if (a > max)
                max = a; });
            return max;
        };
        this.getSmallest = (arr) => {
            let min = Infinity;
            arr.filter(a => { if (a < min)
                min = a; });
            return min;
        };
        this.getStockIndex = (ticker) => this.stocks.findIndex(stock => stock.ticker == ticker);
    }
}
exports.default = StockGenerator;
//# sourceMappingURL=StockGenerator.js.map