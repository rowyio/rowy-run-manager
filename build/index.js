"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const terminalUtils_1 = require("./terminalUtils");
let initialized = false;
const app = express_1.default();
// json is the default content-type for POST requests
app.use(express_1.default.json());
app.use(cors_1.default());
const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};
app.post("/update/:resource", async (req, res) => {
});
app.post("/", async (req, res) => {
    const { cmds } = req.body;
    const result = [];
    await asyncForEach(cmds, async (cmd) => {
        await terminalUtils_1.asyncExecute(cmd, (error, stdout, stderr) => result.push({
            error,
            stdout,
            stderr,
        }));
    });
    return res.send({ result });
});
const port = process.env.PORT || 8080;
app.listen(port, async () => {
    console.log(`rowy-run-manager: listening on port ${port}!`);
    await asyncForEach([
        "git init",
        "git remote add origin https://github.com/rowyio/rowy-run-manager.git",
        "git fetch"
    ], async (cmd) => {
        await terminalUtils_1.asyncExecute(cmd, (error, stdout, stderr) => { });
    });
    initialized = true;
    console.log("rowy-run-manager: initialized");
});
// Exports for testing purposes.
module.exports = app;
