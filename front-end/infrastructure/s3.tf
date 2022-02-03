resource "aws_s3_bucket" "static_website_bucket" {
  bucket = var.bucket_domain_name
  acl    = "public-read"

  policy = <<POLICY
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::${var.bucket_domain_name}/*"]
    }
  ]
}
POLICY

  website {
    index_document = "index.html"
    error_document = "404.html"
  }
}