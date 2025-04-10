import { ConcertCard } from "./concert-card";
import { ConcertInfo } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ConcertListProps = {
  concerts: ConcertInfo[];
};

export const ConcertList = ({ concerts }: ConcertListProps) => {
  if (concerts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">目前沒有即將舉行的演唱會</p>
      </div>
    );
  }

  // 將演唱會按照樂團分組
  const concertsByBand = concerts.reduce<Record<string, ConcertInfo[]>>(
    (acc, concert) => {
      if (!acc[concert.bandName]) {
        acc[concert.bandName] = [];
      }
      acc[concert.bandName].push(concert);
      return acc;
    },
    {}
  );

  // 獲取所有樂團名稱並排序
  const bandNames = Object.keys(concertsByBand).sort();

  return (
    <Tabs defaultValue={bandNames[0]} className="w-full">
      <TabsList className="mb-4 flex flex-wrap gap-2">
        {bandNames.map((bandName) => (
          <TabsTrigger
            key={bandName}
            value={bandName}
            className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {bandName}
          </TabsTrigger>
        ))}
      </TabsList>
      {bandNames.map((bandName) => (
        <TabsContent key={bandName} value={bandName}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {concertsByBand[bandName].map((concert, index) => (
              <ConcertCard
                key={`${concert.bandName}-${index}`}
                concert={concert}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
