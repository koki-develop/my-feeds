import OpenAI from "openai";
import { env } from "./env";
import { Item } from "./feed";
import { logger } from "./log";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export type SummarizedItem = Item & {
  summary: string;
};

export const summarize = async (item: Item): Promise<SummarizedItem> => {
  logger.info(`Summarizing item: ${item.title} (${item.url}).`);

  const prompt =
    "受け取った記事の内容を箇条書きで日本語で簡潔に要約してください。リスト以外のマークダウン記法は使用しないでください。";

  const stream = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: item.content },
    ],
    stream: true,
  });

  const summary: string[] = [];
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content ?? "";
    summary.push(content);
  }

  logger.info(`Summarized item: ${item.title} (${item.url}).`);
  return { ...item, summary: summary.join("") };
};
