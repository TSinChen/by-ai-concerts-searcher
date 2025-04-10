import { GoogleGenAI } from "@google/genai";
import { generateSearchPrompt } from "./constants";
import { BaseProvider } from "./base-provider";

export class GeminiProvider extends BaseProvider {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    super();
    this.ai = new GoogleGenAI({ apiKey });
  }

  protected async fetchFromAPI(bandName: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      config: { tools: [{ googleSearch: {} }] },
      contents: [generateSearchPrompt(bandName)],
    });

    if (!response.text) {
      throw new Error("未收到 Gemini 的回應文字");
    }

    return response.text;
  }
}
