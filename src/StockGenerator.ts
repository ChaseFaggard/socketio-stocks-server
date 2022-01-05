export default class StockGenerator {

    public stocks = [
        { "ticker": "NBR", "value": 83.72 },
        { "ticker": "ABC", "value": 2813.41 },
        { "ticker": "XYZ", "value": 14.91 }
    ]

    constructor() { }

    getHourlyData = (ticker: string): number[] => {

        const index = this.getStockIndex(ticker)

        let results: number[] = []

        for(let i = 0; i < 24; i++) {
            let val = Math.random() * (this.stocks[index].value/4)
            let plusMinus = Math.random() < 0.5 ? -1 : 1
            results.push(this.stocks[index].value + (val * plusMinus))
        }

        return results
    }

    getOneStock = (ticker: string, timestamp: string) => {
        const data = this.getHourlyData(ticker)

        return {
            symbol: ticker,
            data: [{
                timestamp: timestamp,
                open: data[0],
                high: this.getLargest(data),
                low: this.getSmallest(data),
                close: data[data.length-1]
            }]
        }
    }

    getLiveData = (tickers: string[]): Object => {
        let result: Object[] = []
        for(let ticker of tickers) {
            let index = this.getStockIndex(ticker)
            if(index > -1) { 
                result.push(this.getOneStock(ticker, new Date().toISOString()))
            } else result.push({'error':'Ticker not available'})
        }
        return result
    }

    getHistoricalData = () => {

    }

    getTickers = (): string[] => {
        let result: string[] = []
        for(let i = 0; i < this.stocks.length; i++) result.push(this.stocks[i].ticker)
        return result
    }

    getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min)

    getLargest = (arr: number[]): number => {
        let max = -Infinity
        arr.filter( a => { if(a > max) max = a })
        return max
    }

    getSmallest = (arr: number[]): number => {
        let min = Infinity
        arr.filter( a => { if(a < min) min = a })
        return min
    }

    getStockIndex = (ticker: string): number => this.stocks.findIndex(stock => stock.ticker == ticker)

}