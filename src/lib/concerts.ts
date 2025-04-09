import { bands } from "@/config/bands";
import { ConcertInfo } from "./types";
import { SearchProviderFactory } from "./search-factory";

// 初始化搜尋提供者（在應用程式啟動時調用）
export const initializeSearchProvider = (
  type: "openai" | "gemini",
  apiKey: string
) => {
  SearchProviderFactory.getInstance().initialize(type, apiKey);
};

export const getAllConcerts = async (): Promise<ConcertInfo[]> => {
  const provider = SearchProviderFactory.getInstance().getProvider();
  const concerts = await provider.searchConcerts(bands);
  return sortConcertsByDate(concerts);
};

export const sortConcertsByDate = (concerts: ConcertInfo[]): ConcertInfo[] => {
  return [...concerts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
};
