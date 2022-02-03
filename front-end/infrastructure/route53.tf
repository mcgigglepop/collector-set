data "aws_route53_zone" "zone" {
  name                      = var.root_domain_name
  private_zone              = false
}

resource "aws_route53_record" "route53_a_record" {
  zone_id                   = data.aws_route53_zone.zone.zone_id
  name                      = var.bucket_domain_name
  type                      = "A"

  alias = {
    name                    = aws_cloudfront_distribution.cloudfront_distribution.domain_name
    zone_id                 = aws_cloudfront_distribution.cloudfront_distribution.hosted_zone_id
    evaluate_target_health  = false
  }
}