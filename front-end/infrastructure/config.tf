provider "aws" {
    region                  = "us-east-1"
    shared_credentials_file = "~/.aws/credentials"
    profile                 = "AWS_PROFILE"    
}
terraform {
    backend "s3" {
        profile             = "AWS_PROFILE"
        bucket              = "REMOTE_STATE_BUCKET"
        key                 = "REMOTE_STATE_KEY.tfstate"
        region              = "us-east-1"
    }
}

data "aws_region" "current" {}