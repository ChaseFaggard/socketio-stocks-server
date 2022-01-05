import express from 'express'
import cors from 'cors'
import * as http from 'http'
import SocketIO from 'socket.io'

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
            console.log(`New Client Connected. Id: ${socket.id}`)

            /* Ping check */
            socket.on('ping', () => socket.emit('ping'))

            /* Request type
            socket.on('requestType', (requestType: string) => {
                let response: Object = { }
                switch(requestType) {
                    case 'list':
                        response = {
                            'response-type': 'list',
                            'symbols': ['ABC', 'XYZ', 'LMNO']
                        }
                        break
                    case 'historical':
                        response = {
                            'response-type': 'historical',
                            'symbols': ['ABC', 'XYZ', 'LMNO'],
                            'start': 'yyyy-MM-dd HH:mm:ss'
                        }
                        break
                    case 'live':
                        response = {
                            'response-type': 'live',
                            'symbols': ['ABC', 'XYZ']
                        }
                        break
                    default: 
                        break
                }
                socket.emit('requestType', response)
            }) */

            socket.on('getData', (request: {'request-type': string, symbols?: string[], start?: string}) => {
                let response: Object = { }
                switch(request['request-type']) {
                    case 'live':
                        const data = this.stockGen.getLiveData(request.symbols)
                        response = {
                            'response-type': 'live',
                            data: data
                        }
                        break
                    case 'historical':
                        break
                    case 'list':
                        response = {
                            'response-type': 'list',
                            symbols: this.stockGen.getTickers()
                        }
                        break 
                }
                socket.emit('getData', response)
            })


            /* Disconnect */
            socket.on('disconnect', () => {
                console.log(`Client disconnected. ID: ${socket.id}`)
            }) 
            
        })


    }

    public getApp(): express.Application {
        return this.app
    }
}