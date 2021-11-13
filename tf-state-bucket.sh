#export TF_VAR_project="${GOOGLE_CLOUD_PROJECT}"
#export TF_VAR_region="${GOOGLE_CLOUD_REGION}"
#export TF_VAR_tf_state_bucket="${GOOGLE_CLOUD_PROJECT}-rowy-tf-state"
export TF_VAR_project="${GOOGLE_CLOUD_PROJECT}"
export TF_VAR_region="${GOOGLE_CLOUD_REGION}"
export TF_VAR_tf_state_bucket="${GOOGLE_CLOUD_PROJECT}-rowy-tf-state"

# Create bucket if not exists
gsutil ls -b "gs://${TF_VAR_tf_state_bucket}" || gsutil mb -p "${GOOGLE_CLOUD_PROJECT}" -l "${TF_VAR_region}" "gs://${TF_VAR_tf_state_bucket}"
