import { getAllConcerts, initializeSearchProvider } from "@/lib/concerts";
import { ErrorDisplay } from "@/app/components/ui/error-display";
import { ConcertList } from "@/app/components/concerts/concert-list";

// 頁面設定
export const dynamic = "force-static";
export const revalidate = 259200; // 3 天 (60 * 60 * 24 * 3)

// 初始化搜尋提供者並獲取資料
const getConcertData = async () => {
  const searchType =
    (process.env.SEARCH_PROVIDER as "openai" | "gemini") || "openai";
  const apiKey =
    searchType === "openai"
      ? process.env.OPENAI_API_KEY
      : process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error(`缺少 ${searchType} 的 API 金鑰`);
  }

  initializeSearchProvider(searchType, apiKey);
  return getAllConcerts();
};

export default async function Home() {
  try {
    const concerts = await getConcertData();

    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">即將舉行的演唱會</h1>
        <ConcertList concerts={concerts} />
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-8">即將舉行的演唱會</h1>
        <ErrorDisplay
          error={error instanceof Error ? error : new Error("未知錯誤")}
        />
      </main>
    );
  }
}
