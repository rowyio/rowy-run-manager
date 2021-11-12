
import express from 'express'
import cors from "cors";
import {asyncExecute} from './terminalUtils'
const app = express();
// json is the default content-type for POST requests
app.use(express.json());
app.use(cors());

// simple use case of connect service
app.get('/', (req, res) => {
    asyncExecute("terraform -v",(error:any, stdout:string)=>{
      res.send(stdout);
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`connect-service: listening on port ${port}!`);
});


// Exports for testing purposes.
module.exports = app;
