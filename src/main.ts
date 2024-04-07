import { existsItem } from "./lib/db";
import { fetchAWSFeedItems, fetchGitHubFeedItems } from "./lib/feed";
import { SummarizedItem, summarize } from "./lib/openai";
import { postSummarizedFeedItems } from "./lib/slack";

(async () => {
  const fns = [fetchGitHubFeedItems, fetchAWSFeedItems];
  for (const fn of fns) {
    const [feed, items] = await fn();

    const summarizedItems: SummarizedItem[] = [];
    for (const item of items) {
      const exists = await existsItem(item.url);
      if (exists) continue;

      const summarized = await summarize(item);
      summarizedItems.push(summarized);
    }

    await postSummarizedFeedItems(feed, summarizedItems);
  }
})();
