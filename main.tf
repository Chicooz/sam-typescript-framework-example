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