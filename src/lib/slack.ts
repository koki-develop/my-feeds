import { Block, HeaderBlock, SectionBlock, WebClient } from "@slack/web-api";
import { env } from "./env";
import { SummarizedItem } from "./openai";

const client = new WebClient(env.SLACK_OAUTH_TOKEN);

export const postSummarizedFeedItems = async (
  items: SummarizedItem[]
): Promise<void> => {
  const totalPages = Math.ceil(items.length / 2);

  for (let i = 0; i < items.length; i += 2) {
    const currentPage = Math.ceil(i / 2) + 1;

    const picked = items.slice(i, i + 2);
    const blocks = picked.flatMap((item, index) =>
      buildSummaryBlocks(index === 0, item)
    );

    await client.chat.postMessage({
      channel: env.SLACK_CHANNEL,
      text: `New Posts (${currentPage}/${totalPages})`,
      blocks,
    });
  }
};

const buildSummaryBlocks = (first: boolean, item: SummarizedItem): Block[] => {
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
        text: "New Posts",
      },
    } as HeaderBlock);
  }

  return blocks;
};
