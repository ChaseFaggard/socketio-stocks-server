"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http = __importStar(require("http"));
const StockGenerator_1 = __importDefault(require("./StockGenerator"));
class StockServer {
    constructor() {
        this.stockGen = new StockGenerator_1.default();
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }
    createApp() {
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)());
    }
    config() {
        this.port = process.env.PORT || StockServer.PORT;
    }
    createServer() {
        this.server = http.createServer(this.app);
    }
    sockets() {
        this.io = require('socket.io')(this.server, { cors: { origins: '*' } });
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket) => {
            console.log(`New Client Connected. Id: ${socket.id}`);
            /* Ping check */
            socket.on('ping', () => socket.emit('ping'));
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
            socket.on('getData', (request) => {
                let response = {};
                switch (request['request-type']) {
                    case 'live':
                        const data = this.stockGen.getLiveData(request.symbols);
                        response = {
                            'response-type': 'live',
                            data: data
                        };
                        break;
                    case 'historical':
                        break;
                    case 'list':
                        response = {
                            'response-type': 'list',
                            symbols: this.stockGen.getTickers()
                        };
                        break;
                }
                socket.emit('getData', response);
            });
            /* Disconnect */
            socket.on('disconnect', () => {
                console.log(`Client disconnected. ID: ${socket.id}`);
            });
        });
    }
    getApp() {
        return this.app;
    }
}
exports.StockServer = StockServer;
StockServer.PORT = 8080; // Default local port
//# sourceMappingURL=StockServer.js.map