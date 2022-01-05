"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const StockServer_1 = require("./StockServer");
let app = new StockServer_1.StockServer().getApp();
exports.app = app;
//# sourceMappingURL=server.js.map