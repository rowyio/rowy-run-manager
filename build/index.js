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
const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};
// simple use case of connect service
app.post("/", async (req, res) => {
    const { cmds } = req.body;
    const outputs = [];
    await asyncForEach(cmds, async (cmd) => {
        await terminalUtils_1.asyncExecute(cmd, (error, stdout, stderr) => outputs.push({
            cmd,
            error,
            stdout,
            stderr,
        }));
    });
    res.send({ outputs });
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`connect-service: listening on port ${port}!`);
});
// Exports for testing purposes.
module.exports = app;
