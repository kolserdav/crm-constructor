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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("../bin/server");
var request = require("supertest");
var openSocket = require("socket.io-client");
var ServerTest = (function (_super) {
    __extends(ServerTest, _super);
    function ServerTest(count, pool) {
        var _this = _super.call(this) || this;
        _this.fileName = '<server.ts>';
        _this.attemptCount = 5;
        console.info(" --- File " + _this.fileName + " is being tested --- ");
        _this.count = count + 1;
        _this.pool = pool;
        _this.methodsWrapper();
        return _this;
    }
    ServerTest.prototype.methodsWrapper = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.routerTest()];
                    case 1:
                        _a.sent();
                        return [4, this.socketServerTest()];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    ServerTest.prototype.routerTest = function () {
        console.info(this.fileName + " : Testing route /test...");
        request(this.app)
            .get('/test')
            .expect('Content-Type', /json/)
            .expect('x-powered-by', /constructor/)
            .expect('Content-Length', '33')
            .expect(ServerTest.hasTestKeys)
            .expect(/Success/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                throw err;
        });
    };
    ServerTest.prototype.socketServerTest = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, new Promise(function (resolve, reject) {
                            console.info(_this.fileName + " : Testing socketServer...");
                            var url = _this.origin + ":" + _this.httpsPort;
                            var socket = openSocket.connect(url, {
                                transports: ['websocket'],
                                rejectUnauthorized: false,
                                timeout: 3000
                            });
                            socket.open();
                            socket.on('connect', function () {
                                socket.close();
                                resolve("Success test websocket connect server to " + url + ".");
                            });
                            socket.on('reconnect_attempt', function (attemptNumber) {
                                if (attemptNumber >= _this.attemptCount) {
                                    throw new Error("wss request to  <" + url + "> error: maximum number of server accesses exceeded: " + _this.attemptCount);
                                }
                            });
                        })];
                    case 1:
                        result = _a.sent();
                        console.info(result);
                        return [4, this.next()];
                    case 2:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    ServerTest.prototype.next = function () {
        var pool = this.pool;
        if (this.pool[this.count])
            this.pool[this.count](this.count, pool);
    };
    ServerTest.hasTestKeys = function (res) {
        if (!('result' in res.body))
            throw new Error("missing result key");
        if (!('error' in res.body))
            throw new Error("missing error key");
    };
    return ServerTest;
}(server_1.default));
exports.default = ServerTest;
//# sourceMappingURL=server.spec.js.map