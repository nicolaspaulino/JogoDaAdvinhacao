import type { Character } from "./types";

export const CHARACTERS: Character[] = [
  {
    id: "rat",
    difficulty: "easy",
    emoji: "🐭",
    name: "Remy",
    species: "O Rato",
    tagline: "Brincalhão e cheio de energia",
    greeting:
      "Squeak! Que bom que você chegou! Euzinho escolhi uma palavra super legal — bora adivinhar? Você consegue, eu acredito em você! 🧀",
    thinking: [
      "Squeak! Deixa euzinho pensar...",
      "Humm, deixa eu cheirar essa pergunta... 🐭",
      "Ah! Boa pergunta! Ratinhos sabem muito sobre isso!",
      "Squeeeak! Pensando, pensando...",
    ],
    answers: {
      sim: [
        "Squeak squeak! SIM! Você está quentíssimo! 🎉",
        "Sim senhor! Euzinho concorda totalmente!",
        "SIM! Você acertou em cheio, squeak!",
      ],
      nao: [
        "Squeak... não, não, não. Tenta de outro jeito!",
        "Hmm, não é não. Mas não desanima, hein!",
        "Nada a ver! Mas você tá indo bem, squeak!",
      ],
      talvez: [
        "Hmm, euzinho não sei dizer bem... talvez?",
        "Squeak... isso é meio meio. Talvez sim, talvez não!",
        "Euzinho acho que... meio a meio. Talvez!",
      ],
    },
    victory: [
      "SQUEAK SQUEAK SQUEAK! VOCÊ CONSEGUIU! Euzinho tá tão orgulhoso! 🎉🧀",
      "Você é incrível! Adivinhou direitinho! Agora vamos comer queijo? 🎉",
    ],
    defeat: [
      "Aww, não foi dessa vez! Mas você tentou muito, squeak! 🐭",
      "Não fica triste! Euzinho escolhe uma palavra mais fácil na próxima!",
    ],
    giveUp: [
      "Tudo bem, squeak! Euzinho revelo o segredinho! 🐭",
      "Ah, você desistiu? Sem problemas! Olha o que era:",
    ],
    hints: {
      intro: [
        "Squeak! Tá com dificuldade? Euzinho te ajudo! 🐭",
        "Tá tudo bem pedir ajuda! Olha a dica do ratinho:",
      ],
      reveal: [
        "Squeak! Aqui vai uma dica pra você: 🐭",
        "Euzinho sussurra uma dica... presta atenção!",
      ],
    },
    theme: {
      bg: "from-amber-50 via-orange-50 to-yellow-50",
      bgGradient: "radial-gradient(ellipse at top, #fef3c7 0%, #fffbeb 45%, #fff7ed 100%)",
      accent: "amber-500",
      accentSoft: "amber-100",
      accentText: "text-amber-700",
      accentBorder: "border-amber-300",
      cardBg: "bg-white/80",
      bubble: "bg-amber-50 border-amber-200",
      bubbleText: "text-amber-900",
      input: "bg-white/90",
      inputBorder: "border-amber-300",
      primaryBtn: "bg-amber-500 hover:bg-amber-600",
      primaryBtnHover: "hover:bg-amber-600",
      secondaryBtn: "bg-amber-100 hover:bg-amber-200 text-amber-800",
      secondaryBtnHover: "hover:bg-amber-200",
      glow: "shadow-amber-200/60",
      ring: "ring-amber-400",
      text: "text-amber-950",
      textMuted: "text-amber-700/70",
      badge: "bg-amber-100 text-amber-800",
    },
  },
  {
    id: "fox",
    difficulty: "medium",
    emoji: "🦊",
    name: "Rosa",
    species: "A Raposa",
    tagline: "Astuta e cheia de comentários espirituosos",
    greeting:
      "Ora, ora, veja só quem chegou para me fazer pensar... 🦊 Vamos lá, mortal. Escolhi algo mais... interessante. Será que sua mente é afiada quanto a minha?",
    thinking: [
      "Hmm, deixa-me avaliar isso com cuidado... 🦊",
      "Sagacidade ativada... processando sua pergunta...",
      "Ah, espertinho, hein? Vamos analisar...",
      "A raposa pensa... e a raposa responde...",
    ],
    answers: {
      sim: [
        "Muito bem, detetive. SIM. Você farejou o caminho certo. 🦊",
        "Sim! Sua intuição é quase tão boa quanto a minha. Quase.",
        "SIM. Você está mais perto do que imagina... cuidado.",
      ],
      nao: [
        "Não. Mas admirei a tentativa — quem não arrisca não petisca. 🦊",
        "Nada disso. A raposa é paciente; você precisa ser também.",
        "Não. Mas não fique aí de orelha caída, refine a pergunta.",
      ],
      talvez: [
        "Hmm, essa é das nebulosas. Talvez. 🦊",
        "Talvez sim, talvez não — a vida é cheia de nuances, sabia?",
        "Irrelevante... ou seria? Vou deixar no 'talvez'.",
      ],
    },
    victory: [
      "Impressionante! Você me venceu com astúcia. Respeito. 🦊🎉",
      "Que esperteza a sua! A raposa curva-se diante do vencedor. 🎉",
    ],
    defeat: [
      "Foi uma boa caçada, mas a raposa escapou desta vez. 🦊",
      "Quase! Na próxima, talvez você me apanhe. Talvez.",
    ],
    giveUp: [
      "Tudo bem, nem toda caçada é bem-sucedida. Aqui está meu segredo: 🦊",
      "Você rendeu-se? Que pena. A raposa revela, então:",
    ],
    hints: {
      intro: [
        "Hum, atolado? A raposa generosa te dá uma pista... 🦊",
        "Tudo bem, detetive. Eis uma dica para aguçar o faro:",
      ],
      reveal: [
        "A raposa sussurra uma pista. Preste atenção:",
        "Que espertinho, pedindo dica... aqui vai:",
      ],
    },
    theme: {
      bg: "from-orange-50 via-rose-50 to-amber-50",
      bgGradient: "radial-gradient(ellipse at top, #ffe4e6 0%, #fff7ed 45%, #fff1f2 100%)",
      accent: "rose-500",
      accentSoft: "rose-100",
      accentText: "text-rose-700",
      accentBorder: "border-rose-300",
      cardBg: "bg-white/80",
      bubble: "bg-rose-50 border-rose-200",
      bubbleText: "text-rose-900",
      input: "bg-white/90",
      inputBorder: "border-rose-300",
      primaryBtn: "bg-rose-500 hover:bg-rose-600",
      primaryBtnHover: "hover:bg-rose-600",
      secondaryBtn: "bg-rose-100 hover:bg-rose-200 text-rose-800",
      secondaryBtnHover: "hover:bg-rose-200",
      glow: "shadow-rose-200/60",
      ring: "ring-rose-400",
      text: "text-rose-950",
      textMuted: "text-rose-700/70",
      badge: "bg-rose-100 text-rose-800",
    },
  },
  {
    id: "cthulhu",
    difficulty: "hard",
    emoji: "🐙",
    name: "Cthulhu",
    species: "O Abissal",
    tagline: "Cósmico, misterioso e um pouco assustador",
    greeting:
      "Mortal insignificante... ousas desafiar a mente que dorme nas profundezas? Muito bem. Escolhi uma palavra além do seu entendimento. Sua mente perecerá tentando... 🐙",
    thinking: [
      "Mortal insignificante, sua mente perecerá tentando...",
      "Os antigos sussurram... processando...",
      "No abismo, o tempo é uma ilusão. Aguarde...",
      "Cthulhu f'tagn... contemplating your query...",
    ],
    answers: {
      sim: [
        "Sim. Os antigos confirmam. Você tocou a verdade cósmica. 🐙",
        "SIM. Mas o preço do conhecimento é a sanidade...",
        "Sim. Nos abismos, esta resposta reverbera eternamente.",
      ],
      nao: [
        "Não. Sua mente mortal não compreende as profundezas. 🐙",
        "Não. Mas a escuridão abraça todos os que erram.",
        "Não. Os deuses antigos riem de sua confusão.",
      ],
      talvez: [
        "Irrelevante. Algumas verdades flutuam além do sim e do não. 🐙",
        "Talvez... o véu entre os mundos é tênue aqui.",
        "Indiferença cósmica. Sua pergunta não perturba o abismo.",
      ],
    },
    victory: [
      "Impossível... Você decifrou o indescifrável. Cthulhu recolhe-se, impressionado. 🐙",
      "Ainda que sua mente sobreviva, você venceu. Os antigos lembrarão de você... para sempre.",
    ],
    defeat: [
      "Como esperado, mortal. Sua mente era apenas poeira diante do abismo. 🐙",
      "A escuridão reclama mais um. Sua sanidade não resistiu. Até nunca.",
    ],
    giveUp: [
      "Arenda-se, mortal? Compreensível. O abismo revela o que estava oculto: 🐙",
      "Sua mente se curva. Eis o que você jamais alcançaria:",
    ],
    hints: {
      intro: [
        "Mortal implorando por pistas? Que patético... mas o abismo é generoso. 🐙",
        "Até os deuses antigos concedem favores. Ouça bem:",
      ],
      reveal: [
        "Os antigos sussurram uma verdade parcial... receba-a:",
        "O abismo cede uma faísca de conhecimento. Use-a:",
      ],
    },
    theme: {
      bg: "from-slate-900 via-purple-950 to-slate-900",
      bgGradient:
        "radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 45%, #020617 100%)",
      accent: "purple-400",
      accentSoft: "purple-900",
      accentText: "text-purple-300",
      accentBorder: "border-purple-700",
      cardBg: "bg-slate-900/80",
      bubble: "bg-slate-800/90 border-purple-700",
      bubbleText: "text-purple-100",
      input: "bg-slate-800/90",
      inputBorder: "border-purple-700",
      primaryBtn: "bg-purple-600 hover:bg-purple-700",
      primaryBtnHover: "hover:bg-purple-700",
      secondaryBtn: "bg-slate-700 hover:bg-slate-600 text-purple-200",
      secondaryBtnHover: "hover:bg-slate-600",
      glow: "shadow-purple-900/60",
      ring: "ring-purple-500",
      text: "text-slate-100",
      textMuted: "text-slate-400",
      badge: "bg-purple-900 text-purple-300",
    },
  },
];

export function getCharacter(id: string): Character {
  const c = CHARACTERS.find((ch) => ch.id === id);
  if (!c) throw new Error(`Unknown character: ${id}`);
  return c;
}
