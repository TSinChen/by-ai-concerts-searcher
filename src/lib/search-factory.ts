import { SearchProvider } from "./types";
import { OpenAIProvider } from "./openai";
import { GeminiProvider } from "./gemini";

type SearchProviderType = "openai" | "gemini";

/**
 * 搜尋提供者工廠類別
 * 使用單例模式確保只有一個實例
 */
export class SearchProviderFactory {
  private static instance: SearchProviderFactory;
  private currentProvider?: SearchProvider;

  private constructor() {}

  /**
   * 取得工廠實例
   */
  public static getInstance(): SearchProviderFactory {
    if (!SearchProviderFactory.instance) {
      SearchProviderFactory.instance = new SearchProviderFactory();
    }
    return SearchProviderFactory.instance;
  }

  /**
   * 初始化搜尋提供者
   * @param type 提供者類型
   * @param apiKey API 金鑰
   * @throws {Error} 當提供者類型無效時
   */
  public initialize(type: SearchProviderType, apiKey: string): void {
    if (!apiKey) {
      throw new Error(`缺少 ${type} 的 API 金鑰`);
    }

    switch (type) {
      case "openai":
        this.currentProvider = new OpenAIProvider(apiKey);
        break;
      case "gemini":
        this.currentProvider = new GeminiProvider(apiKey);
        break;
      default:
        throw new Error(`不支援的搜尋提供者類型: ${type}`);
    }
  }

  /**
   * 取得當前的搜尋提供者
   * @throws {Error} 當提供者尚未初始化時
   */
  public getProvider(): SearchProvider {
    if (!this.currentProvider) {
      throw new Error("搜尋提供者尚未初始化");
    }
    return this.currentProvider;
  }
}
