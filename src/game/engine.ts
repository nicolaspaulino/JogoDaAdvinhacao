import type { AnswerType, WordEntry } from "./types";

/** Lowercase + strip accents/punctuation for matching. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Levenshtein distance for fuzzy word comparison. */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

/** Keyword -> [attributeKey, expectedValue]. Answer is sim/nao/talvez based on word's attr value. */
interface Rule {
  keywords: string[];
  attr: string;
  // if attr value === one of these -> sim; if opposite -> nao; else talvez
  truthy?: string[];
  falsy?: string[];
  // polarity: normal means keyword asserts attribute. negation handled separately.
}

const RULES: Rule[] = [
  {
    keywords: ["animal", "bicho", "criatura", "ser vivo", "vive", "vivo", "ser vivo", "pet", "domestic"],
    attr: "vivo",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["animal", "bicho", "criatura", "pet", "domestico", "domesticado"],
    attr: "animal",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["come", "comer", "comestivel", "comida", "alimento", "engolir", "sabor", "gosto", "cheira bem", "cheiroso"],
    attr: "comestivel",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["vermelh", "vermelha", "vermelho"],
    attr: "cor",
    truthy: ["vermelha"],
  },
  {
    keywords: ["verde"],
    attr: "cor",
    truthy: ["verde"],
  },
  {
    keywords: ["amarela", "amarelo", "amarelas"],
    attr: "cor",
    truthy: ["amarela"],
  },
  {
    keywords: ["azul"],
    attr: "cor",
    truthy: ["azul"],
  },
  {
    keywords: ["branca", "branco", "brancas"],
    attr: "cor",
    truthy: ["branca"],
  },
  {
    keywords: ["preta", "preto", "pretas"],
    attr: "cor",
    truthy: ["preta"],
  },
  {
    keywords: ["marrom", "castanho"],
    attr: "cor",
    truthy: ["marrom"],
  },
  {
    keywords: ["colorida", "colorido", "coloridas", "cores", "arco iris", "colorida"],
    attr: "cor",
    truthy: ["colorida", "colorido"],
  },
  {
    keywords: ["redondo", "redonda", "circulo", "circular", "bola", "esfera", "arredondada", "redondinho"],
    attr: "redondo",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["quadrado", "quadrada", "retangular", "retangulo", "quadrado"],
    attr: "redondo",
    truthy: ["nao"],
    falsy: ["sim"],
  },
  {
    keywords: ["comprido", "comprida", "longa", "longo", "alongada", "compridas", "estriado"],
    attr: "comprido",
    truthy: ["sim"],
  },
  {
    keywords: ["cresce", "planta", "cultiva", "nasce da terra", "semente", "raiz", "folha", "folhas", "jardim", "horta", "arvore", "arvores", "flor", "flores", "vegetal"],
    attr: "cresce",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["objeto", "coisa", "item", "artefato", "utensilio", "ferramenta"],
    attr: "objeto",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["lugar", "local", "destino", "cidade", "pais", "regiao", "edificio", "construcao", "ambiente", "passagem"],
    attr: "lugar",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["liquido", "molhado", "molhada", "umed", "liquida", "liquidos"],
    attr: "liquido",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["eletronico", "eletronicos", "bateria", "recarregavel", "eletric", "plug", "tomada", "energia", "energetico"],
    attr: "eletronico",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["move", "movimento", "mexe", "anda", "movel", "se move", "se mexe", "desloca", "caminha", "corre", "voa", "voar", "nada", "nadando"],
    attr: "move",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["vivo", "viva", "vida", "respira", "respiracao", "coracao", "sangue", "vivente"],
    attr: "vivo",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["natural", "natureza", "selvagem", "natura", "silvestre", "selva"],
    attr: "natural",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["domestico", "domesticado", "estimacao", "pet", "cao", "gato", "adestrado", "domesticos"],
    attr: "domesticado",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["metal", "metalico", "metálica", "ferro", "aco", "aço", "aluminio", "cobre", "prata", "dourado", "metalizada"],
    attr: "metal",
    truthy: ["sim"],
  },
  {
    keywords: ["madeira", "madeireira", "madeirado", "tronco", "lignificada", "de madeira"],
    attr: "madeira",
    truthy: ["sim"],
  },
  {
    keywords: ["papel", "folheado", "cartolina", "papelao"],
    attr: "papel",
    truthy: ["sim"],
  },
  {
    keywords: ["vidro", "vidrado", "transparente", "cristalino", "translucido", "transparencia"],
    attr: "vidro",
    truthy: ["sim"],
  },
  {
    keywords: ["pedra", "rocha", "marmore", "granito", "calcario", "lapidada", "rochoso"],
    attr: "pedra",
    truthy: ["sim"],
  },
  {
    keywords: ["pelagem", "pelos", "peludo", "peluda", "pelo", "lanoso", "lã", "la"],
    attr: "pelagem",
    truthy: ["sim"],
  },
  {
    keywords: ["musica", "musical", "instrumento", "tocar", "som musical", "notas", "melodia", "harmonia", "ritmo"],
    attr: "musica",
    truthy: ["sim"],
  },
  {
    keywords: ["ler", "leitura", "livro", "livros", "paginas", "texto", "escrito", "biblia", "literatura"],
    attr: "ler",
    truthy: ["sim"],
  },
  {
    keywords: ["abstrato", "abstrata", "conceito", "ideia", "imaterial", "intangivel", "abstracao"],
    attr: "abstrato",
    truthy: ["sim"],
    falsy: ["nao"],
  },
  {
    keywords: ["emocao", "sentimento", "sensacao", "emoção", "triste", "alegre", "raiva", "medo", "amor", "ódio", "odio"],
    attr: "emocao",
    truthy: ["sim"],
  },
  {
    keywords: ["arte", "artistico", "artística", "pintura", "escultura", "obra de arte", "artístico"],
    attr: "arte",
    truthy: ["sim"],
  },
  {
    keywords: ["mitologia", "mitologico", "mitológico", "mortal", "deus", "deuses", "monstro", "lenda", "lendário", "lenda"],
    attr: "mitologia",
    truthy: ["sim"],
  },
  {
    keywords: ["espaco", "espacial", "cosmos", "cosmico", "astronauta", "estrela", "estrelas", "planeta", "galaxia", "universo", "orbita"],
    attr: "espaco",
    truthy: ["sim"],
  },
  {
    keywords: ["ceu", "celestial", "no ceu", "acima", "altura", "alto", "altas"],
    attr: "ceu",
    truthy: ["sim"],
  },
  {
    keywords: ["agua", "aquoso", "aquatica", "molhado", "rio", "mar", "oceano", "lago", "liquido"],
    attr: "agua",
    truthy: ["sim"],
  },
  {
    keywords: ["fogo", "fogo!", "queima", "ardente", "chamas", "incendio", "fogueira", "quente", "calor"],
    attr: "fogo",
    truthy: ["sim"],
  },
  {
    keywords: ["vento", "ventoso", "sopra", "rajada", "furaçao", "furacao", "tempestade", "tempestuoso"],
    attr: "vento",
    truthy: ["sim"],
  },
  {
    keywords: ["tempo", "relogio", "horas", "minutos", "segundos", "medir tempo", "temporal"],
    attr: "tempo",
    truthy: ["sim"],
  },
  {
    keywords: ["antigo", "antiga", "velho", "antiguidade", "antiquado", "historico", "histórico"],
    attr: "antigo",
    truthy: ["sim"],
  },
  {
    keywords: ["grande", "gigante", "enorme", "imenso", "colossal", "vultoso"],
    attr: "grande",
    truthy: ["sim"],
  },
  {
    keywords: ["frio", "gelado", "gélado", "congelado", "baixa temperatura", "nevasca", "polar", "neve"],
    attr: "frio",
    truthy: ["sim"],
  },
  {
    keywords: ["quente", "calor", "ardente", "caloroso", "fervendo", "escaldante"],
    attr: "quente",
    truthy: ["sim"],
  },
  {
    keywords: ["brilha", "brilhante", "luz", "luminoso", "luminosa", "ilumina", "brilho", "reflete", "refletir"],
    attr: "brilha",
    truthy: ["sim"],
  },
  {
    keywords: ["morte", "morto", "falecido", "funebre", "cemiterio", "coveiro", "obito", "cadaver", "defunto"],
    attr: "morte",
    truthy: ["sim"],
  },
  {
    keywords: ["ilusao", "ilusória", "miragem", "engana", "enganoso", "ficticio", "aparencia"],
    attr: "ilusao",
    truthy: ["sim"],
  },
];

