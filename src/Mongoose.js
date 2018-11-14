"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var vars_1 = require("./configs/vars");
mongoose.connection.on('error', function (err) {
    console.error("MongoDB connection error: " + err);
    process.exit(-1);
});
if (vars_1.env === 'development') {
    mongoose.set('debug', true);
}
exports.connectMongoDb = function () {
    mongoose.connect(vars_1.mongo.uri, {
        keepAlive: 1,
        useMongoClient: true
    });
    return mongoose.connection;
};
//# sourceMappingURL=Mongoose.js.map