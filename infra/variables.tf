variable "project_name" {
  description = "Short slug prefixed onto every created resource."
  type        = string
  default     = "ecotrack"

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{1,20}$", var.project_name))
    error_message = "project_name must be 2-21 chars, start with a letter, and contain only lowercase letters, digits and hyphens."
  }
}

variable "environment" {
  description = "Name token in every resource name and label. One deployment exists; this is not the Spring profile, which is spring_profiles_active."
  type        = string
  default     = "dev"

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{1,10}$", var.environment))
    error_message = "environment must be 2-11 chars, start with a letter, and contain only lowercase letters, digits and hyphens."
  }
}

variable "gcp_project_id" {
  description = "GCP project id that owns every resource here."
  type        = string
}

variable "gcp_region" {
  description = "Region for Cloud Run, Cloud SQL, Artifact Registry and the VPC subnet."
  type        = string
  default     = "europe-west1"
}

variable "gcp_zone" {
  description = "Default zone inside gcp_region."
  type        = string
  default     = "europe-west1-b"
}

variable "gcp_credentials_json" {
  description = "Raw JSON of a GCP service-account key. Empty falls through to Application Default Credentials."
  type        = string
  default     = ""
  sensitive   = true
}

variable "enable_apis" {
  description = "Whether Terraform enables the required GCP service APIs."
  type        = bool
  default     = true
}

variable "artifact_repository_id" {
  description = "Artifact Registry Docker repository holding backend images."
  type        = string
  default     = "backend"
}

variable "artifact_keep_recent_count" {
  description = "How many recent backend images to keep. This is the backend rollback window: every merge to main pushes one."
  type        = number
  default     = 40
}

variable "artifact_max_age" {
  description = "Age at which a backend image is deleted regardless of the keep count. KEEP is evaluated first, so this only reaches images already outside it."
  type        = string
  default     = "7776000s"
}

variable "db_name" {
  description = "Application database created inside the instance."
  type        = string
  default     = "ecotrack"
}

variable "db_user" {
  description = "Application database user, not the postgres superuser."
  type        = string
  default     = "ecotrack"
}

variable "db_password" {
  description = "Password for db_user. Leave empty and Terraform generates one and stores it in Secret Manager."
  type        = string
  default     = ""
  sensitive   = true
}

variable "db_version" {
  description = "Cloud SQL Postgres engine version."
  type        = string
  default     = "POSTGRES_16"
}

variable "db_edition" {
  description = "Cloud SQL edition. Shared-core tiers such as db-f1-micro are valid only on ENTERPRISE."
  type        = string
  default     = "ENTERPRISE"

  validation {
    condition     = contains(["ENTERPRISE", "ENTERPRISE_PLUS"], var.db_edition)
    error_message = "db_edition must be ENTERPRISE or ENTERPRISE_PLUS."
  }
}

variable "db_tier" {
  description = "Cloud SQL machine type. db-f1-micro is shared-core and carries no SLA."
  type        = string
  default     = "db-f1-micro"
}

variable "db_disk_size_gb" {
  description = "Initial disk size in GB. Storage auto-resizes upward and never shrinks."
  type        = number
  default     = 10
}

variable "db_availability_type" {
  description = "ZONAL or REGIONAL."
  type        = string
  default     = "ZONAL"

  validation {
    condition     = contains(["ZONAL", "REGIONAL"], var.db_availability_type)
    error_message = "db_availability_type must be ZONAL or REGIONAL."
  }
}

variable "db_backup_retention_days" {
  description = "How many automated backups to retain."
  type        = number
  default     = 7
}

variable "db_deletion_protection" {
  description = "Blocks destroy and console deletion of the SQL instance."
  type        = bool
  default     = true
}

variable "vpc_subnet_cidr" {
  description = "CIDR for the subnet Cloud Run egresses through."
  type        = string
  default     = "10.8.0.0/24"
}

variable "vpc_private_services_cidr" {
  description = "Base address of the /16 reserved for Google-managed services."
  type        = string
  default     = "10.9.0.0"
}

variable "photo_bucket_force_destroy" {
  description = "Allow destroying the photo bucket while it still holds objects."
  type        = bool
  default     = false
}

variable "backend_service_name" {
  description = "Cloud Run service name for the Spring Boot API."
  type        = string
  default     = "backend"
}

variable "backend_image" {
  description = "Image Cloud Run starts. The default is a placeholder so the first apply succeeds before any image exists."
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "backend_container_port" {
  description = "Port the container listens on."
  type        = number
  default     = 8080
}

variable "backend_cpu" {
  description = "CPU per instance, for the service and for each job execution."
  type        = string
  default     = "1"
}

variable "backend_memory" {
  description = "Memory per instance, for the service and for each job execution. 512Mi kills this container at startup: the JVM takes ~25% of the limit as max heap, and Spring Boot with Hibernate and Flyway does not boot in ~128MB."
  type        = string
  default     = "1Gi"
}

variable "backend_min_instances" {
  description = "Instances kept warm. 0 scales to zero between requests."
  type        = number
  default     = 0
}

variable "backend_max_instances" {
  description = "Upper bound on concurrent instances, and a ceiling on Cloud SQL connections."
  type        = number
  default     = 2
}

variable "backend_allow_public_access" {
  description = "Grant roles/run.invoker to allUsers."
  type        = bool
  default     = true
}

variable "backend_jobs" {
  description = "Cloud Run Jobs to create, as job name => Cloud Scheduler cron. The name reaches the container as ECOTRACK_JOB."
  type        = map(string)

  default = {
    generate-tasks = "0 2 * * *"
    prune-sessions = "30 3 * * *"
  }
}

variable "scheduler_time_zone" {
  description = "Time zone the job schedules are read in."
  type        = string
  default     = "Europe/Bucharest"
}

variable "spring_profiles_active" {
  description = "SPRING_PROFILES_ACTIVE for the service; each job appends `job`. Stays `prod` whatever `environment` says - it is what selects Postgres over the H2 file DB."
  type        = string
  default     = "prod"
}

variable "backend_env" {
  description = "Extra non-secret environment variables for the backend container and its jobs."
  type        = map(string)
  default     = {}
}

variable "backend_secrets" {
  description = "Extra secret environment variables. Each key becomes its own Secret Manager secret."
  type        = map(string)
  default     = {}
  sensitive   = true
}

variable "deployer_extra_roles" {
  description = "Additional project-level roles for the CI deployer service account."
  type        = list(string)
  default     = []
}

variable "create_deployer_key" {
  description = "Create a JSON key for the deployer. It is written to state in plaintext and never expires."
  type        = bool
  default     = false
}

variable "vercel_project_name" {
  description = "Vercel project holding the web SPA. Terraform does not create it; the name is what the CORS origin list and frontend_url are computed from. NOT always the project name you chose: *.vercel.app is a global namespace, so a taken name is silently assigned a suffix. Read the real domain off the project and put THAT stem here, or the backend refuses the frontend."
  type        = string
  default     = "ecotrack-web-one"
}

variable "web_custom_domains" {
  description = "Custom domains serving the SPA. Attach them in Vercel; listing them here is what adds them to the backend's allowed CORS origins."
  type        = list(string)
  default     = []
}

