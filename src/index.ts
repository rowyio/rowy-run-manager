import express from "express";
import cors from "cors";
import { asyncExecute } from "./terminalUtils";
const app = express();
// json is the default content-type for POST requests
app.use(express.json());
app.use(cors());

const asyncForEach = async (array: any[], callback: (item: any, index: number, array: any[]) => Promise<void>) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

app.post("/", async(req, res) => {

});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`connect-service: listening on port ${port}!`);
});

// Exports for testing purposes.
module.exports = app;
