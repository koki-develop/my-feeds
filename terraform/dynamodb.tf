resource "aws_dynamodb_table" "posts" {
  name         = "${local.prefix}-posts"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "url"

  attribute {
    name = "url"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}
