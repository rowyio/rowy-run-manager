import { asyncExecute } from "../terminalUtils"
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT

const tf_state_bucket = `${GOOGLE_CLOUD_PROJECT}-rowy-tf-state`
const region = process.env.GOOGLE_CLOUD_REGION
asyncExecute(`gsutil ls -b "gs://${tf_state_bucket}" || gsutil mb -p "${GOOGLE_CLOUD_PROJECT}" -l "${region}" "gs://${tf_state_bucket}"`,()=>{})