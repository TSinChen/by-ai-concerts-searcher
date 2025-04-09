import { ConcertInfo } from "@/lib/types";
import { ConcertCard } from "./concert-card";

interface ConcertListProps {
  concerts: ConcertInfo[];
}

export const ConcertList = ({ concerts }: ConcertListProps) => {
  if (concerts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">目前沒有即將舉行的演唱會</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {concerts.map((concert, index) => (
        <ConcertCard key={`${concert.bandName}-${index}`} concert={concert} />
      ))}
    </div>
  );
};
