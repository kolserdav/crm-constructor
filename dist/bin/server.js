"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var createServer_1 = require("./createServer");
var Server = (function (_super) {
    __extends(Server, _super);
    function Server() {
        var _this = _super.call(this) || this;
        _this.app = _this.router(_this.application);
        return _this;
    }
    Server.prototype.router = function (expressApp) {
        var app = expressApp;
        app.get('/test', function (req, res) {
            res.status(200);
            res.set({
                'Content-Type': 'application/json',
                'x-powered-by': 'crm-constructor'
            });
            res.send(JSON.stringify({ result: 'Success', error: null }));
        });
        return app;
    };
    Server.prototype.socketServer = function () {
        var _this = this;
        var io = _super.prototype.createSocketServer.call(this, this.app);
        io.on('connection', function (socket) {
            socket.on('my', function (data) {
                console.log(data);
            });
            socket.emit('env', JSON.stringify({ DEVEL: _this.devel }));
        });
    };
    return Server;
}(createServer_1.default));
exports.default = Server;
//# sourceMappingURL=server.js.map