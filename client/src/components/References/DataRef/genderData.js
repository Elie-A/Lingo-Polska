const gendersData = {
  genders: {
    title: "Genders in Polish",
    description:
      "Polish nouns are categorized by gender: masculine, feminine, or neuter. Gender affects adjectives, pronouns, and verb forms.",
    modalTitle: "Polish Noun Genders",
    columns: ["Gender", "Example Noun", "Notes & Tips"],
    rows: [
      [
        "Masculine",
        "kot",
        "Usually ends in a consonant. Includes most male persons. Animate vs inanimate affects past tense verb forms.",
      ],
      [
        "Feminine",
        "kotka",
        "Usually ends in -a. Includes most female persons. Some feminine nouns do not end in -a (e.g., kobieta, noc).",
      ],
      [
        "Neuter",
        "okno",
        "Usually ends in -o, -e, or -um. Some borrowed words also count as neuter (e.g., muzeum).",
      ],
    ],
    exceptions: [
      "Some masculine nouns end in -a (e.g., mężczyzna, tata).",
      "Some feminine nouns don't end in -a (e.g., kobieta, noc).",
      "Some neuter nouns can have other endings, especially borrowed words (e.g., muzeum).",
    ],
    tips: "Remember: Gender affects adjectives, pronouns, and verb forms, especially in past tense for masculine nouns.",
  },

  masculineTypes: {
    title: "Masculine Nouns: Animate vs Inanimate",
    description:
      "Animate vs inanimate masculine nouns affect verb conjugation in the past tense and adjectives.",
    modalTitle: "Animate & Inanimate Masculine Nouns",
    columns: ["Type", "Example Noun", "Notes"],
    rows: [
      [
        "Animate Masculine",
        "mężczyzna",
        "Refers to living male beings. Past tense verbs take masculine forms.",
      ],
      [
        "Animate Masculine",
        "kot",
        "Refers to male animals. Past tense verbs take masculine forms.",
      ],
      [
        "Inanimate Masculine",
        "stół",
        "Refers to non-living objects. Past tense verbs take neuter singular forms in singular.",
      ],
      [
        "Inanimate Masculine",
        "samochód",
        "Refers to objects or things. Verbs follow inanimate masculine agreement rules.",
      ],
    ],
    footerText:
      "Animate masculine nouns include male humans and animals. Inanimate masculine nouns include objects and things. This distinction affects verb forms in past tense.",
  },
};

export default gendersData;
