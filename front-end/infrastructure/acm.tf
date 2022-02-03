resource "aws_acm_certificate" "acm_certificate" {
  domain_name               = "*.${var.root_domain_name}"
  validation_method         = "DNS"
  subject_alternative_names = ["${var.root_domain_name}"]
}