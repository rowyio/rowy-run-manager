"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const terminalUtils_1 = require("./terminalUtils");
const app = express_1.default();
// json is the default content-type for POST requests
app.use(express_1.default.json());
app.use(cors_1.default());
// simple use case of connect service
app.get('/', (req, res) => {
    terminalUtils_1.asyncExecute("terraform -v", (error, stdout) => {
        res.send(stdout);
    });
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`connect-service: listening on port ${port}!`);
});
// Exports for testing purposes.
module.exports = app;
