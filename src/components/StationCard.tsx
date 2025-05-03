import { Station } from "@/types";

export default function StationCard({ station, revealed = true }: { station: Station; revealed?: boolean }) {
  return (
    <div className="aspect-[16/11] w-[18rem] max-w-xl bg-white border-[3px] border-gray-400 rounded-xl shadow-lg font-sans overflow-hidden text-center relative flex flex-col justify-start items-center px-4 py-2">
      {/* 駅名（漢字） */}
      <div className="text-black text-center font-gothic font-bold leading-tight tracking-wide text-3xl truncate">
        {station.name}
      </div>

      {/* 駅名（ひらがな） */}
      <div className="text-black text-center font-gothic tracking-wide text-sm leading-tight mt-[-0.2em]">
        {station.kana}
      </div>

      {/* 所在市町村 */}
      <div className="text-black text-center font-gothic tracking-wide text-sm leading-tight mt-[0.1em]">
       ({station.city})
      </div>

      {/* 緑の線 + マゼンタ正方形 */}
      <div className="relative h-3 mt-1 mb-1 flex items-center w-[120%] px-6">
        {/* 左端の台形 */}
        <div
          className="w-full h-full bg-green-800"
          style={{
            clipPath: "polygon(0% 50%, 5% 0%, 100% 0%, 100% 100%, 5% 100%, 0% 50%)",
          }}
        />
        {/* 緑の線 */}
        <div className="relative flex-grow h-3.5 bg-green-800 rounded-r" />
        {/* マゼンタ正方形 */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 bg-fuchsia-600" />
      </div>

      {/* 駅名（ローマ字） */}
      <div className="text-black text-center font-helvetica text-xs leading-tight">
        {station.romaji}
      </div>

  {/* ✅ 路線バッジ背景＋バッジ本体 */}
  <div className="absolute inset-x-0 bottom-0 bg-gray-100 px-3 py-2">
    <div className="flex flex-wrap gap-1 justify-start">
      {station.lines.map((line, idx) => (
        <span
          key={idx}
          className="px-2 py-0.5 text-[10px] text-black font-serif bg-yellow-400 hex-badge"
        >
          {line}
        </span>
      ))}
    </div>
  </div>

    {/* 乗降人数ウィンドウ */}
    <div className="min-w-[140px] bg-white border-2 border-gray-500 rounded px-2 py-1 text-center shadow-inner leading-tight">
  <span className="text-[10px] text-gray-600">2022年乗降客数：</span>
  {revealed ? (
    <span className="text-red-600 font-mono font-bold text-sm">
      {station.passengers.toLocaleString()}人
    </span>
  ) : (
    <span className="text-gray-400 font-mono font-bold text-sm">???人</span>
  )}
</div>
</div>
  );
}
