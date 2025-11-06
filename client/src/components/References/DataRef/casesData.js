const casesData = {
  cases: {
    title: "The 7 Polish Grammar Cases",
    description: "Key questions, usage, and details with examples",
    sections: [
      {
        id: "nominative",
        title: "1. Mianownik (Nominative)",
        questions: "Kto? Co?",
        usage: "Subject of the sentence / Przedmiot zdania",
        modalTitle: "Mianownik (Nominative)",
        description: "Subject of the sentence.",
        tables: [
          {
            title: "Masculine Animate",
            columns: [
              "Ending (sing.)",
              "Example",
              "Ending (pl.)",
              "Example",
              "Notes",
            ],
            rows: [
              ["-ec", "chłopiec", "-cy", "chłopcy", "soft stem palatalization"],
              ["-ec", "ojciec", "-owie", "ojcowie", "irregular plural"],
              ["consonant (-ik)", "wojownik", "-icy", "wojownicy", ""],
              ["consonant", "student", "-ci", "studenci", ""],
              [
                "consonant",
                "profesor",
                "-owie",
                "profesorowie",
                "professions often take -owie",
              ],
              ["-a", "poeta", "-i", "poeci", "rare masculine animate in -a"],
            ],
          },
          {
            title: "Masculine Inanimate",
            columns: [
              "Ending (sing.)",
              "Example",
              "Ending (pl.)",
              "Example",
              "Notes",
            ],
            rows: [
              ["hard consonant", "dom", "-y", "domy", "default hard stem"],
              [
                "soft consonant",
                "koń",
                "-e",
                "konie",
                "soft stem palatalization",
              ],
              ["consonant", "most", "-y", "mosty", "hard stem"],
            ],
          },
          {
            title: "Feminine",
            columns: [
              "Ending (sing.)",
              "Example",
              "Ending (pl.)",
              "Example",
              "Notes",
            ],
            rows: [
              ["-a", "kobieta", "-y", "kobiety", "hard stem"],
              ["-a (soft)", "ziemia", "-e", "ziemie", "soft stem"],
              ["-i", "pani", "-e", "panie", "polite titles"],
              ["-ść", "miłość", "-ści", "miłości", "abstract nouns"],
              ["consonant", "noc", "-e", "noce", "soft stem endings"],
            ],
          },
          {
            title: "Neuter",
            columns: [
              "Ending (sing.)",
              "Example",
              "Ending (pl.)",
              "Example",
              "Notes",
            ],
            rows: [
              ["-o", "okno", "-a", "okna", ""],
              ["-e", "morze", "-a", "morza", ""],
              ["-ę", "imię", "-a", "imiona", "irregular"],
              ["-um", "muzeum", "-a", "muzea", "loanwords"],
            ],
          },
        ],
        notes: [
          "Function: The nominative case marks the subject of the sentence, answering kto? (who?) and co? (what?).",
          "Masculine animate vs. inanimate: Only animate masculine nouns (living beings) take special plural endings like -owie, -i, or -y; inanimate nouns usually take -y or -e.",
          "Feminine: Most end in -a (→ -y / -e in plural), but exceptions like pani, noc, or miłość follow soft patterns.",
          "Neuter: Always ends in -o, -e, -ę, or -um in singular and takes -a in plural.",
          "Palatalization: In plural forms, hard stems often soften: chłopiec → chłopcy, koń → konie.",
          "Irregulars: Some masculine animate nouns use -owie (e.g. ojcowie, profesorowie) for groups of people or professions.",
        ],
      },
      {
        id: "genitive",
        title: "2. Dopełniacz (Genitive)",
        questions: "Kogo? Czego?",
        usage: "Possession, absence, quantity / Posiadanie, brak, ilość",
        modalTitle: "Dopełniacz (Genitive)",
        description: "Possession, negation, quantity.",
        tables: [
          {
            title: "Masculine Animate",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
              "Notes",
            ],
            rows: [
              ["-a", "chłopca", "-ów", "chłopców", "default animate"],
              ["-a", "studenta", "-ów", "studentów", "—"],
              ["-ia", "gościa", "-i", "gości", "soft stems"],
              ["-a", "króla", "-ów", "królów", "high style / titles"],
            ],
          },
          {
            title: "Masculine Inanimate",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
              "Notes",
            ],
            rows: [
              ["-u", "stołu", "-ów", "stołów", "many hard stems"],
              ["-a", "domu", "-ów", "domów", "common for certain nouns"],
              ["-u (soft)", "mostu", "-ów", "mostów", "soft stems"],
            ],
          },
          {
            title: "Feminine",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
              "Notes",
            ],
            rows: [
              ["-y", "kobiety", "-ø", "kobiet", "plural often zero ending"],
              ["-i", "pani", "-ø", "pań", "soft stem zero ending"],
              ["-ii", "komisji", "-ji", "komisji", "loanwords"],
              ["-ej", "nadziei", "-ej", "nadziei", "nouns ending in -eja"],
            ],
          },
          {
            title: "Neuter",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
              "Notes",
            ],
            rows: [
              ["-a", "okna", "-ø", "okien", "zero ending with vowel change"],
              [
                "-a (soft)",
                "morza",
                "-ø",
                "mórz",
                "zero ending with vowel change",
              ],
              ["-um", "muzeum", "-ów", "muzeów", "loanwords"],
            ],
          },
        ],
        notes: [
          "Genitive is used after negation (e.g. Nie mam czasu – I don't have time).",
          "It appears after quantifiers (e.g. dużo wody – a lot of water).",
          "Used for possession (e.g. dom Piotra – Peter's house).",
          "Plural genitive endings often drop vowels (kobiet, mórz, okien).",
          "Masculine animate nouns almost always take -a in singular genitive.",
          "Masculine inanimate may take -a or -u depending on the word's stem and tradition.",
          "Loanwords often keep -um / -ów endings in neuter and masculine forms.",
        ],
      },
      {
        id: "dative",
        title: "3. Celownik (Dative)",
        questions: "Komu? Czemu?",
        usage:
          "Indirect object (to/for someone) / Dopełnienie pośrednie (do/dla kogoś)",
        modalTitle: "Celownik (Dative)",
        description: "Indirect object (to/for someone).",
        tables: [
          {
            title: "Masculine Animate",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
            ],
            rows: [
              ["-owi", "chłopcu", "-om", "chłopcom"],
              ["-owi", "królowi", "-om", "królom"],
            ],
          },
          {
            title: "Masculine Inanimate",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
            ],
            rows: [
              ["-owi", "domowi", "-om", "domom"],
              ["-owi", "stołowi", "-om", "stołom"],
            ],
          },
          {
            title: "Feminine",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
            ],
            rows: [
              ["-ie", "kobiecie", "-om", "kobietom"],
              ["-i", "pani", "-om", "paniom"],
            ],
          },
          {
            title: "Neuter",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
            ],
            rows: [
              ["-u", "oknu", "-om", "oknom"],
              ["-u (soft)", "morzu", "-om", "morzom"],
            ],
          },
        ],
        notes: [
          "The dative is mainly used for the indirect object – indicating to whom or for whom something is done.",
          "Often follows verbs like: pomagać komuś (to help someone), dziękować komuś (to thank someone), wierzyć komuś (to believe someone), ufać komuś (to trust someone), przyglądać się czemuś (to observe something).",
          "Also used with certain prepositions such as: dzięki (thanks to) – dzięki tobie, przeciw (against) – przeciw wiatrowi, wbrew (contrary to) – wbrew zasadom.",
          "Masculine nouns usually take -owi (e.g. studentowi), but a few may take -u in traditional forms.",
          "All plural nouns take -om in the dative.",
          "Soft neuter nouns (like morze) get -u with consonant softening (morzu).",
        ],
      },
      {
        id: "accusative",
        title: "4. Biernik (Accusative)",
        questions: "Kogo? Co?",
        usage:
          "Direct object (who/what is affected) / Bezpośredni przedmiot (kto/co jest dotknięte)",
        modalTitle: "Biernik (Accusative)",
        description: "Direct object (who/what is affected by the action).",
        tables: [
          {
            title: "Masculine Animate",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
            ],
            rows: [
              ["-a / -u", "chłopca", "-ów", "chłopców"],
              ["-a", "studenta", "-ów", "studentów"],
              ["-ia", "gościa", "-i", "gości"],
            ],
          },
          {
            title: "Masculine Inanimate",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
            ],
            rows: [
              ["-ø", "dom", "-y", "domy"],
              ["-ø", "most", "-y", "mosty"],
              ["-ø", "profesor", "-owie", "profesorowie"],
            ],
          },
          {
            title: "Feminine",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
            ],
            rows: [
              ["-ę", "kobietę", "-y", "kobiety"],
              ["-i", "pani", "-e", "panie"],
              ["-ść", "miłość", "-ści", "miłości"],
            ],
          },
          {
            title: "Neuter",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
            ],
            rows: [
              ["-o / -e", "okno / morze", "-a", "okna / morza"],
              ["-ę", "imię", "-a", "imiona"],
            ],
          },
        ],
        notes: [
          "The Accusative case marks the direct object – the person or thing directly affected by the verb.",
          "Masculine animate nouns (people, animals) take the same form as the Genitive.",
          "Masculine inanimate nouns take the same form as the Nominative.",
          "All feminine nouns ending in -a change it to -ę (e.g. widzę kobietę).",
          "Neuter nouns have the same form in Nominative and Accusative (e.g. widzę okno).",
          "Used with verbs of motion and action: widzieć kogo/co (to see), lubić kogo/co (to like), czytać książkę (to read a book), jeść jabłko (to eat an apple).",
          "Common prepositions used with Accusative: na (onto, for) – idę na spacer, w (into) – wchodzę w dom, przez (through) – przez okno, o (about) – pytam o ciebie, za (for, behind) – płacę za obiad.",
          "In negative sentences, Accusative may turn into Genitive (e.g. mam kota → nie mam kota).",
        ],
      },
      {
        id: "instrumental",
        title: "5. Narzędnik (Instrumental)",
        questions: "Z kim? Z czym?",
        usage:
          "Z/przez – narzędzia, towarzysze, zawody. (With/by – tools, companions, professions.)",
        modalTitle: "Narzędnik (Instrumental)",
        description: "Means, accompaniment, tools, professions.",
        tables: [
          {
            title: "Masculine Animate",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
            ],
            rows: [
              ["-em", "domem", "-ami", "domami"],
              ["-iem", "nauczycielem", "-ami", "nauczycielami"],
            ],
          },
          {
            title: "Masculine Inanimate",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
            ],
            rows: [
              ["-em", "stołem", "-ami", "stołami"],
              ["-iem", "morzem", "-ami", "morzami"],
            ],
          },
          {
            title: "Feminine",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
            ],
            rows: [
              ["-ą", "kobietą", "-ami", "kobietami"],
              ["-ą", "panią", "-ami", "paniami"],
            ],
          },
          {
            title: "Neuter",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
            ],
            rows: [
              ["-em", "oknem", "-ami", "oknami"],
              ["-iem", "morzem", "-ami", "morzami"],
            ],
          },
        ],
        notes: [
          'The instrumental case is often used after the preposition z ("with") to express companionship (z przyjacielem – with a friend), or to describe tools and means (pisać długopisem – to write with a pen).',
          "It also appears after verbs like być (to be), zostać (to become), and interesować się (to be interested in).",
          "Jestem nauczycielem – I am a teacher.",
          "Została lekarzem – She became a doctor.",
          "Interesuję się muzyką – I'm interested in music.",
        ],
      },
      {
        id: "locative",
        title: "6. Miejscownik (Locative)",
        questions: "O kim? O czym?",
        usage:
          "Tylko po przyimkach (w, na, o, przy). (Only after prepositions (in, on, about, at).)",
        modalTitle: "Miejscownik (Locative)",
        description: "Used after prepositions (e.g., w, na, o).",
        tables: [
          {
            title: "Masculine Animate",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
              "Notes",
            ],
            rows: [
              ["-e", "o psie", "-ach", "o psach", "default hard stem"],
              ["-u", "o gościu", "-ach", "o gościach", "soft stems palatalize"],
            ],
          },
          {
            title: "Masculine Inanimate",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
              "Notes",
            ],
            rows: [["-e", "o domu", "-ach", "o domach", "hard stem"]],
          },
          {
            title: "Feminine",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
              "Notes",
            ],
            rows: [
              [
                "-e",
                "w szkole",
                "-ach",
                "w szkołach",
                "prepositions: w, na, o",
              ],
              ["-i", "o pani", "-ach", "o paniach", "soft stem endings"],
              ["-y", "na ulicy", "-ach", "na ulicach", "vowel changes"],
              ["-i", "o ziemi", "-ach", "o ziemiach", "soft stem"],
            ],
          },
          {
            title: "Neuter",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
              "Notes",
            ],
            rows: [
              ["-e", "o morzu", "-ach", "o morzach", "—"],
              ["-e", "w oknie", "-ach", "w oknach", "—"],
              ["-u", "o imieniu", "-ach", "o imionach", "irregular stem"],
            ],
          },
        ],
        notes: [
          "The locative case (miejscownik) is used only after specific prepositions, such as: w (in), na (on/at), o (about), po (after, around), and przy (near).",
          "It expresses location or the topic of speech or thought.",
          "W szkole – at school",
          "Na stole – on the table",
          "O nauczycielu – about the teacher",
          "Przy oknie – near the window",
          "Note that masculine and neuter nouns may take -e or -u depending on softness of the stem, and feminine nouns ending in -a typically change to -e.",
        ],
      },
      {
        id: "vocative",
        title: "7. Wołacz (Vocative)",
        questions: "—",
        usage:
          "When addressing or calling someone directly / Kiedy zwracasz się do kogoś bezpośrednio lub dzwonisz do tej osoby",
        modalTitle: "Wołacz (Vocative)",
        description: "Used when directly addressing or calling someone.",
        tables: [
          {
            title: "Masculine Animate",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
              "Notes",
            ],
            rows: [
              [
                "-e / -u / -ie",
                "Piotrze / Ojcze / Wojciechie",
                "-owie",
                "Piotrowie",
                "Depends on stem",
              ],
            ],
          },
          {
            title: "Masculine Inanimate",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
              "Notes",
            ],
            rows: [["-e", "domie", "-y", "domy", "rarely used"]],
          },
          {
            title: "Feminine",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
              "Notes",
            ],
            rows: [
              [
                "-o / -u / -i",
                "Mamo / Pani / Kobieto",
                "-y",
                "Mamy / Panie / Kobiety",
                "Depends on stem",
              ],
            ],
          },
          {
            title: "Neuter",
            columns: [
              "Ending (sing.)",
              "Example (sing.)",
              "Ending (pl.)",
              "Example (pl.)",
              "Notes",
            ],
            rows: [
              [
                "-o / -e",
                "Dziecko / Okno",
                "-a",
                "Dzieci / Okna",
                "rarely used",
              ],
            ],
          },
        ],
        notes: [
          "The vocative (wołacz) is used when directly addressing a person, animal, or sometimes even an object.",
          "It often appears in greetings, prayers, or when calling someone's name.",
          "In modern spoken Polish, the nominative form is frequently used instead, especially in casual speech.",
          "Anno! – Anna! (formal or poetic)",
          "Piotrze! – Peter!",
          "Mamo! – Mom!",
          "Panie doktorze! – Doctor! (formal address)",
          "The vocative is still common in polite, literary, and religious contexts, but optional in everyday conversation, where nominative forms (e.g. Anna!) are accepted.",
        ],
      },
    ],
  },
};

export default casesData;
