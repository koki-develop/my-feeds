import { fetchGitHubFeedItems } from "./lib/feed";
import { SummarizedItem, summarize } from "./lib/openai";
import { postSummarizedFeedItems } from "./lib/slack";

(async () => {
  const items = await fetchGitHubFeedItems();

  const summarizedItems: SummarizedItem[] = [];
  for (const item of items) {
    const summarized = await summarize(item);
    summarizedItems.push(summarized);
    break;
  }

  await postSummarizedFeedItems(summarizedItems);
})();
