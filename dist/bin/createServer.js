"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ioServer = require("socket.io");
var http = require("http");
var https = require("https");
var express = require("express");
var process = require("process");
var fs = require("fs");
var dotenv = require("dotenv");
dotenv.config();
var CreateServer = (function () {
    function CreateServer() {
        var env = process.env;
        this.httpsPort = parseInt(env.HTTPS_PORT);
        this.httpPort = parseInt(env.HTTP_PORT);
        this.devel = env.DEVEL === 'yes';
        this.app_ = express();
        this.origin = (this.devel) ? env.LOCAL_ORIGIN : env.REMOTE_ORIGIN;
    }
    Object.defineProperty(CreateServer.prototype, "application", {
        get: function () {
            return this.app_;
        },
        enumerable: true,
        configurable: true
    });
    CreateServer.prototype.getSSLOptions = function () {
        return {
            key: fs.readFileSync('./ssl/key.pem'),
            cert: fs.readFileSync('./ssl/cert.pem')
        };
    };
    CreateServer.prototype.createHTTPSServer = function (app) {
        var server = new https.Server(this.getSSLOptions(), app);
        server.listen(this.httpsPort);
        return server;
    };
    CreateServer.prototype.createHTTPServer = function (app) {
        var server = new http.Server(app);
        server.listen(this.httpPort);
        return server;
    };
    CreateServer.prototype.createSocketServer = function (app) {
        var io = new ioServer();
        io.attach(this.createHTTPSServer(app));
        io.attach(this.createHTTPServer(app));
        return io;
    };
    return CreateServer;
}());
exports.default = CreateServer;
//# sourceMappingURL=createServer.js.map