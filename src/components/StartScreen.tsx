import { useState } from "react";
import { CHARACTERS } from "../game/characters";
import type { Character } from "../game/types";

interface StartScreenProps {
  onStart: (character: Character) => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const [selected, setSelected] = useState<Character | null>(null);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200 text-xs font-medium text-slate-500 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Jogo de Adivinhação
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Akinator Inverso
          </h1>
          <p className="mt-3 text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            Escolha seu personagem. Ele pensa em uma palavra secreta e você a
            descobre fazendo perguntas de Sim, Não ou Talvez.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {CHARACTERS.map((c, idx) => {
            const isSel = selected?.id === c.id;
            const dark = c.id === "cthulhu";
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                style={{ animationDelay: `${idx * 80}ms` }}
                className={`group relative text-left rounded-2xl p-5 border-2 transition-all duration-300 animate-[fadeUp_0.5s_ease-out_both] ${
                  isSel
                    ? `${c.theme.cardBg} border-transparent ring-2 ${c.theme.ring} shadow-xl ${c.theme.glow} scale-[1.02]`
                    : `${c.theme.cardBg} ${c.theme.accentBorder} hover:scale-[1.01] hover:shadow-lg`
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-5xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
                    aria-hidden
                  >
                    {c.emoji}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${c.theme.badge}`}
                  >
                    {c.difficulty === "easy"
                      ? "Fácil"
                      : c.difficulty === "medium"
                        ? "Médio"
                        : "Difícil"}
                  </span>
                </div>
                <h3 className={`text-lg font-bold ${dark ? "text-slate-100" : "text-slate-900"}`}>
                  {c.species}
                </h3>
                <p
                  className={`text-sm mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {c.tagline}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {sampleWords(c.id).map((w) => (
                    <span
                      key={w}
                      className={`text-[11px] px-2 py-0.5 rounded-md ${
                        dark
                          ? "bg-slate-800 text-slate-300"
                          : "bg-black/5 text-slate-600"
                      }`}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            disabled={!selected}
            onClick={() => selected && onStart(selected)}
            className={`px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-300 ${
              selected
                ? "bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-300 hover:scale-[1.03] cursor-pointer"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            {selected ? `Jogar com ${selected.species}` : "Escolha um personagem"}
          </button>
        </div>
      </div>
    </div>
  );
}

function sampleWords(id: string): string[] {
  if (id === "rat") return ["maçã", "bola", "gato"];
  if (id === "fox") return ["relógio", "nuvem", "violão"];
  return ["melancolia", "astrolábio", "constelação"];
}
