import OpenAI from "openai";
import { ConcertInfo, SearchProvider } from "./types";

export class OpenAIProvider implements SearchProvider {
  private ai: OpenAI;

  constructor(apiKey: string) {
    this.ai = new OpenAI({ apiKey });
  }

  async searchConcerts(bandName: string): Promise<ConcertInfo[]> {
    const prompt = `請幫我搜尋樂團 "${bandName}" 未來一年內的演唱會資訊。
請特別關注：
1. 各大售票系統（如 KKTIX、ibon、拓元、寬宏等）
2. 樂團官方網站或社群媒體
3. 活動資訊網站

重要：請嚴格按照以下規則回覆：
1. 只能回覆 JSON 格式
2. 不要加入任何說明文字
3. 不要在 JSON 前後加入任何其他內容
4. JSON 必須符合以下格式：

{
  "concerts": [
    {
      "bandName": "樂團名稱",
      "date": "YYYY-MM-DD",
      "venue": "場地名稱",
      "city": "城市名稱",
      "source": "資訊來源網址"
    }
  ]
}

如果找不到演唱會資訊，請只回覆：
{
  "concerts": []
}`;

    try {
      const response = await this.ai.responses.create({
        model: "gpt-4o",
        tools: [{ type: "web_search_preview" }],
        input: prompt,
      });

      let text = response.output_text || '{"concerts": []}';

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
