import Parser from "rss-parser";
import { logger } from "./log";

const parser = new Parser();

export type Item = {
  title: string;
  content: string;
  url: string;
};

export type Feed = {
  name: string;
  url: string;
};

export const feeds = {
  aws: {
    name: "AWS Recent Announcements",
    url: "https://aws.amazon.com/about-aws/whats-new/recent/feed/",
  },
  github: {
    name: "GitHub Changelogs Archive",
    url: "https://github.blog/changelog/feed/",
  },
} as const;

export const fetchGitHubFeedItems = async (): Promise<[Feed, Item[]]> => {
  logger.info("Fetching GitHub feed items.");
  const feed = await parser.parseURL(feeds.github.url);
  logger.info("Fetched GitHub feed items.");

  return [
    feeds.github,
    feed.items.map((item) => ({
      title: item.title as string,
      content: item["content:encoded"] as string,
      url: item.link as string,
    })),
  ];
};

export const fetchAWSFeedItems = async (): Promise<[Feed, Item[]]> => {
  logger.info("Fetching AWS feed items.");
  const feed = await parser.parseURL(
    "https://aws.amazon.com/about-aws/whats-new/recent/feed/"
  );
  logger.info("Fetched AWS feed items.");

  return [
    feeds.aws,
    feed.items.map((item) => ({
      title: item.title as string,
      content: item.content as string,
      url: item.link as string,
    })),
  ];
};
