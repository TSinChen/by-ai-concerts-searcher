import { bands } from "@/config/bands";
import { ConcertInfo } from "./types";
import { SearchProviderFactory } from "./search-factory";
import dayjs from "dayjs";

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

export const sortConcertsByDate = (concerts: ConcertInfo[]): ConcertInfo[] =>
  [...concerts].sort((a, b) => dayjs(a.date).diff(b.date));
