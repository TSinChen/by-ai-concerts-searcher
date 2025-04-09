import { GoogleGenAI } from "@google/genai";
import { ConcertInfo, SearchProvider } from "./types";
import { generateSearchPrompt } from "./constants";

export class GeminiProvider implements SearchProvider {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async searchConcerts(bandNames: string[]): Promise<ConcertInfo[]> {
    try {
      const result = await this.ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [generateSearchPrompt(bandNames)],
        config: {
          tools: [
            {
              googleSearch: {},
            },
          ],
        },
      });

      if (!result.text) {
        console.error("No response text received from Gemini");
        return [];
      }

      let text = result.text;

      // 嘗試找出 JSON 部分
      try {
        // 找出第一個 { 和最後一個 } 之間的內容
        const startIndex = text.indexOf("{");
        const endIndex = text.lastIndexOf("}") + 1;

        if (startIndex !== -1 && endIndex !== -1) {
          text = text.slice(startIndex, endIndex);
        }

        const jsonObj = JSON.parse(text) as {
          concerts: Partial<ConcertInfo>[];
        };
        const concerts = Array.isArray(jsonObj.concerts)
          ? jsonObj.concerts
          : [];

        // 驗證資料格式
        const validConcerts = concerts.filter(
          (concert): concert is ConcertInfo => {
            return (
              typeof concert.bandName === "string" &&
              typeof concert.date === "string" &&
              typeof concert.venue === "string" &&
              typeof concert.city === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(concert.date) &&
              (!concert.source || typeof concert.source === "string")
            );
          }
        );

        return validConcerts;
      } catch (error) {
        console.error("Failed to parse concert information:", error);
        console.error("Raw text:", text);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch concert information:", error);
      return [];
    }
  }
}
