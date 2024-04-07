import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { logger } from "./log";

const db = new DynamoDBClient({ region: "us-east-1" });

const tables = {
  posts: "my-feeds-posts",
} as const;

export const saveItem = async (url: string) => {
  logger.info("Saving item...", { url });
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() + 1);
  const ttl = Math.floor(date.getTime() / 1000);

  await db.send(
    new PutItemCommand({
      TableName: tables.posts,
      Item: {
        url: { S: url },
        ttl: { N: ttl.toString() },
      },
    })
  );
  logger.info("Saved item", { url });
};

export const existsItem = async (url: string) => {
  const response = await db.send(
    new GetItemCommand({
      TableName: tables.posts,
      Key: {
        url: { S: url },
      },
    })
  );

  return response.Item != null;
};
