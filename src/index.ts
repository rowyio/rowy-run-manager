import express from "express";
import cors from "cors";
import { asyncExecute } from "./terminalUtils";

let initialized = false;
const app = express();
// json is the default content-type for POST requests
app.use(express.json());
app.use(cors());

const asyncForEach = async (
  array: any[],
  callback: (item: any, index: number, array: any[]) => Promise<void>
) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

app.post("/update/:resource", async(req, res) => {

});

app.post("/", async (req, res) => {
  
});

const port = process.env.PORT || 8080;
app.listen(port, async () => {
  console.log(`rowy-run-manager: listening on port ${port}!`);
  await asyncForEach([
    "git init",
    "git remote add origin https://github.com/rowyio/rowy-run-manager.git",
    "git fetch"
  ], async (cmd: string) => {
    await asyncExecute(
      cmd,
      (error: string, stdout: string, stderr: string) => {}
    );
  });
  initialized = true;
  console.log("rowy-run-manager: initialized");
});

// Exports for testing purposes.
module.exports = app;
