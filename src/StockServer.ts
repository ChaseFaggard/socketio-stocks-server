import express from 'express'
import cors from 'cors'
import * as http from 'http'
import SocketIO, { Socket } from 'socket.io'

import StockGenerator from './StockGenerator'

export class StockServer {

    public static readonly PORT: number = 8080 // Default local port

    private app: express.Application
    private server: http.Server
    private io: SocketIO.Server
    private port: string | number

    private stockGen = new StockGenerator()

    constructor() {
        this.createApp()
        this.config()
        this.createServer()
        this.sockets()
        this.listen()
    }

    private createApp(): void {
        this.app = express()
        this.app.use(cors())
    }

    private config(): void {
        this.port = process.env.PORT || StockServer.PORT
    }

    private createServer(): void {
        this.server = http.createServer(this.app)
    }

    private sockets(): void {
        this.io = require('socket.io')(this.server, { cors: { origins: '*' } })
    }

    private listen(): void {

        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port)
        })

        this.io.on('connect', (socket: any) => {
            let liveInterval:NodeJS.Timer;
            //Interval time is in seconds, since setInterval works in milliseconds
            let intervalTime:number = 5;

            console.log(`New Client Connected. Id: ${socket.id}`)

            /* Ping check */
            socket.on('ping', () => socket.emit('ping'))

            socket.on('startLive', (symbols: string[]) => {
                /* Send it out once first */
                socket.emit('liveData', {
                    'response-type': 'live',
                    data: this.stockGen.getLiveData(symbols)
                })
                /* Send on an interval */
                liveInterval = setInterval(() => {
                    socket.emit('liveData', {
                        'response-type': 'live',
                        data: this.stockGen.getLiveData(symbols)
                    })
                }, 1000 * intervalTime)
            })

            socket.on('historicalData', (symbols:string[]) => {
                socket.emit('historicalData', {
                    'response-type': 'historical',
                    data: this.stockGen.getHistoricalData(symbols)
                })
            })

            socket.on('listData', () => {
                socket.emit('listData', {
                    'response-type': 'list',
                    symbols: this.stockGen.getTickers()
                })
                
            })

            /* Changes live data interval */
            socket.on('changeInterval', (interval:number) => {
                intervalTime = interval; 
            })


            /* Disconnect */
            socket.on('disconnect', () => {
                console.log(`Client disconnected. ID: ${socket.id}`)
                clearInterval(liveInterval)
            }) 
            
        })


    }

    public getApp(): express.Application {
        return this.app
    }
    
}