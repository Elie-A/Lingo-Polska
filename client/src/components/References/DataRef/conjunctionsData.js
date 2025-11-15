const conjunctionsData = {
  conjunctions: {
    title: "Polish Conjunctions",
    description:
      "Conjunctions (spójniki) connect words, phrases, and clauses. They are indeclinable — never changing form but can influence word order, verb mood, and punctuation. Below are the main categories with detailed examples and grammar_notes.",
    sections: [
      {
        id: "coordinating",
        title: "Coordinating (Spójniki współrzędne)",
        description:
          "Connect equal grammatical structures — words, phrases, or independent clauses",
        modalTitle: "Coordinating Conjunctions — Spójniki współrzędne",
        modalDescription:
          "These join equal grammatical elements (two nouns, two clauses, etc.). They do not affect case but can require commas depending on usage.",
        columns: [
          "Conjunction",
          "Meaning",
          "Example (Polish)",
          "Translation",
          "grammar_notes",
        ],
        rows: [
          [
            "i / oraz",
            "and",
            "Mam kota i psa.",
            "I have a cat and a dog.",
            "Both nouns share the same case (Accusative).",
          ],
          [
            "a",
            "and / but (contrast)",
            "Ja lubię kawę, a on herbatę.",
            "I like coffee, and he (likes) tea.",
            "Often connects contrasting subjects.",
          ],
          [
            "ale / lecz",
            "but",
            "Chciałem odpocząć, ale muszę pracować.",
            "I wanted to rest, but I must work.",
            "Comma before conjunction required.",
          ],
          [
            "lub / albo",
            "or",
            "Chcesz kawę lub herbatę?",
            "Do you want coffee or tea?",
            "Lub = inclusive, albo = exclusive.",
          ],
          [
            "ani",
            "nor",
            "Nie mam ani czasu, ani pieniędzy.",
            "I have neither time nor money.",
            "Used only with negative verbs.",
          ],
          [
            "więc / dlatego",
            "so, therefore",
            "Było zimno, więc poszedłem do domu.",
            "It was cold, so I went home.",
            "Expresses result or consequence.",
          ],
        ],
      },
      {
        id: "subordinating",
        title: "Subordinating (Spójniki podrzędne)",
        description:
          "Introduce dependent clauses, often changing word order or verb mood",
        modalTitle: "Subordinating Conjunctions — Spójniki podrzędne",
        modalDescription:
          "Introduce dependent clauses (subordinate). They often affect verb mood (conditional, indicative) and word order.",
        columns: [
          "Conjunction",
          "Meaning",
          "Example (Polish)",
          "Translation",
          "grammar_notes",
        ],
        rows: [
          [
            "że",
            "that",
            "Wiem, że on przyjdzie.",
            "I know that he will come.",
            "Common after verbs of saying/thinking.",
          ],
          [
            "bo / ponieważ / gdyż",
            "because",
            "Nie przyszedł, bo był chory.",
            "He didn't come because he was sick.",
            "Bo informal, ponieważ neutral, gdyż formal.",
          ],
          [
            "jeśli / jeżeli / gdyby",
            "if",
            "Jeśli masz czas, zadzwoń.",
            "If you have time, call me.",
            "Gdyby triggers conditional mood.",
          ],
          [
            "zanim / dopóki",
            "before / until",
            "Czekaj, dopóki nie wrócę.",
            "Wait until I return.",
            "Dopóki uses 'nie' even in positive sense.",
          ],
          [
            "żeby / aby",
            "so that, in order to",
            "Uczę się, żeby zdać egzamin.",
            "I study in order to pass the exam.",
            "Usually followed by infinitive or conditional.",
          ],
        ],
      },
      {
        id: "correlative",
        title: "Correlative (Spójniki parzyste)",
        description:
          "Appear in pairs, connecting equivalent elements for emphasis or contrast.",
        modalTitle: "Correlative Conjunctions — Spójniki parzyste",
        modalDescription:
          "Used in pairs for emphasis or comparison. Both parts must share the same grammatical case.",
        columns: ["Conjunction", "Meaning", "Example", "Translation", "Notes"],
        rows: [
          [
            "zarówno... jak i...",
            "both... and...",
            "Zarówno ja, jak i on lubimy muzykę.",
            "Both I and he like music.",
            "Parallel structure required.",
          ],
          [
            "ani... ani...",
            "neither... nor...",
            "Nie mam ani czasu, ani energii.",
            "I have neither time nor energy.",
            "Verb must be negative.",
          ],
          [
            "albo... albo...",
            "either... or...",
            "Albo pójdziesz, albo zostaniesz.",
            "Either you go or you stay.",
            "Exclusive choice.",
          ],
          [
            "czy... czy...",
            "whether... or...",
            "Nie wiem, czy przyjdzie, czy nie.",
            "I don't know whether he'll come or not.",
            "Used in indirect questions.",
          ],
        ],
      },
      {
        id: "conjunctive-adverb",
        title: "Conjunctive Adverbs (Przysłówki spójnikowe)",
        description:
          "Adverbs that act like conjunctions, linking sentences logically.",
        modalTitle: "Conjunctive Adverbs — Przysłówki spójnikowe",
        modalDescription:
          "They behave like conjunctions, linking sentences logically while remaining adverbs.",
        columns: ["Word", "Meaning", "Example", "Translation"],
        rows: [
          [
            "dlatego",
            "therefore",
            "Nie miałem czasu, dlatego nie przyszedłem.",
            "I didn't have time, therefore I didn't come.",
          ],
          [
            "jednak",
            "however",
            "Chciałem pomóc, jednak było za późno.",
            "I wanted to help, however it was too late.",
          ],
          [
            "tymczasem",
            "meanwhile",
            "Ona gotowała, tymczasem on oglądał TV.",
            "She was cooking, meanwhile he was watching TV.",
          ],
        ],
      },
      {
        id: "contrast",
        title: "Contrast",
        description: "Express opposition or contrast between ideas",
        modalTitle: "Contrastive Conjunctions — Przeciwstawne",
        modalDescription: "Used to contrast ideas or express contradiction.",
        columns: ["Conjunction", "Meaning", "Example", "Translation"],
        rows: [
          [
            "chociaż / choć / mimo że",
            "although",
            "Chociaż pada, idziemy na spacer.",
            "Although it's raining, we're going for a walk.",
          ],
          [
            "a jednak",
            "and yet",
            "Był zmęczony, a jednak pracował dalej.",
            "He was tired, and yet he kept working.",
          ],
          [
            "natomiast",
            "whereas",
            "Ja lubię kawę, natomiast on herbatę.",
            "I like coffee, whereas he likes tea.",
          ],
        ],
      },
      {
        id: "cause-purpose",
        title: "Cause / Purpose",
        description: "Introduce clauses of cause, reason, or purpose",
        modalTitle: "Cause & Purpose Conjunctions — Przyczynowe i celowe",
        modalDescription:
          "Express cause, purpose, or reason. Often govern verb mood (indicative or conditional).",
        columns: [
          "Conjunction",
          "Meaning",
          "Example",
          "Translation",
          "Verb Form",
        ],
        rows: [
          [
            "bo / ponieważ",
            "because",
            "Nie idę, bo pada.",
            "I'm not going because it's raining.",
            "Indicative mood.",
          ],
          [
            "żeby / aby",
            "so that, in order to",
            "Ucz się, aby zdać egzamin.",
            "Study in order to pass the exam.",
            "Infinitive or conditional.",
          ],
          [
            "więc",
            "so, therefore",
            "Było zimno, więc wróciłem.",
            "It was cold, so I returned.",
            "Indicative mood.",
          ],
        ],
      },
      {
        id: "conj-summary",
        title: "Summary / Overview",
        description: "All main conjunction categories at a glance.",
        modalTitle: "Summary of Polish Conjunctions",
        modalDescription:
          "Polish conjunctions can be grouped into coordinating, subordinating, correlative, contrastive, and causal types. They are indeclinable but can affect word order, mood, and comma placement.",
        summaryPoints: [
          "Coordinating: i, a, ale, lub, ani, więc",
          "Subordinating: że, bo, ponieważ, gdy, jeśli, żeby, zanim",
          "Correlative: zarówno... jak i..., ani... ani..., albo... albo...",
          "Contrastive: chociaż, natomiast, a jednak",
          "Causal/Purpose: bo, ponieważ, żeby, aby, więc",
        ],
      },
    ],
  },
};

export default conjunctionsData;
