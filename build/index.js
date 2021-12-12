"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const terminalUtils_1 = require("./terminalUtils");
const metadataService_1 = require("./metadataService");
const meta = require('../package.json');
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
    try {
        const { resource } = req.params;
        const { files, branch, region } = req.body;
        const _branch = branch ?? "main";
        const projectId = await metadataService_1.getProjectId();
        const tf_state_bucket = `${projectId}-rowy-tf-state`;
        const tf_folder = `-chdir=terraform/${resource}`;
        const tf_vars = [
            `-var="project_id=${projectId}"`,
            `-var="region=${region}"`,
            `-var="tf_state_bucket=${tf_state_bucket}"`,
            `-var="application=${resource}"`,
            `-var="environment=${_branch}"`,
        ];
        const tf_init_args = [
            tf_folder,
            ...tf_vars,
            `-backend-config="bucket=${tf_state_bucket}"`,
            `-backend-config="prefix=${resource}/${_branch}"`,
        ];
        const tf_apply_args = [
            tf_folder,
            ...tf_vars,
            `-auto-approve`,
            `-lock=false`,
        ];
        await terminalUtils_1.asyncExecute(`mkdir terraform/${resource}`, () => { });
        await asyncForEach(files, async (file) => {
            await terminalUtils_1.asyncExecute(`curl https://raw.githubusercontent.com/rowyio/terraforms/${_branch}/${resource}/${file} --output ./terraform/${resource}/${file}`, () => { });
        });
        const initExitCode = await terminalUtils_1.asyncSpawn(`terraform init`, tf_init_args);
        const applyExitCode = await terminalUtils_1.asyncSpawn(`terraform apply`, tf_apply_args);
        console.log({ initExitCode, applyExitCode });
        res.sendStatus(200);
    }
    catch (error) {
        res.send({ error });
    }
});
app.post("/deploy", async (req, res) => {
    try {
        const { region, branch, memory, name } = req.body;
        const projectId = await metadataService_1.getProjectId();
        // const region = "us-central1";
        // const memory = "1Gi";
        // const name = "rowy-hooks";
        // additional dependencies
        const additionalDependencies = ["faker", "date-fns"];
        //time each step
        const start = new Date();
        // clone the repo
        await terminalUtils_1.asyncExecute(`git clone --single-branch --branch ${branch ?? "main"} https://github.com/rowyio/${name}.git`, () => { });
        const endClone = new Date();
        console.log(`Cloned in ${endClone.getTime() - start.getTime()}ms`);
        // install dependencies
        const startNpm = new Date();
        await terminalUtils_1.asyncExecute(`cd ${name} && npm install`, () => { });
        const endNpm = new Date();
        await terminalUtils_1.asyncExecute(`cd ${name} && npm install ${additionalDependencies.join(" ")}`, () => { });
        console.log(`Installed dependencies in ${endNpm.getTime() - startNpm.getTime()}ms`);
        const startBuild = new Date();
        // deploy the app with ./deploy.sh
        await terminalUtils_1.asyncExecute(`cd ${name} && ./deploy.sh --project ${projectId}`, () => { });
        const endBuild = new Date();
        console.log(`Deployed in ${endBuild.getTime() - startBuild.getTime()}ms`);
        const startDeploy = new Date();
        await terminalUtils_1.asyncExecute(`cd ${name} && gcloud run deploy ${name} --image gcr.io/${projectId}/${name} --platform managed --memory ${memory} --region ${region} --allow-unauthenticated`, () => { });
        const endDeploy = new Date();
        console.log(`Deployed in ${endDeploy.getTime() - startDeploy.getTime()}ms`);
        res.sendStatus(200);
    }
    catch (error) {
        res.send({ error });
    }
});
// version
app.get("/version", async (req, res) => res.send({ version: meta.version }));
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
