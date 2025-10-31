# Variables for Terraform configuration

variable "bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
}

# New variable for additional bucket name
variable "additional_bucket_name" {
  description = "The name of the additional S3 bucket"
  type        = string
}