import OpenAI from "openai";
import { generateSearchPrompt } from "./constants";
import { BaseProvider } from "./base-provider";

export class OpenAIProvider extends BaseProvider {
  private ai: OpenAI;

  constructor(apiKey: string) {
    super();
    this.ai = new OpenAI({ apiKey });
  }

  protected async fetchFromAPI(bandName: string): Promise<string> {
    const response = await this.ai.responses.create({
      model: "gpt-4o",
      tools: [{ type: "web_search_preview" }],
      input: generateSearchPrompt(bandName),
    });

    if (!response.output_text) {
      throw new Error("未收到 OpenAI 的回應文字");
    }

    return response.output_text;
  }
}
