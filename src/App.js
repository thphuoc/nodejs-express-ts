"use strict";
exports.__esModule = true;
var vars_1 = require("./configs/vars");
var Express_1 = require("./Express");
var Mongoose_1 = require("./Mongoose");
Mongoose_1.connectMongoDb();
Express_1["default"].listen(vars_1.port, function () { return console.info("server started on port " + vars_1.port + " (" + vars_1.env + ")"); });
//# sourceMappingURL=App.js.map