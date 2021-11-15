import express from "express";
import cors from "cors";
import { asyncExecute } from "./terminalUtils";
import { getProjectId } from "./metadataService";

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
  const { resource } = req.params;
  const { files,branch,region } = req.body;
  const projectId = await getProjectId()
  const tf_state_bucket = `${projectId}-rowy-tf-state`
  const tf_vars = `-var="project_id=${projectId}" -var="region=${region}" -var="tf_state_bucket=${tf_state_bucket}" -var="application=${resource}" -var="environment=${branch}"` 
  await asyncExecute(`mkdir terraform/${resource}`,()=>{})
  await asyncForEach(files, async (file) => {
    await asyncExecute(`curl https://raw.githubusercontent.com/rowyio/rowy-run-manager/origin/${branch}/terraform/${resource}/${file} --output ./terraform/${resource}/${file}`,()=>{})
  })
  await asyncExecute(`terraform -chdir=terraform/${resource} init ${tf_vars} -backend-config="bucket=${tf_state_bucket}" -backend-config="prefix=${resource}/${branch}"`, () => {});
  await asyncExecute(`terraform -chdir=terraform/${resource} apply -auto-approve ${tf_vars}`,()=>{})

  res.sendStatus(200);
});

app.post("/", async (req, res) => {

});

const port = process.env.PORT || 8080;
app.listen(port, async () => {
  console.log(`rowy-run-manager: listening on port ${port}!`);
  // await asyncForEach([
  //   "git init",
  //   "git remote add origin https://github.com/rowyio/rowy-run-manager.git",
  //   "git fetch"
  // ], async (cmd: string) => {
  //   await asyncExecute(
  //     cmd,
  //     (error: string, stdout: string, stderr: string) => {}
  //   );
  // });
  // initialized = true;
  // console.log("rowy-run-manager: initialized");
});

// Exports for testing purposes.
module.exports = app;
