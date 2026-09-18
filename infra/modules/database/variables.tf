variable "prefix" {
  type = string
}

variable "region" {
  type = string
}

variable "labels" {
  type = map(string)
}

variable "network_id" {
  type = string
}

variable "engine_version" {
  type = string
}

variable "tier" {
  type = string
}

variable "edition" {
  type = string
}

variable "availability_type" {
  type = string
}

variable "disk_size_gb" {
  type = number
}

variable "backup_retention_days" {
  type = number
}

variable "deletion_protection" {
  type = bool
}

variable "db_name" {
  type = string
}

variable "db_user" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}
