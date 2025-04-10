import OpenAI from "openai";
import { ConcertInfo, SearchProvider } from "./types";
import { generateSearchPrompt } from "./constants";
import dayjs from "dayjs";

export class OpenAIProvider implements SearchProvider {
  private ai: OpenAI;

  constructor(apiKey: string) {
    this.ai = new OpenAI({ apiKey });
  }

  async searchConcert(bandName: string): Promise<ConcertInfo[]> {
    try {
      const response = await this.ai.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        input: generateSearchPrompt(bandName),
      });

      let text = response.output_text || '{"concerts": []}';

      // 移除可能的 markdown 代碼塊標記
      text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");

      // 嘗試找出 JSON 部分
      try {
        // 找出第一個 { 和最後一個 } 之間的內容
        const startIndex = text.indexOf("{");
        const endIndex = text.lastIndexOf("}") + 1;

        if (startIndex === -1 || endIndex === -1) {
          console.error("無法在回應中找到有效的 JSON 結構");
          console.error("Raw text:", text);
          return [];
        }

        text = text.slice(startIndex, endIndex);

        // 嘗試清理可能的無效字符
        text = text.trim().replace(/[\x00-\x1F\x7F-\x9F]/g, "");

        const jsonObj = JSON.parse(text) as {
          concerts: Partial<ConcertInfo>[];
        };
        const concerts = Array.isArray(jsonObj.concerts)
          ? jsonObj.concerts
          : [];

        // 驗證資料格式
        const validConcerts = concerts.filter(
          (concert): concert is ConcertInfo => {
            // 檢查基本資料格式
            const isValidFormat =
              typeof concert.bandName === "string" &&
              typeof concert.date === "string" &&
              typeof concert.venue === "string" &&
              typeof concert.city === "string" &&
              /^\d{4}-\d{2}-\d{2}$/.test(concert.date);

            if (!isValidFormat) return false;

            // 檢查日期是否為未來日期
            const today = dayjs().startOf("day");
            const concertDate = dayjs(concert.date);

            return concertDate.isAfter(today);
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

  // 為了保持與介面相容，實現原本的方法
  async searchConcerts(bandNames: string[]): Promise<ConcertInfo[]> {
    // 依序搜尋每個樂團
    const allConcerts: ConcertInfo[] = [];
    for (const bandName of bandNames) {
      const concerts = await this.searchConcert(bandName);
      allConcerts.push(...concerts);
    }
    return allConcerts;
  }
}
