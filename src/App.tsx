import { useMemo, useState } from "react";
import { StartScreen } from "./components/StartScreen";
import { GameScreen, type GameStats } from "./components/GameScreen";
import { ResultScreen } from "./components/ResultScreen";
import { EASY_WORDS, MEDIUM_WORDS, HARD_WORDS } from "./game/words";
import type { Character, Difficulty, WordEntry } from "./game/types";

type Phase = "start" | "game" | "result";

const WORDS_BY_DIFFICULTY: Record<Difficulty, WordEntry[]> = {
  easy: EASY_WORDS,
  medium: MEDIUM_WORDS,
  hard: HARD_WORDS,
};

function pickWord(difficulty: Difficulty): WordEntry {
  const pool = WORDS_BY_DIFFICULTY[difficulty];
  return pool[Math.floor(Math.random() * pool.length)];
}

function App() {
  const [phase, setPhase] = useState<Phase>("start");
  const [character, setCharacter] = useState<Character | null>(null);
  const [entry, setEntry] = useState<WordEntry | null>(null);
  const [outcome, setOutcome] = useState<"win" | "giveup">("win");
  const [stats, setStats] = useState<GameStats>({ questions: 0, guesses: 0, durationMs: 0 });

  function startGame(c: Character) {
    setCharacter(c);
    setEntry(pickWord(c.difficulty));
    setPhase("game");
  }

  function handleWin(s: GameStats) {
    setStats(s);
    setOutcome("win");
    setPhase("result");
  }

  function handleGiveUp(s: GameStats) {
    setStats(s);
    setOutcome("giveup");
    setPhase("result");
  }

  function playAgain() {
    if (character) {
      setEntry(pickWord(character.difficulty));
      setStats({ questions: 0, guesses: 0, durationMs: 0 });
      setPhase("game");
    }
  }

  function changeCharacter() {
    setCharacter(null);
    setEntry(null);
    setPhase("start");
  }

  // Theme-driven background
  const bg = useMemo(() => {
    if (!character || phase === "start") {
      return "radial-gradient(ellipse at top, #f8fafc 0%, #f1f5f9 45%, #e2e8f0 100%)";
    }
    return character.theme.bgGradient;
  }, [character, phase]);

  return (
    <div
      className="min-h-screen w-full font-sans antialiased transition-[background] duration-700"
      style={{ background: bg }}
    >
      {phase === "start" && <StartScreen onStart={startGame} />}

      {phase === "game" && character && entry && (
        <GameScreen
          character={character}
          entry={entry}
          onWin={handleWin}
          onGiveUp={handleGiveUp}
        />
      )}

      {phase === "result" && character && entry && (
        <ResultScreen
          outcome={outcome}
          character={character}
          secretWord={entry.word}
          stats={stats}
          onPlayAgain={playAgain}
          onChangeCharacter={changeCharacter}
        />
      )}
    </div>
  );
}

export default App;
