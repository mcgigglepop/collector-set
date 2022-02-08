# variable "service" {
#     description = "Application service name"
# }

# variable "environment" {
#     description = "Application deployment environment"
# }

variable "root_domain_name" {
    description = "naked domain for route53"
    default     = "thecollectorset.com"
}

variable "bucket_name" {
    default     = "thecollectorset.com"
}