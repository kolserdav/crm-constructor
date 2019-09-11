"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("../bin/server");
var assert = require("assert");
var server = new server_1.default();
var SSLOptionsTest = (function () {
    function SSLOptionsTest(count) {
        this.count = count + 1;
        console.info(this.count + " : Testing getSSLOptions method...");
        assert.doesNotThrow(server.getSSLOptions.bind(server));
    }
    return SSLOptionsTest;
}());
exports.default = SSLOptionsTest;
//# sourceMappingURL=sslOptions.spec.js.map