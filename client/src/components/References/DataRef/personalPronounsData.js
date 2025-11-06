const personalPronounsData = {
  pronouns: {
    title: "Polish Personal Pronouns: Full Declensions",
    description:
      "See how personal pronouns change in all 7 cases with gender and number.",
    sections: [
      {
        id: "ja",
        title: "Ja (I)",
        questions: "Kto? Co?",
        usage: "First person singular / Pierwsza osoba liczby pojedynczej",
        modalTitle: "Ja – First Person Singular",
        description: "Refers to the speaker themselves.",
        tables: [
          {
            title: "Singular",
            subjectPronoun: "ja",
            columns: ["Case", "Form"],
            rows: [
              ["Nominative", "ja"],
              ["Genitive", "mnie"],
              ["Dative", "mi"],
              ["Accusative", "mnie"],
              ["Instrumental", "mną"],
              ["Locative", "mnie"],
              ["Vocative", "ja"],
            ],
          },
        ],
      },
      {
        id: "ty",
        title: "Ty (You - singular)",
        questions: "Kto? Co?",
        usage: "Second person singular / Druga osoba liczby pojedynczej",
        modalTitle: "Ty – Second Person Singular",
        description: "Refers to the person being addressed.",
        tables: [
          {
            title: "Singular",
            subjectPronoun: "ty",
            columns: ["Case", "Form"],
            rows: [
              ["Nominative", "ty"],
              ["Genitive", "ciebie / cię"],
              ["Dative", "tobie / ci"],
              ["Accusative", "ciebie / cię"],
              ["Instrumental", "tobą"],
              ["Locative", "tobie"],
              ["Vocative", "ty"],
            ],
          },
        ],
      },
      {
        id: "on",
        title: "On (He)",
        questions: "Kto? Co?",
        usage:
          "Third person masculine singular / Trzecia osoba liczby pojedynczej rodzaju męskiego",
        modalTitle: "On – Third Person Singular",
        description:
          "Refers to a male person, object, or a group of people/objects in plural.",
        tables: [
          {
            title: "Singular",
            subjectPronoun: "on (masculine)",
            columns: ["Case", "Masculine (on)"],
            rows: [
              ["Nominative", "on"],
              ["Genitive", "jego / go / niego"],
              ["Dative", "jemu / mu / niemu"],
              ["Accusative", "jego / go / niego"],
              ["Instrumental", "nim"],
              ["Locative", "nim"],
              ["Vocative", "on"],
            ],
          },
        ],
      },
      {
        id: "ona",
        title: "Ona (She)",
        questions: "Kto? Co?",
        usage:
          "Third person feminine singular / Trzecia osoba liczby pojedynczej rodzaju żeńskiego",
        modalTitle: "Ona – Third Person Singular",
        description: "Refers to a female person or group of females.",
        tables: [
          {
            title: "Singular",
            subjectPronoun: "ona",
            columns: ["Case", "Form"],
            rows: [
              ["Nominative", "ona"],
              ["Genitive", "jej / niej"],
              ["Dative", "jej / niej"],
              ["Accusative", "ją / nią"],
              ["Instrumental", "nią"],
              ["Locative", "niej"],
              ["Vocative", "ona"],
            ],
          },
        ],
      },
      {
        id: "ono",
        title: "Ono (It)",
        questions: "Kto? Co?",
        usage:
          "Third person neuter singular / Trzecia osoba liczby pojedynczej rodzaju nijakiego",
        modalTitle: "Ono – Third Person Neuter Singular",
        description:
          "Refers to a neuter noun (thing, animal, concept) in singular, and to neuter.",
        tables: [
          {
            title: "Singular",
            subjectPronoun: "ono",
            columns: ["Case", "Form"],
            rows: [
              ["Nominative", "ono"],
              ["Genitive", "jego / go / niego"],
              ["Dative", "jemu / mu / niemu"],
              ["Accusative", "je / jego / go / niego"],
              ["Instrumental", "nim"],
              ["Locative", "nim"],
              ["Vocative", "ono"],
            ],
          },
        ],
      },
      {
        id: "my",
        title: "My (We)",
        questions: "Kto? Co?",
        usage: "First person plural / Pierwsza osoba liczby mnogiej",
        modalTitle: "My – First Person Plural",
        description: "Refers to the speaker and others (we).",
        tables: [
          {
            title: "Subject pronoun",
            subjectPronoun: "my",
            columns: ["Case", "Form"],
            rows: [
              ["Nominative", "my"],
              ["Genitive", "nas"],
              ["Dative", "nam"],
              ["Accusative", "nas"],
              ["Instrumental", "nami"],
              ["Locative", "nas"],
              ["Vocative", "my"],
            ],
          },
        ],
      },
      {
        id: "wy",
        title: "Wy (You - plural)",
        questions: "Kto? Co?",
        usage: "Second person plural / Druga osoba liczby mnogiej",
        modalTitle: "Wy – Second Person Plural",
        description:
          "Refers to the people being addressed (you all, informal plural).",
        tables: [
          {
            title: "Subject pronoun",
            subjectPronoun: "wy",
            columns: ["Case", "Form"],
            rows: [
              ["Nominative", "wy"],
              ["Genitive", "was"],
              ["Dative", "wam"],
              ["Accusative", "was"],
              ["Instrumental", "wami"],
              ["Locative", "was"],
              ["Vocative", "wy"],
            ],
          },
        ],
      },
      {
        id: "oni",
        title: "Oni (They - masculine)",
        questions: "Kto? Co?",
        usage:
          "Third person masculine plural / Trzecia osoba liczby mnogiej rodzaju męskiego",
        modalTitle: "Oni – Third Person Plural",
        description:
          "Refers to a group of people including at least one male (masculine personal plural).",
        tables: [
          {
            title: "Plural",
            subjectPronoun: "oni",
            columns: ["Case", "Form"],
            rows: [
              ["Nominative", "oni"],
              ["Genitive", "ich / nich"],
              ["Dative", "im / nim"],
              ["Accusative", "ich / nich"],
              ["Instrumental", "nimi"],
              ["Locative", "nich"],
              ["Vocative", "oni"],
            ],
          },
        ],
      },
      {
        id: "one",
        title: "One (They - feminine/neuter)",
        questions: "Kto? Co?",
        usage:
          "Third person feminine/neuter plural / Trzecia osoba liczby mnogiej rodzaju żeńskiego lub nijakiego",
        modalTitle: "One – Third Person Plural (Neuter/Non-Masculine Personal)",
        description:
          "Refers to a group of people or things without masculine personal gender.",
        tables: [
          {
            title: "Plural",
            subjectPronoun: "one",
            columns: ["Case", "Form"],
            rows: [
              ["Nominative", "one"],
              ["Genitive", "ich / nich"],
              ["Dative", "im / nim"],
              ["Accusative", "je"],
              ["Instrumental", "nimi"],
              ["Locative", "nich"],
              ["Vocative", "one"],
            ],
          },
        ],
      },
    ],
  },
};

export default personalPronounsData;
