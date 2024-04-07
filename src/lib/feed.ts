import Parser from "rss-parser";
import { logger } from "./log";

const parser = new Parser();

export type Item = {
  title: string;
  content: string;
  url: string;
};

export const fetchGitHubFeedItems = async (): Promise<Item[]> => {
  logger.info("Fetching GitHub feed items.");
  const feed = await parser.parseURL("https://github.blog/changelog/feed/");
  logger.info("Fetched GitHub feed items.");

  return feed.items.map((item) => ({
    title: item.title as string,
    content: item["content:encoded"] as string,
    url: item.link as string,
  }));
};
