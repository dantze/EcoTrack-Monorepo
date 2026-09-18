locals {
  prefix = "${var.project_name}-${var.environment}"

  labels = {
    application = var.project_name
    environment = var.environment
    managed_by  = "terraform"
  }

  frontend_origins = concat(
    ["https://${var.vercel_project_name}.vercel.app"],
    [for d in var.web_custom_domains : "https://${d}"],
  )

  cors = join(",", local.frontend_origins)
}

resource "google_project_service" "required" {
  for_each = var.enable_apis ? toset([
    "artifactregistry.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "cloudscheduler.googleapis.com",
    "compute.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "run.googleapis.com",
    "secretmanager.googleapis.com",
    "servicenetworking.googleapis.com",
    "sqladmin.googleapis.com",
    "storage.googleapis.com",
  ]) : toset([])

  project            = var.gcp_project_id
  service            = each.value
  disable_on_destroy = false
}

module "network" {
  source = "./modules/network"

  prefix                = local.prefix
  region                = var.gcp_region
  subnet_cidr           = var.vpc_subnet_cidr
  private_services_cidr = var.vpc_private_services_cidr

  depends_on = [google_project_service.required]
}

module "database" {
  source = "./modules/database"

  prefix                = local.prefix
  region                = var.gcp_region
  labels                = local.labels
  network_id            = module.network.network_id
  engine_version        = var.db_version
  tier                  = var.db_tier
  edition               = var.db_edition
  availability_type     = var.db_availability_type
  disk_size_gb          = var.db_disk_size_gb
  backup_retention_days = var.db_backup_retention_days
  deletion_protection   = var.db_deletion_protection
  db_name               = var.db_name
  db_user               = var.db_user
  db_password           = var.db_password

  depends_on = [module.network, google_project_service.required]
}

module "registry" {
  source = "./modules/registry"

  prefix            = local.prefix
  project_id        = var.gcp_project_id
  region            = var.gcp_region
  repository_id     = var.artifact_repository_id
  image_name        = var.backend_service_name
  keep_recent_count = var.artifact_keep_recent_count
  delete_older_than = var.artifact_max_age
  labels            = local.labels
  description       = "Docker images for the ${var.project_name} Spring Boot backend"

  depends_on = [google_project_service.required]
}

module "iam" {
  source = "./modules/iam"

  prefix                       = local.prefix
  project_id                   = var.gcp_project_id
  project_name                 = var.project_name
  environment                  = var.environment
  artifact_repository_id       = module.registry.repository_id
  artifact_repository_location = module.registry.repository_location
  runtime_secret_ids           = [module.database.password_secret_id]
  deployer_extra_roles         = var.deployer_extra_roles
  create_deployer_key          = var.create_deployer_key

  depends_on = [google_project_service.required]
}

module "storage" {
  source = "./modules/storage"

  prefix                  = local.prefix
  project_id              = var.gcp_project_id
  location                = var.gcp_region
  labels                  = local.labels
  runtime_service_account = module.iam.runtime_email
  force_destroy           = var.photo_bucket_force_destroy

  depends_on = [module.iam, google_project_service.required]
}

module "backend" {
  source = "./modules/backend"

  prefix                    = local.prefix
  project_id                = var.gcp_project_id
  region                    = var.gcp_region
  service_name              = var.backend_service_name
  labels                    = local.labels
  image                     = var.backend_image
  container_port            = var.backend_container_port
  cpu                       = var.backend_cpu
  memory                    = var.backend_memory
  min_instances             = var.backend_min_instances
  max_instances             = var.backend_max_instances
  allow_public_access       = var.backend_allow_public_access
  network_id                = module.network.network_id
  subnetwork_id             = module.network.subnetwork_id
  runtime_service_account   = module.iam.runtime_email
  scheduler_service_account = module.iam.scheduler_email
  spring_profiles_active    = var.spring_profiles_active
  db_host                   = module.database.private_ip
  db_port                   = "5432"
  db_name                   = module.database.db_name
  db_user                   = module.database.db_user
  db_password_secret_id     = module.database.password_secret_id
  jobs                      = var.backend_jobs
  scheduler_time_zone       = var.scheduler_time_zone

  plain_env = merge(
    {
      ECOTRACK_CORS_ALLOWED_ORIGINS = local.cors
      GCS_BUCKET                    = module.storage.bucket_name
    },
    var.backend_env,
  )

  secret_env = var.backend_secrets

  depends_on = [module.database, module.iam, module.storage, google_project_service.required]
}
