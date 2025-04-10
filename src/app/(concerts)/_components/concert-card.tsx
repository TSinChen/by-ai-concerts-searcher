import dayjs from "dayjs";
import { ConcertInfo } from "@/lib/types";

type ConcertCardProps = {
  concert: ConcertInfo;
};

export const ConcertCard = ({ concert }: ConcertCardProps) => {
  const formattedDate = dayjs(concert.date).format("YYYY/MM/DD");

  return (
    <article
      className="p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      aria-labelledby={`concert-${concert.bandName}`}
    >
      <h2
        id={`concert-${concert.bandName}`}
        className="text-xl font-semibold mb-2"
      >
        {concert.bandName}
      </h2>

      <div className="space-y-1 mb-4">
        <p className="text-gray-600">
          <time dateTime={concert.date}>{formattedDate}</time>
        </p>
        <p className="text-gray-600">{concert.venue}</p>
        <p className="text-gray-600">{concert.city}</p>
      </div>
    </article>
  );
};
