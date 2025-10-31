FILE: main.tf
# Main Terraform configuration file

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-unique-bucket-name"
}

# New S3 bucket for additional resources
resource "aws_s3_bucket" "additional_bucket" {
  bucket = "my-additional-bucket-name"
}

FILE: variables.tf
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

FILE: outputs.tf
# Outputs for Terraform configuration

output "bucket_id" {
  value = aws_s3_bucket.my_bucket.id
}

# New output for additional bucket ID
output "additional_bucket_id" {
  value = aws_s3_bucket.additional_bucket.id
}

FILE: terraform.tfvars
# Terraform variables values

bucket_name = "my-unique-bucket-name"

# New variable value for additional bucket
additional_bucket_name = "my-additional-bucket-name"