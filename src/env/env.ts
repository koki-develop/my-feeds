import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  OPENAI_API_KEY: str(),
});
