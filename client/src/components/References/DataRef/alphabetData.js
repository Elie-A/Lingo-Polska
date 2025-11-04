const alphabetData = {
  letters: {
    title: "Letters A–Ż",
    description: "Polish letters and pronunciation / Polskie litery i wymowa",
    modalTitle: "Polish Alphabet Letters",
    columns: ["Letter", "Name", "Pronunciation Hint"],
    rows: [
      ["A", "a", 'like "a" in car'],
      ["Ą", "ą", 'nasal "o", like own'],
      ["B", "be", "like English b"],
      ["C", "ce", "like ts in cats"],
      ["Ć", "cie", 'soft "ch", like cheese'],
      ["D", "de", "like English d"],
      ["E", "e", "like e in pet"],
      ["Ę", "ę", "nasal e, like end"],
      ["F", "ef", "like English f"],
      ["G", "ge", 'hard "g", like go'],
      ["H", "ha", "like English h"],
      ["I", "i", "like ee in see"],
      ["J", "jot", "like y in yes"],
      ["K", "ka", "like English k"],
      ["L", "el", "like English l"],
      ["Ł", "eł", "like w in water"],
      ["M", "em", "like English m"],
      ["N", "en", "like English n"],
      ["Ń", "eń", "like Spanish ñ, soft ny"],
      ["O", "o", "like o in order"],
      ["Ó", "ó", "like oo in boot"],
      ["P", "pe", "like English p"],
      ["R", "er", 'rolled "r"'],
      ["S", "es", "like s in see"],
      ["Ś", "eś", "soft sh"],
      ["T", "te", "like English t"],
      ["U", "u", "like oo in boot"],
      ["W", "wu", "like English v"],
      ["Y", "y", "like i in bit (deeper)"],
      ["Z", "zet", "like z in zoo"],
      ["Ź", "źe", "soft zh, like vision"],
      ["Ż", "żet", "hard zh, like treasure"],
    ],
  },

  digraphs: {
    title: "Digraphs",
    description:
      "Letter combinations & pronunciation / Kombinacje liter i wymowa",
    modalTitle: "Polish Digraphs",
    columns: ["Combination", "Pronunciation Hint", "Notes"],
    rows: [
      ["Ch", "like English h", "Phonetically identical to h"],
      ["Cz", "like ch in chocolate", "Harder than ć"],
      ["Dz", "like ds in kids", "Only before vowels"],
      ["Dź", "soft j, like jeans", "Softer than dz"],
      ["Dż", "like j in jungle", "Hard version of dź"],
      ["Rz", "like ż (hard zh)", "Different spelling contexts"],
      ["Sz", "like sh in shut", "Harder than ś"],
    ],
    footerText:
      "Important distinctions: Ś vs Sz, Ć vs Cz, Ź vs Ż, Dź vs Dż — the first is softer, the second harder.",
  },

  trigraphs: {
    title: "Trigraphs",
    description:
      "Common 3-letter combinations / Typowe kombinacje trzech liter",
    modalTitle: "Polish Trigraphs",
    columns: ["Trigraph", "Pronunciation Hint", "Notes"],
    rows: [
      ["Dzi", "like dź + i, sounds like jeans", "Soft, behaves like dź"],
      ["Rze", "like ż or rz", "Occurs in words like rzeka"],
      ["Się", "like ś + e, sh-eh", "Common reflexive particle"],
      ["Cie", "like ć + e, cheh", "Seen in words like ciepło"],
      ["Nie", "like ń + e, nyeh", 'From niebo ("sky"), nie ("not")'],
      ["Zie", "like ź + e, zh-eh", "In words like ziemia"],
    ],
  },

  hardsoftconsonants: {
    title: "Hard & Soft Consonants",
    description:
      "Differentiate between hard & soft consonants / Rozróżnij spółgłoski twarde i miękkie",
    modalTitle: "Polish Hard & Soft Consonants",
    columns: ["Category", "Consonants", "Notes & Examples"],
    rows: [
      [
        "Hard Consonants",
        "p, b, f, w, m, t, d, s, z, n, ł, r, k, g, ch, cz, dz, sz, ż",
        "Do not change before endings.\nExamples:\n• dom → domu\n• kot → koty\n• most → mosty",
      ],
      [
        "Soft Consonants / Palatalized Stems",
        "ć, dź, ś, ź, ń, l, j",
        "Soft stems often change before endings: -i, -e, -y.\nExamples:\n• kaczka → kaczki (ć → ci)\n• liść → liście (ś → si)\n• dzień → dni (ń → ni)\nOften affects diminutives, adjectives, and verb conjugations.",
      ],
    ],
    customRowClass: (index) => (index === 0 ? "hard-row" : "soft-row"),
  },
};

export default alphabetData;