const NEGATION_WORDS = [
  "nao",
  "não",
  "nem",
  "nunca",
  "jamais",
  "sem",
  "nenhum",
  "nenhuma",
  "nao e",
  "n e",
];

function hasNegation(norm: string): boolean {
  return NEGATION_WORDS.some((w) => norm.includes(w));
}

function matchAttrValue(
  attrValue: string | string[] | undefined,
  truthy: string[] | undefined,
  falsy: string[] | undefined,
): AnswerType | null {
  if (attrValue === undefined) return null;
  const values = Array.isArray(attrValue) ? attrValue : [attrValue];
  const allValues = values.map((v) => normalize(v));

  if (truthy) {
    const inTruthy = allValues.some((v) => truthy.some((t) => normalize(t) === v));
    if (inTruthy) return "sim";
  }
  if (falsy) {
    const inFalsy = allValues.some((v) => falsy.some((f) => normalize(f) === v));
    if (inFalsy) return "nao";
  }
  // value present but not classified by rule -> talvez
  if (truthy && falsy) {
    // truthy/falsy both defined: anything not in truthy is nao if in falsy, else talvez
    return "talvez";
  }
  if (truthy && !falsy) {
    // attribute exists with a value; truthy match checked. no match -> nao if value is "nao", else talvez
    if (allValues.includes("nao")) return "nao";
    return "talvez";
  }
  if (falsy && !truthy) {
    if (allValues.includes("sim")) return "nao";
    return "talvez";
  }
  return "talvez";
}

