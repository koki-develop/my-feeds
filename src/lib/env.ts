import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  // openai
  OPENAI_API_KEY: str(),

  // slack
  SLACK_CHANNEL: str(),
  SLACK_OAUTH_TOKEN: str(),
});
