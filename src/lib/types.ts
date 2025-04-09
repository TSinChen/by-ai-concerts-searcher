export interface ConcertInfo {
  bandName: string;
  date: string;
  venue: string;
  city: string;
  source?: string;
}

export interface SearchProvider {
  searchConcerts(bandNames: string[]): Promise<ConcertInfo[]>;
}
