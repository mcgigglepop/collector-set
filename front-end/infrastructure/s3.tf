resource "aws_s3_bucket" "front-end" {
  bucket = var.bucket_name
  acl    = "public-read"
  policy = <<EOF
{
  "Version":"2012-10-17",
  "Statement":[{
        "Sid":"PublicReadForGetBucketObjects",
        "Effect":"Allow",
          "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::${var.bucket_name}/*"]
    }
  ]
}
EOF

  force_destroy = true

  website {
    index_document = "index.html"
    error_document = "404.html"
  }
}


resource "null_resource" "build" {
  provisioner "local-exec" {
    command = "aws s3 cp ./index.html s3://${var.bucket_name} --profile management"
  }

  depends_on = [aws_s3_bucket.front-end]
}