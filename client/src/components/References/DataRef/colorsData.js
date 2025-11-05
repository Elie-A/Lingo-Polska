const colorsData = {
  colors: {
    title: "Colors in Polish",
    description:
      "In Polish, colors are expressed using adjectives, which often change their form depending on the gender, number, and case of the noun they describe. For example: biały dom (white house – masculine), biała koszula (white shirt – feminine), białe okno (white window – neuter). ",
    modalTitle: "Colors in Polish (Kolory)",
    modalDescription:
      "In Polish, colors are adjectives and therefore change their endings depending on the gender and number of the noun they describe. Below are common color names and their meanings:",
    columns: [
      "Polish (Masculine)",
      "Feminine",
      "Neuter",
      "English",
      "Example (Masculine)",
    ],
    rows: [
      ["zielony", "zielona", "zielone", "green", "zielony kot"],
      ["srebrny", "srebrna", "srebrne", "silver", "srebrny samochód"],
      ["czerwony", "czerwona", "czerwone", "red", "czerwony kwiat"],
      ["żółty", "żółta", "żółte", "yellow", "żółty banan"],
      ["różowy", "różowa", "różowe", "pink", "różowy kwiat"],
      ["purpurowy", "purpurowa", "purpurowe", "purple", "purpurowy płaszcz"],
      ["biały", "biała", "białe", "white", "biały kot"],
      ["szary", "szara", "szare", "gray", "szary pies"],
      ["fioletowy", "fioletowa", "fioletowe", "violet", "fioletowy kwiat"],
      ["czarny", "czarna", "czarne", "black", "czarny samochód"],
      ["niebieski", "niebieska", "niebieskie", "blue", "niebieski długopis"],
      [
        "pomarańczowy",
        "pomarańczowa",
        "pomarańczowe",
        "orange",
        "pomarańczowy sok",
      ],
      ["złoty", "złota", "złote", "golden", "złoty pierścionek"],
      ["brązowy", "brązowa", "brązowe", "brown", "brązowy stół"],
    ],
    genderForms: [
      {
        gender: "Masculine",
        pattern: "base form",
        example: "zielony kot (green cat)",
      },
      {
        gender: "Feminine",
        pattern: "usually ends in -a",
        example: "zielona książka (green book)",
      },
      {
        gender: "Neuter",
        pattern: "usually ends in -e",
        example: "zielone okno (green window)",
      },
    ],
    notes:
      "Remember that colors agree with the gender of the noun: zielony dom (green house – masculine), zielona trawa (green grass – feminine), zielone okno (green window – neuter).",
  },
};

export default colorsData;
