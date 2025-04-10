import { ConcertInfo } from "./types";

export interface SearchProvider {
  // 搜尋單一樂團的演唱會
  searchConcert(bandName: string): Promise<ConcertInfo[]>;

  // 搜尋多個樂團的演唱會（為了向後相容）
  searchConcerts(bandNames: string[]): Promise<ConcertInfo[]>;
}