/**
 * Analyze a yes/no question against the secret word's attributes.
 * Returns the answer type plus a confidence flag for whether a rule matched.
 */
export interface AnalysisResult {
  answer: AnswerType;
  matched: boolean;
}

export function analyzeQuestion(question: string, entry: WordEntry): AnalysisResult {
  const norm = normalize(question);
  if (!norm) return { answer: "talvez", matched: false };

  const negated = hasNegation(norm);

  // Check: does the question literally ask about the word itself?
  const secretNorm = normalize(entry.word);
  if (norm.includes(secretNorm)) {
    // asking "is it the word itself" -> that's a guess, handled elsewhere.
    // For question flow, treat as sim only if phrased as identity; but to avoid spoilers, return talvez.
    return { answer: "talvez", matched: true };
  }

  for (const rule of RULES) {
    const hit = rule.keywords.some((kw) => norm.includes(normalize(kw)));
    if (!hit) continue;

    const raw = entry.attrs[rule.attr];
    if (raw === undefined) {
      // attribute not defined for this word -> we can't answer truthfully
      // but the player asked something relevant to a category the word isn't tagged with.
      // Heuristic: if attribute is absent, the word isn't (e.g. not alive, not a fruit).
      // Only safe when rule has a clear falsy. Default to nao if the word lacks the trait.
      // We treat absence as "nao" for trait-style rules with truthy=[sim].
      if (rule.truthy && rule.truthy.includes("sim")) {
        return { answer: negated ? "sim" : "nao", matched: true };
      }
      // otherwise truly unknown
      return { answer: "talvez", matched: true };
    }

    let result = matchAttrValue(raw, rule.truthy, rule.falsy);
    if (result === null) result = "talvez";
    if (negated) {
      result = result === "sim" ? "nao" : result === "nao" ? "sim" : "talvez";
    }
    return { answer: result, matched: true };
  }

  // No keyword matched at all -> irrelevante / talvez
  return { answer: "talvez", matched: false };
}

/**
 * Check a direct guess against the secret word, with fuzzy matching.
 */
export function checkGuess(guess: string, entry: WordEntry): { correct: boolean; distance: number } {
  const g = normalize(guess);
  const w = normalize(entry.word);
  if (!g) return { correct: false, distance: Infinity };
  if (g === w) return { correct: true, distance: 0 };
  // Check if guess contains the word or vice-versa (e.g. "um queijo" vs "queijo")
  if (g.includes(w) || w.includes(g)) {
    // require reasonable length to avoid false positives
    if (Math.min(g.length, w.length) >= 3) return { correct: true, distance: 0 };
  }
  // fuzzy: allow small typos for longer words
  const dist = levenshtein(g, w);
  const threshold = Math.max(1, Math.floor(w.length * 0.2));
  if (dist <= threshold) return { correct: true, distance: dist };
  return { correct: false, distance: dist };
}

