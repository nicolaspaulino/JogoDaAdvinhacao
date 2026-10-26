import { Trophy, Skull, Clock, MessageCircle, Lightbulb, RotateCcw } from "lucide-react";
import type { Character } from "../game/types";
import type { GameStats } from "./GameScreen";

interface ResultScreenProps {
  outcome: "win" | "giveup";
  character: Character;
  secretWord: string;
  stats: GameStats;
  onPlayAgain: () => void;
  onChangeCharacter: () => void;
}

export function ResultScreen({
  outcome,
  character,
  secretWord,
  stats,
  onPlayAgain,
  onChangeCharacter,
}: ResultScreenProps) {
  const t = character.theme;
  const won = outcome === "win";
  const lines = won ? character.victory : character.giveUp;

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
      <div
        className={`w-full max-w-md rounded-3xl p-8 ${t.cardBg} border-2 ${t.accentBorder} shadow-2xl ${t.glow} animate-[popIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)_both]`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
              won ? "bg-emerald-100" : "bg-black/5"
            } animate-[popIn_0.6s_ease-out_both]`}
            style={{ animationDelay: "100ms" }}
            aria-hidden
          >
            {won ? "🎉" : character.emoji}
          </div>
        </div>

        <h2 className={`text-2xl font-bold text-center ${t.text}`}>
          {won ? "Você venceu!" : "Você desistiu"}
        </h2>
        <p className={`text-center text-sm mt-1 ${t.textMuted}`}>
          {won ? "Decifrou o segredo do personagem." : "A palavra permaneceu oculta..."}
        </p>

        {/* Reveal */}
        <div
          className={`mt-6 p-4 rounded-2xl text-center ${
            won ? "bg-emerald-50 border border-emerald-200" : "bg-black/5 border border-black/10"
          } animate-[fadeUp_0.4s_ease-out_both]`}
          style={{ animationDelay: "200ms" }}
        >
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            A palavra era
          </p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{secretWord}</p>
        </div>

        {/* Character line */}
        <p
          className={`mt-4 text-center text-sm italic ${t.textMuted} animate-[fadeUp_0.4s_ease-out_both]`}
          style={{ animationDelay: "300ms" }}
        >
          “{lines[Math.floor(Math.random() * lines.length)]}”
        </p>

        {/* Stats */}
        <div
          className="mt-6 grid grid-cols-3 gap-3 animate-[fadeUp_0.4s_ease-out_both]"
          style={{ animationDelay: "400ms" }}
        >
          <StatCard
            icon={<MessageCircle className="w-4 h-4" />}
            value={stats.questions}
            label="Perguntas"
          />
          <StatCard
            icon={<Lightbulb className="w-4 h-4" />}
            value={stats.guesses}
            label="Palpites"
          />
          <StatCard
            icon={<Clock className="w-4 h-4" />}
            value={formatDuration(stats.durationMs)}
            label="Tempo"
          />
        </div>

        {/* Actions */}
        <div
          className="mt-7 flex flex-col gap-2.5 animate-[fadeUp_0.4s_ease-out_both]"
          style={{ animationDelay: "500ms" }}
        >
          <button
            onClick={onPlayAgain}
            className={`w-full py-3.5 rounded-full font-semibold text-white ${t.primaryBtn} transition-all hover:scale-[1.02] shadow-md inline-flex items-center justify-center gap-2`}
          >
            <RotateCcw className="w-4 h-4" />
            Jogar de novo
          </button>
          <button
            onClick={onChangeCharacter}
            className="w-full py-3 rounded-full font-semibold bg-black/5 text-slate-600 hover:bg-black/10 transition-colors"
          >
            Trocar personagem
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-black/5 px-3 py-3 text-center">
      <div className="flex items-center justify-center text-slate-500 mb-1">{icon}</div>
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="text-[11px] text-slate-400 font-medium">{label}</p>
    </div>
  );
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m > 0) return `${m}m${sec.toString().padStart(2, "0")}`;
  return `${sec}s`;
}

// Keep icons referenced (Trophy/Skull are alternate-state glyphs reserved for future theming)
export const _ICONS = { Trophy, Skull };
