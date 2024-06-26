import { Block, HeaderBlock, SectionBlock, WebClient } from "@slack/web-api";
import { env } from "./env";
import { SummarizedItem } from "./openai";
import { Feed } from "./feed";
import { saveItem } from "./db";

const client = new WebClient(env.SLACK_OAUTH_TOKEN);

export const postSummarizedFeedItems = async (
  feed: Feed,
  items: SummarizedItem[]
): Promise<void> => {
  const totalPages = Math.ceil(items.length / 2);

  for (let i = 0; i < items.length; i += 2) {
    const currentPage = Math.ceil(i / 2) + 1;

    const picked = items.slice(i, i + 2);
    const blocks = picked.flatMap((item, index) =>
      buildSummaryBlocks(feed, index === 0 && i === 0, item)
    );

    await client.chat.postMessage({
      channel: env.SLACK_CHANNEL,
      text: `New Posts (${feed.name}) (${currentPage}/${totalPages})`,
      blocks,
    });

    for (const item of picked) {
      await saveItem(item.url);
    }
  }
};

const buildSummaryBlocks = (
  feed: Feed,
  first: boolean,
  item: SummarizedItem
): Block[] => {
  const blocks: Block[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `<${item.url}|*${item.title}*>` + "\n```" + item.summary + "```",
      },
    } as SectionBlock,
  ];

  if (first) {
    blocks.unshift({
      type: "header",
      text: {
        type: "plain_text",
        text: `:newspaper: New Posts (${feed.name})`,
      },
    } as HeaderBlock);
  }

  return blocks;
};
