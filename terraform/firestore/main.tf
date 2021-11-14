

# resource "google_project" "gcp_project" {
#   name = var.project_id
#   project_id = var.project_id
# }
resource "google_app_engine_application" "firestore" {
 project = var.project_id
  database_type = "CLOUD_FIRESTORE"
  location_id = var.region
}