/**
 * Generate a progressive hint about the secret word.
 * Each call reveals the next trait; order is curated for maximum usefulness.
 * Returns null when no more hints are available.
 */
export function generateHint(entry: WordEntry, hintIndex: number): string | null {
  const traitOrder: { key: string; label: string; format: (v: string | string[]) => string }[] = [
    {
      key: "categoria",
      label: "É da categoria",
      format: (v) => fmtList(v, ["fruta", "comida", "bebida"], "comida"),
    },
    { key: "animal", label: "", format: (v) => (yesNo(v) ? "É um animal 🐾" : "") },
    { key: "objeto", label: "", format: (v) => (yesNo(v) ? "É um objeto físico" : "") },
    { key: "lugar", label: "", format: (v) => (yesNo(v) ? "É um lugar ou local" : "") },
    { key: "abstrato", label: "", format: (v) => (yesNo(v) ? "É algo abstrato, não é um objeto físico" : "") },
    { key: "vivo", label: "", format: (v) => (yesNo(v) ? "É algo vivo" : "Não é algo vivo") },
    { key: "cor", label: "A cor principal é", format: (v) => fmtList(v, [], "") },
    { key: "redondo", label: "", format: (v) => (yesNo(v) ? "Tem formato arredondado" : "") },
    { key: "comestivel", label: "", format: (v) => (yesNo(v) ? "É comestível" : "") },
    { key: "eletronico", label: "", format: (v) => (yesNo(v) ? "É eletrônico" : "") },
    { key: "natural", label: "", format: (v) => (yesNo(v) ? "Existe na natureza" : "É feito pelo ser humano") },
    { key: "musica", label: "", format: (v) => (yesNo(v) ? "Está ligado a música" : "") },
    { key: "arte", label: "", format: (v) => (yesNo(v) ? "Está ligado à arte" : "") },
    { key: "espaco", label: "", format: (v) => (yesNo(v) ? "Tem a ver com o espaço/cosmos" : "") },
    { key: "emocao", label: "", format: (v) => (yesNo(v) ? "É um sentimento ou emoção" : "") },
    { key: "mitologia", label: "", format: (v) => (yesNo(v) ? "Envolve mitologia ou lendas" : "") },
    { key: "agua", label: "", format: (v) => (yesNo(v) ? "Tem a ver com água" : "") },
    { key: "fogo", label: "", format: (v) => (yesNo(v) ? "Tem a ver com fogo ou calor" : "") },
    { key: "ceu", label: "", format: (v) => (yesNo(v) ? "Encontra-se no céu" : "") },
    { key: "move", label: "", format: (v) => (yesNo(v) ? "Pode se mover" : "") },
    { key: "metal", label: "", format: (v) => (yesNo(v) ? "É feito de metal" : "") },
    { key: "madeira", label: "", format: (v) => (yesNo(v) ? "É feito de madeira" : "") },
  ];

  let collected = 0;
  for (const trait of traitOrder) {
    const raw = entry.attrs[trait.key];
    if (raw === undefined) continue;
    const text = trait.format(raw);
    if (!text) continue;
    if (collected === hintIndex) return text;
    collected++;
  }

  // Fallback: reveal first letter
  if (hintIndex === collected) {
    return `Começa com a letra "${entry.word[0].toUpperCase()}".`;
  }
  if (hintIndex === collected + 1) {
    return `Tem ${entry.word.length} letras no total.`;
  }
  return null;
}

function yesNo(v: string | string[]): boolean {
  const arr = Array.isArray(v) ? v : [v];
  return arr.some((x) => normalize(x) === "sim");
}

function fmtList(v: string | string[], synonyms: string[], fallback: string): string {
  const arr = Array.isArray(v) ? v : [v];
  const first = arr[0];
  if (!first) return fallback;
  // pick the first value, capitalize
  return capitalize(first);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
