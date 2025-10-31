# Outputs for Terraform configuration

output "bucket_id" {
  value = aws_s3_bucket.my_bucket.id
}

# New output for additional bucket ID
output "additional_bucket_id" {
  value = aws_s3_bucket.additional_bucket.id
}