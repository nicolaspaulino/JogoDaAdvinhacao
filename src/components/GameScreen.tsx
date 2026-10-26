import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Flag, HelpCircle } from "lucide-react";
import type { AnswerType, Character, QuestionLog, WordEntry } from "../game/types";
import { analyzeQuestion, checkGuess } from "../game/engine";

interface GameScreenProps {
  character: Character;
  entry: WordEntry;
  onWin: (stats: GameStats) => void;
  onGiveUp: (stats: GameStats) => void;
}

export interface GameStats {
  questions: number;
  guesses: number;
  durationMs: number;
}

type Mode = "question" | "guess";

export function GameScreen({ character, entry, onWin, onGiveUp }: GameScreenProps) {
  const [mode, setMode] = useState<Mode>("question");
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<QuestionLog[]>([]);
  const [thinking, setThinking] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<{ text: string; type: AnswerType } | null>(null);
  const [guesses, setGuesses] = useState(0);
  const [hint, setHint] = useState<string | null>(null);

  const startTime = useRef(Date.now());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = character.theme;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [logs, thinking, currentAnswer]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [mode]);

  function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function stats(): GameStats {
    return {
      questions: logs.length,
      guesses,
      durationMs: Date.now() - startTime.current,
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || thinking) return;

    setInput("");
    setThinking(true);
    setCurrentAnswer(null);

    const thinkDelay = 700 + Math.random() * 600;

    window.setTimeout(() => {
      if (mode === "question") {
        const { answer } = analyzeQuestion(text, entry);
        const line = pick(character.answers[answer]);
        const id = logs.length + 1;
        setLogs((prev) => [...prev, { id, question: text, answer, ts: Date.now() }]);
        setCurrentAnswer({ text: line, type: answer });
        setThinking(false);
      } else {
        setGuesses((g) => g + 1);
        const result = checkGuess(text, entry);
        if (result.correct) {
          setThinking(false);
          onWin(stats());
        } else {
          const close = result.distance <= 3 && entry.word.length > 4;
          const line = close
            ? `Muito perto! Mas não é "${text}". Tente de novo!`
            : pick(character.answers.nao);
          const id = logs.length + 1;
          setLogs((prev) => [
            ...prev,
            { id, question: `Palpite: "${text}"`, answer: "nao", ts: Date.now() },
          ]);
          setCurrentAnswer({ text: line, type: "nao" });
          setHint(close ? "Você está perto!" : null);
          setThinking(false);
        }
      }
    }, thinkDelay);
  }

  function handleGiveUp() {
    onGiveUp(stats());
  }

  const answerColor: Record<AnswerType, string> = {
    sim: "bg-emerald-100 text-emerald-700 border-emerald-300",
    nao: "bg-rose-100 text-rose-700 border-rose-300",
    talvez: "bg-amber-100 text-amber-700 border-amber-300",
  };
  const answerLabel: Record<AnswerType, string> = {
    sim: "SIM",
    nao: "NÃO",
    talvez: "TALVEZ",
  };

  return (
    <div className={`min-h-screen w-full flex flex-col`}>
      {/* Top bar */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3 border-b border-black/5 backdrop-blur-md bg-white/40">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0" aria-hidden>
            {character.emoji}
          </span>
          <div className="min-w-0">
            <p className={`font-semibold text-sm ${t.text} truncate`}>{character.species}</p>
            <p className={`text-xs ${t.textMuted} truncate`}>{character.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${t.badge}`}>
            {logs.length} {logs.length === 1 ? "pergunta" : "perguntas"}
          </div>
          <button
            onClick={handleGiveUp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/5 text-slate-600 hover:bg-rose-100 hover:text-rose-700 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            Desistir
          </button>
        </div>
      </div>

      {/* Conversation */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4"
      >
        {/* Greeting */}
        <ChatBubble character={character} text={character.greeting} />

        {logs.map((log) => (
          <div key={log.id} className="space-y-2">
            <UserLine text={log.question} theme={t} />
            <AnswerChip type={log.answer} color={answerColor[log.answer]} label={answerLabel[log.answer]} />
          </div>
        ))}

        {thinking && (
          <div className="flex items-center gap-2 animate-[fadeUp_0.3s_ease-out]">
            <span className="text-2xl" aria-hidden>
              {character.emoji}
            </span>
            <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${t.bubble} border`}>
              <TypingDots theme={t} />
            </div>
          </div>
        )}

        {currentAnswer && !thinking && (
          <div className="flex items-start gap-2 animate-[fadeUp_0.4s_ease-out]">
            <span className="text-2xl shrink-0" aria-hidden>
              {character.emoji}
            </span>
            <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${t.bubble} border ${t.bubbleText} max-w-[80%]`}>
              {currentAnswer.text}
            </div>
          </div>
        )}

        {hint && (
          <div className="text-center text-xs text-slate-500 animate-[fadeUp_0.3s_ease-out]">
            {hint}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 sm:px-6 py-4 border-t border-black/5 backdrop-blur-md bg-white/50">
        <div className="max-w-2xl mx-auto">
          {/* Mode toggle */}
          <div className="flex items-center gap-1.5 mb-3 justify-center">
            <button
              onClick={() => setMode("question")}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                mode === "question"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-black/5 text-slate-500 hover:bg-black/10"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Fazer pergunta
            </button>
            <button
              onClick={() => setMode("guess")}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                mode === "guess"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-black/5 text-slate-500 hover:bg-black/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Arriscar palpite
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "question"
                  ? "Ex: É um animal? É vermelho? É comestível?"
                  : "Digite seu palpite final..."
              }
              className={`flex-1 px-4 py-3 rounded-full text-sm ${t.input} border ${t.inputBorder} ${t.text} placeholder:text-slate-400 focus:outline-none focus:ring-2 ${t.ring} transition-all`}
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all ${
                input.trim() && !thinking
                  ? `${t.primaryBtn} hover:scale-105 shadow-md`
                  : "bg-slate-300 cursor-not-allowed"
              }`}
              aria-label="Enviar"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            {mode === "question"
              ? "O personagem responde Sim, Não ou Talvez."
              : "Cuidado: palpites errados contam, mas não encerram o jogo."}
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ character, text }: { character: Character; text: string }) {
  const t = character.theme;
  return (
    <div className="flex items-start gap-2 animate-[fadeUp_0.5s_ease-out]">
      <span className="text-2xl shrink-0" aria-hidden>
        {character.emoji}
      </span>
      <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${t.bubble} border ${t.bubbleText} max-w-[85%]`}>
        {text}
      </div>
    </div>
  );
}

function UserLine({ text, theme }: { text: string; theme: Character["theme"] }) {
  return (
    <div className="flex justify-end animate-[fadeUp_0.3s_ease-out]">
      <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm bg-slate-900 text-white text-sm max-w-[80%]">
        {text}
      </div>
    </div>
  );
}

function AnswerChip({
  type: _type,
  color,
  label,
}: {
  type: AnswerType;
  color: string;
  label: string;
}) {
  return (
    <div className="flex justify-start pl-9 animate-[fadeUp_0.3s_ease-out]">
      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${color}`}>{label}</span>
    </div>
  );
}

function TypingDots({ theme }: { theme: Character["theme"] }) {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${theme.accentText.replace("text-", "bg-")} animate-bounce`}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
