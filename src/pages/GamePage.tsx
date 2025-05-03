import { useEffect, useState } from "react";
import stationsData from "@/data/stations.json";
import { Station } from "@/types";
import StationCard from "@/components/StationCard";

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function GamePage() {
  const [deck, setDeck] = useState<Station[]>([]);
  const [hand, setHand] = useState<Station[]>([]);
  const [skips, setSkips] = useState<Station[]>([]);
  const [current, setCurrent] = useState<Station | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameClear, setIsGameClear] = useState(false);
  const [usedIds, setUsedIds] = useState<Set<number>>(new Set());
  const [lastTriedHand, setLastTriedHand] = useState<Station[]>([]);
  const [correctSortedHand, setCorrectSortedHand] = useState<Station[]>([]);
  const [tempInsertionIndex, setTempInsertionIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const shuffled = shuffle(stationsData).slice(0, 5);
    const initial = shuffled[0];
    const next = shuffled[1];
    setHand([initial]);
    setCurrent(next);
    setDeck(shuffled.slice(2));
    setUsedIds(new Set([initial.id, next.id]));
  }, []);

  const confirmInsert = () => {
    if (!current || tempInsertionIndex === null) return;
    const newHand = [...hand.slice(0, tempInsertionIndex), current, ...hand.slice(tempInsertionIndex)];
    const sorted = [...newHand].sort((a, b) => b.passengers - a.passengers);
    const isCorrect = newHand.every((s, i) => s.id === sorted[i].id);

    if (!isCorrect) {
      setLastTriedHand(newHand);
      setCorrectSortedHand(sorted);
      setIsGameOver(true);
      return;
    }

    setScore(score + 1);
    const newUsedIds = new Set([...usedIds, current.id]);
    const nextCard = deck.find((s) => !newUsedIds.has(s.id)) || null;
    if (!nextCard) {
      setHand(newHand);
      setIsGameClear(true);
      return;
    }
    setHand(newHand);
    setCurrent(nextCard);
    setDeck(deck.filter((s) => s.id !== nextCard?.id));
    setUsedIds(new Set([...newUsedIds, nextCard?.id ?? -1]));
    setTempInsertionIndex(null);
  };

  const skipCard = () => {
    if (!current || skips.length >= 2) return;
    setSkips([...skips, current]);
    const nextCard = deck.find((s) => !usedIds.has(s.id)) || null;
    setCurrent(nextCard);
    setDeck(deck.filter((s) => s.id !== nextCard?.id));
    setUsedIds(new Set([...usedIds, current.id, nextCard?.id ?? -1]));
  };

  const InsertButton = ({ index }: { index: number }) => (
    <div className="flex justify-center w-full">
      <button
        onClick={() => setTempInsertionIndex(index)}
        className={`w-[70%] max-w-[250px] h-10 border-2 border-dashed rounded 
          flex items-center justify-center gap-1 px-2 text-sm font-medium
          ${tempInsertionIndex === index ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-400'}`}
      >
        <span className="text-lg">＋</span>
        <span className="text-gray-600 whitespace-nowrap">クリック！</span>
      </button>
    </div>
  );
  

  const maxScore = 4; // 10枚中1枚初期手札なので、挿入回数は最大9回
  const scorePercentage = Math.round((score / maxScore) * 100);

  return (
    <div className="min-h-screen bg-green-800 bg-[url('/felt-texture.png')] bg-repeat bg-cover">
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white ">🚉 駅ソートゲーム</h1>
        <div className="bg-gray-100 border border-gray-300 rounded-md p-4 text-sm leading-relaxed text-gray-700">
          <p>・駅の乗降客数（１日あたり）を多い順に並べるゲームです。</p>
          <p>・右側のカードが入る場所をクリックし、「確定」ボタンを押してください。正解したら次のカードが現れます。</p>
          <p>・カードは全部で５枚あります。目指せ全問正解！</p>
          <p className="text-xs text-gray-500 mt-2">
            ※乗降客数は各社公開情報を合算したものです。実際のものと異なる可能性があります。
          </p>
        </div>

      {isGameOver && (
        <div className="space-y-4">
          <div className="border-1 rounded p-1 bg-white text-red-600 text-xl">❌ ゲームオーバー！順番が違いました（スコア：{scorePercentage} / 100点）</div>
          <div>
            <h2 className="text-white font-bold">あなたの並び</h2>
            <div className="flex flex-col gap-2">
              {lastTriedHand.map((station, idx) => {
                const isCorrect = station.id === correctSortedHand[idx]?.id;
                return (
                  <div
                    key={`${station.id}-${idx}`}
                    className={`border-2 rounded p-1 ${
                      isCorrect ? "border-green-500" : "border-red-500"
                    }`}
                  >
                    <StationCard station={station} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isGameClear && (
        <div className="space-y-4 text-center text-white text-2xl font-bold">
          🎉 おめでとう！全て正しく並べられました！ 🎉
          <div className="text-xl text-white mt-2">スコア：{scorePercentage} / 100点</div>
        </div>
      )}

      {!isGameOver && !isGameClear && (
        <div className="flex flex-row items-start gap-6">
          <div className="flex flex-col items-start gap-2">
            <InsertButton index={0} />
            {hand.map((station, idx) => (
              <div key={`card-${idx}`} className="flex flex-col items-start gap-2">
                <StationCard station={station} />
                <InsertButton index={idx + 1} />
              </div>
            ))}
          </div>
          {current && (
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-lg font-bold text-white">次のカード：</h2>
              <StationCard station={current} revealed={false} />
              <div className="mt-2 flex flex-col gap-2">
                <button
                  onClick={confirmInsert}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded"
                >
                  ✅ 挿入位置を確定
                </button>
                <button
                  onClick={skipCard}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded"
                >
                  スキップ（残り {2 - skips.length} 回）
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
}