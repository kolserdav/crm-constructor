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
var createServer_1 = require("../bin/createServer");
var assert = require("assert");
var ServerTest = (function (_super) {
    __extends(ServerTest, _super);
    function ServerTest(count, pool) {
        var _this = _super.call(this) || this;
        _this.fileName = '<createServer.ts>';
        console.info(" --- File " + _this.fileName + " is being tested --- ");
        _this.count = count + 1;
        _this.pool = pool;
        _this.getSSLOptionsTest();
        return _this;
    }
    ServerTest.prototype.next = function () {
        var pool = this.pool;
        if (this.pool[this.count])
            this.pool[this.count](this.count, pool);
    };
    ServerTest.prototype.getSSLOptionsTest = function () {
        console.info(this.count + " : Testing getSSLOptions method...");
        assert.doesNotThrow(_super.prototype.getSSLOptions.bind(this));
        this.next();
    };
    return ServerTest;
}(createServer_1.default));
exports.default = ServerTest;
//# sourceMappingURL=createServer.spec.js.map