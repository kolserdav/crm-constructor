"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("../bin/server");
var assert = require("assert");
var request = require("supertest");
var server = new server_1.default();
var ExpressTest = (function () {
    function ExpressTest(count) {
        this.count = count;
        this.routerTest();
        this.getSSLOptionsTest();
    }
    ExpressTest.prototype.routerTest = function () {
        this.count++;
        console.info(this.count + " : Testing route /test...");
        request(server.app)
            .get('/test')
            .expect('Content-Type', /json/)
            .expect('x-powered-by', /constructor/)
            .expect('Content-Length', '33')
            .expect(this.hasTestKeys)
            .expect(/Success/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                throw err;
        });
    };
    ExpressTest.prototype.getSSLOptionsTest = function () {
        this.count++;
        console.info(this.count + " : Testing getSSLOptions method...");
        assert.doesNotThrow(server.getSSLOptions.bind(server));
    };
    ExpressTest.prototype.hasTestKeys = function (res) {
        if (!('result' in res.body))
            throw new Error("missing result key");
        if (!('error' in res.body))
            throw new Error("missing error key");
    };
    return ExpressTest;
}());
exports.default = ExpressTest;
//# sourceMappingURL=express.spec.js.map