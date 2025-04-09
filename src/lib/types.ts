export interface ConcertInfo {
  bandName: string;
  date: string;
  venue: string;
  city: string;
  source?: string;
}

export interface SearchProvider {
  searchConcerts(bandName: string): Promise<ConcertInfo[]>;
}
