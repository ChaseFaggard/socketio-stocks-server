import { getDateFromStr } from "./Utils"

export default class StockGenerator {

    public stocks = [
        { "ticker": "NBR", "value": 83.72 },
        { "ticker": "ABC", "value": 2813.41 },
        { "ticker": "XYZ", "value": 14.91 }
    ]

    constructor() {
        // Simulates live data change
        setInterval(() => {
            for (let i = 0; i < this.stocks.length; i++) {
                let val = Math.random() * (this.stocks[i].value / 1500)
                let plusMinus = Math.random() < 0.5 ? -1 : 1
                let value = this.stocks[i].value + (val * plusMinus)
                let roundedVal = Math.round(value * 100) / 100
                this.stocks[i].value = roundedVal
            }
        }, 1000)
    }

    getLiveData = (tickers: string[]): Object => {
        let data: Object[] = []
        for (let ticker of tickers) {
            let index = this.getStockIndex(ticker)
            if (index > -1) {
                data.push({
                    symbol: ticker,
                    currentValue: this.stocks[index].value
                })
            } else { }
        }
        return data
    }

    getHourlyData = (ticker: string): number[] => {

        const index = this.getStockIndex(ticker)

        let results: number[] = []

        for (let i = 0; i < 24; i++) {
            let val = Math.random() * (this.stocks[index].value / 4)
            let plusMinus = Math.random() < 0.5 ? -1 : 1
            results.push(this.stocks[index].value + (val * plusMinus))
        }

        return results
    }

    getOneStock = (ticker: string, timestamp: string): Object => {
        const data = this.getHourlyData(ticker)

        return {
            symbol: ticker,
            data: [{
                timestamp: timestamp,
                open: data[0],
                high: this.getLargest(data),
                low: this.getSmallest(data),
                close: data[data.length - 1]
            }]
        }
    }

    getHistoricalData = (tickers: string[]): Object[] => {
        /*Get a week ago*/
        let date: Date = new Date()
        let pastDate = date.getDate() - 365;
        date.setDate(pastDate)

        let result: Object[] = []
        for (let ticker of tickers) {
            let stockData = []
            let index = this.getStockIndex(ticker)
            if (index > -1) {
                let nextDate: Date = new Date(date)
                for (let i = 1; i <= 365; i++) {
                    if(this.checkWeekend(nextDate) == true)
                    {
                        stockData.push(this.getOneStock(ticker, nextDate.toISOString()))
                    }
                    nextDate = new Date(date)
                    nextDate.setDate(date.getDate() + i)
                }
                result.push(stockData)
            } else result.push({ 'error': 'Ticker not available' })
        }
        return result
    }

    checkWeekend(day:Date): boolean{
      let dt = new Date(day)
      
      if(dt.getDay() == 6 || dt.getDay() == 0){
          return false
      }
      else
        return true
    }

    

    getTickers = (): string[] => {
        let result: string[] = []
        for (let i = 0; i < this.stocks.length; i++) result.push(this.stocks[i].ticker)
        return result
    }

    getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min)

    getLargest = (arr: number[]): number => {
        let max = -Infinity
        arr.filter(a => { if (a > max) max = a })
        return max
    }

    getSmallest = (arr: number[]): number => {
        let min = Infinity
        arr.filter(a => { if (a < min) min = a })
        return min
    }

    getStockIndex = (ticker: string): number => this.stocks.findIndex(stock => stock.ticker == ticker)

}