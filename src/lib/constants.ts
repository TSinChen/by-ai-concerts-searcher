export const BANDS = [
  "ONE OK ROCK",
  "Survive Said The Prophet",
  "My Chemical Romance",
];

/**
 * 生成搜尋演唱會資訊的提示詞
 * @param bandName 樂團名稱
 */
export const generateSearchPrompt = (
  bandName: string
) => `請幫我搜尋以下樂團未來半年內的演唱會資訊：
${bandName}

請特別關注：
1. 樂團官方網站或社群媒體（包含 Facebook、Instagram）
2. 活動資訊網站

重要：請嚴格按照以下規則回覆：
1. 只能回覆 JSON 格式
2. 不要加入任何說明文字
3. 不要在 JSON 前後加入任何其他內容
4. 只提供未來的演唱會資訊，不要包含已經過期的演唱會
5. 城市名稱必須使用英文（例如：Taipei、Taichung、Kaohsiung 等）
6. 如果找不到演唱會資訊，一定要再次確認所有可能的來源
7. JSON 必須符合以下格式：

{
  "concerts": [
    {
      "bandName": "${bandName}",
      "date": "YYYY-MM-DD（必須是未來日期）",
      "venue": "場地名稱",
      "city": "城市名稱"
    }
  ]
}

如果找不到未來的演唱會資訊，請只回覆：
{
  "concerts": []
}`;
