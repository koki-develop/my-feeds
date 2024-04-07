terraform {
  backend "s3" {
    bucket  = "my-feeds-tfstates"
    key     = "terraform.tfstate"
    encrypt = true
  }
}
