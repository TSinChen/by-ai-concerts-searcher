import { SearchProvider } from "./interfaces";
import { ConcertInfo } from "./types";
import dayjs from "dayjs";

export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // 1 秒

export abstract class BaseProvider implements SearchProvider {
  // 抽象方法，子類必須實現原始的 API 呼叫
  protected abstract fetchFromAPI(bandName: string): Promise<string>;

  // 共用的延遲方法
  protected async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 驗證演唱會資料的共用方法
  protected validateConcert(
    concert: Partial<ConcertInfo>
  ): concert is ConcertInfo {
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

  // 清理和解析 JSON 的共用方法
  protected parseResponse(text: string): Partial<ConcertInfo>[] {
    // 移除可能的 markdown 代碼塊標記
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    // 找出第一個 { 和最後一個 } 之間的內容
    const startIndex = text.indexOf("{");
    const endIndex = text.lastIndexOf("}") + 1;

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("無法在回應中找到有效的 JSON 結構");
    }

    text = text.slice(startIndex, endIndex);

    // 嘗試清理可能的無效字符
    text = text.trim().replace(/[\x00-\x1F\x7F-\x9F]/g, "");

    const jsonObj = JSON.parse(text) as {
      concerts: Partial<ConcertInfo>[];
    };

    return Array.isArray(jsonObj.concerts) ? jsonObj.concerts : [];
  }

  // 實現搜尋單一樂團的方法
  async searchConcert(bandName: string): Promise<ConcertInfo[]> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const text = await this.fetchFromAPI(bandName);

        try {
          const concerts = this.parseResponse(text);

          // 驗證資料格式
          const validConcerts = concerts.filter(
            (concert): concert is ConcertInfo => this.validateConcert(concert)
          );

          // 如果找不到有效的演唱會資訊，且還有重試次數，則重試
          if (validConcerts.length === 0 && attempt < MAX_RETRIES) {
            console.log(
              `第 ${attempt} 次嘗試沒有找到 ${bandName} 的演唱會資訊，準備重試...`
            );
            await this.delay(RETRY_DELAY);
            continue;
          }

          return validConcerts;
        } catch (error) {
          lastError = error as Error;
          console.error(`解析演唱會資訊失敗（第 ${attempt} 次嘗試）:`, error);
          if (attempt < MAX_RETRIES) {
            await this.delay(RETRY_DELAY);
            continue;
          }
        }
      } catch (error) {
        lastError = error as Error;
        console.error(`獲取演唱會資訊失敗（第 ${attempt} 次嘗試）:`, error);
        if (attempt < MAX_RETRIES) {
          await this.delay(RETRY_DELAY);
          continue;
        }
      }
    }

    console.error(`在 ${MAX_RETRIES} 次嘗試後仍然失敗:`, lastError);
    return [];
  }

  // 實現搜尋多個樂團的方法
  async searchConcerts(bandNames: string[]): Promise<ConcertInfo[]> {
    const allConcerts: ConcertInfo[] = [];
    for (const bandName of bandNames) {
      const concerts = await this.searchConcert(bandName);
      allConcerts.push(...concerts);
    }
    return allConcerts;
  }
}
