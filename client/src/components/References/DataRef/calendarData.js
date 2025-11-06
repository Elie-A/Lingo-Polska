const calendarData = {
  calendar: {
    title: "Days, Months & Time in Polish",
    description:
      "Learn Polish days, months, and how to tell the time — with pronunciation and English translations.",
    sections: [
      {
        id: "daysOfWeek",
        title: "Days of the Week",
        description: "Polish days with pronunciation",
        modalTitle: "Days of the Week",
        columns: ["Polish", "Pronunciation", "English"],
        rows: [
          ["poniedziałek", "poh-nyeh-jah-wek", "Monday"],
          ["wtorek", "fto-rek", "Tuesday"],
          ["środa", "shroh-dah", "Wednesday"],
          ["czwartek", "chvahr-tek", "Thursday"],
          ["piątek", "pyawn-tek", "Friday"],
          ["sobota", "soh-boh-tah", "Saturday"],
          ["niedziela", "nyeh-jel-ah", "Sunday"],
        ],
      },
      {
        id: "months",
        title: "Months",
        description: "Polish months with pronunciation",
        modalTitle: "Months",
        columns: ["Polish", "Pronunciation", "English"],
        rows: [
          ["styczeń", "stih-chen", "January"],
          ["luty", "loo-tih", "February"],
          ["marzec", "mah-zhets", "March"],
          ["kwiecień", "kvye-chen", "April"],
          ["maj", "mai", "May"],
          ["czerwiec", "chehr-vyets", "June"],
          ["lipiec", "lee-pyets", "July"],
          ["sierpień", "shyer-pyen", "August"],
          ["wrzesień", "v-zhe-shyen", "September"],
          ["październik", "pahzh-jyer-neek", "October"],
          ["listopad", "leesto-pahd", "November"],
          ["grudzień", "groo-djen", "December"],
        ],
      },
      {
        id: "time",
        title: "Time & Clock",
        description:
          "Learn how to tell the time in Polish with pronunciation and English meanings",
        modalTitle: "Time & Clock — Godzina",
        questionSection: {
          heading: "KTÓRA (JEST) GODZINA?",
          meaning:
            '"What time is it?" — The question uses która (which) and the verb jest (is).',
          examples: [
            ["Jest druga.", "yest droo-gah", "It's two o'clock."],
            [
              "Jest dwadzieścia pięć po czwartej.",
              "yest dvah-djye-shcha pyench poh chfah-rtei",
              "It's twenty-five past four.",
            ],
            [
              "Jest za pięć dziesiąta.",
              "yest zah pyench jeh-shyon-tah",
              "It's five to ten.",
            ],
            [
              "Jest wpół do ósmej.",
              "yest fpwoo doh oos-mei",
              "It's half to eight.",
            ],
          ],
          columns: ["Polish", "Pronunciation", "English"],
        },
        grammarSection: {
          heading: "GODZINY – LICZEBNIKI",
          explanation:
            "GODZINY (hours) use liczebnik porządkowy (ordinal number). MINUTY (minutes) use liczebnik główny (cardinal number).",
          columns: [
            "Time",
            "Structure",
            "Example",
            "Case / Preposition",
            "English",
          ],
          rows: [
            [
              "2:00",
              "... -a",
              "Jest druga.",
              "Nominative",
              "It's two o'clock.",
            ],
            [
              "4:25",
              "... po ... -ej",
              "Jest dwadzieścia pięć po czwartej.",
              "po + Locative",
              "It's twenty-five past four.",
            ],
            [
              "9:55",
              "za ... -a",
              "Jest za pięć dziesiąta.",
              "Nominative",
              "It's five to ten.",
            ],
            [
              "7:30",
              "o wpół do ... -ej",
              "Jest wpół do ósmej.",
              "do + Genitive",
              "It's half to eight.",
            ],
          ],
        },
        sentenceSection: {
          heading: "USING TIME IN SENTENCES",
          exampleQuestion: "What time do you eat? → O której godzinie jesz?",
          explanation: "Here's how to express daily actions using time:",
          columns: [
            "Time",
            "Structure",
            "Example",
            "Case / Preposition",
            "English",
          ],
          rows: [
            [
              "2:00",
              "... -a",
              "Jem o drugiej.",
              "o + Locative",
              "I eat at two o'clock.",
            ],
            [
              "4:25",
              "... po ... -ej",
              "Jem dwadzieścia pięć po czwartej.",
              "po + Locative",
              "I eat at twenty-five past four.",
            ],
            [
              "7:30",
              "o wpół do ... -ej",
              "Jem o wpół do ósmej.",
              "do + Genitive",
              "I eat at half to eight.",
            ],
            [
              "9:55",
              "za ... -a",
              "Jem za pięć dziesiąta.",
              "Nominative",
              "I eat at five to ten.",
            ],
          ],
        },
      },
    ],
  },
};

export default calendarData;
