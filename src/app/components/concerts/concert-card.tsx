import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { ConcertInfo } from "@/lib/types";

interface ConcertCardProps {
  concert: ConcertInfo;
}

export const ConcertCard = ({ concert }: ConcertCardProps) => {
  const formattedDate = format(
    new Date(concert.date),
    "yyyy年MM月dd日 (EEEE)",
    {
      locale: zhTW,
    }
  );

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

      {concert.source && (
        <a
          href={concert.source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none"
          aria-label={`查看 ${concert.bandName} 演唱會的詳細資訊`}
        >
          查看來源
        </a>
      )}
    </article>
  );
};
