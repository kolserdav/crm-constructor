"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_spec_1 = require("./server.spec");
var createServer_spec_1 = require("./createServer.spec");
console.info('\nStart testing module.\n');
var instance = {
    count: 0
};
var poolOfFunctions = [
    function (count, pool) { return new server_spec_1.default(count, pool); },
    function (count, pool) { return new createServer_spec_1.default(count, pool); },
    function (count, pool) { return console.info("\nSuccess: [ " + instance.count + " ] modules was tested!\n"); }
];
var functionStart = poolOfFunctions[instance.count];
functionStart(instance.count, poolOfFunctions);
//# sourceMappingURL=index.spec.js.map