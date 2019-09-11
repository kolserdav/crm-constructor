var fs = require("fs");
var options = {
    hostname: 'https://localhost:3000/',
    port: 443,
    path: '/',
    method: 'GET',
    key: fs.readFileSync("ssl/key.pem"),
    cert: fs.readFileSync("ssl/cert.pem")
};
var app = require("https").createServer(options);
var io = require("socket.io").listen(app);
app.listen(3002);
//# sourceMappingURL=servernew.js.map