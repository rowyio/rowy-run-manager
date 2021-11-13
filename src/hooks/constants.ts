const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT

export const tf_state_bucket = `${GOOGLE_CLOUD_PROJECT}-rowy-tf-state`

export const firestoreRegions = [
    "asia-south1",
    "asia-southeast1",
    "asia-southeast2",
    "asia-east2",
    "asia-east1",
    "asia-northeast1",
    "asia-northeast2",
    "asia-northeast3",
    "australia-southeast1",
    "southamerica-east1",
    "europe-west2",
    "europe-west3",
    "europe-central2",
    "europe-west6",
    "us-west1",
    "us-west2",
    "us-west3",
    "us-west4",
    "northamerica-northeast1",
    "us-east1",
    "us-east4",
  ];