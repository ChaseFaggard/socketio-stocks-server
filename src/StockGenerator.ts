export default class StockGenerator {

    public stocks = [
        { "name": "Nabors Industries Ltd.", "ticker": "NBR", "value": 112.72 },
        { "name": "Apple.", "ticker": "AAPL", "value": 171.33 },
        { "name": "Microsft", "ticker": "MSFT", "value": 306.89 },
        { "name": "Ford Motor Company", "ticker": "F", "value": 24.84 },
        { "name": "Bank of America Corporation", "ticker": "BAC", "value": 47.62 },
        { "name": "AT&T Inc.", "ticker": "T", "value": 27.08 },
        { "name": "NVIDIA Corporation", "ticker": "NVDA", "value": 267.70 },
        { "name": "Berkshire Hathaway Inc. Class A", "ticker": "BRK.A", "value": 483687.03 }
    ]

    public historicalData: any[] = []

    constructor() {
        /* Create historical data */ 
        for(let i = 0; i < this.stocks.length; i++) {
            let ticker = this.stocks[i].ticker
            this.historicalData[<any>ticker] = this.generateHistoricalData([this.stocks[i].ticker])[0]
            this.stocks[i].value = this.historicalData[<any>ticker].data[this.historicalData[<any>ticker].data.length-1].close
        }
        /* Simulates live data change */
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
        for (let i = 0; i < tickers.length; i++) {
            let index = this.getStockIndex(tickers[i])
            if (index > -1) {
                data.push({
                    name: this.stocks[index].name,
                    symbol: this.stocks[index].ticker,
                    currentValue: this.stocks[index].value
                })
            } else { }
        }
        return data
    }

    getHourlyData = (value: number): number[] => {

        let results: number[] = []

        for (let i = 0; i < 24; i++) {
            let val = Math.random() * (value / 25)
            let plusMinus = Math.random() < 0.5 ? -1 : 1
            results.push(value + (val * plusMinus))
        }

        return results
    }

    getOneStock = (value: number, timestamp: string): Object => {
        const data = this.getHourlyData(value)

        return {
            timestamp: timestamp,
            open: data[0],
            high: this.getLargest(data),
            low: this.getSmallest(data),
            close: data[data.length - 1]
        }
    }

    getHistoricalData = (tickers: string[]): Object[] => {
        let results = []
        for(let ticker of tickers) {
            if(this.stocks.some(stock => stock.ticker == ticker)) {
                results.push(this.historicalData[<any>ticker])
            }
        }
        return results
    }

    generateHistoricalData = (tickers: string[]): Object[] => {
        /*Get a week ago*/
        let date: Date = new Date()
        let pastDate = date.getDate() - 365;
        date.setDate(pastDate)

        let result: Object[] = []
        for (let i = 0; i < tickers.length; i++) {
            let stockData = []
            let index = this.getStockIndex(tickers[i])
            let stock = this.stocks[index]
            if (index > -1) {
                let nextDate: Date = new Date(date)
                let value = stock.value
                for (let i = 1; i <= 365; i++) {
                    if(this.checkWeekend(nextDate) == true)
                    {
                        stockData.push(this.getOneStock(value, nextDate.toISOString()))
                        value = (stockData[stockData.length-1] as any).close
                    }
                    nextDate = new Date(date)
                    nextDate.setDate(date.getDate() + i)
                }
                result.push({
                    name: stock.name,
                    symbol: stock.ticker,
                    data: stockData
                })
            }
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