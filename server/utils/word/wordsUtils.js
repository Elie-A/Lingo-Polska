// utils/word/wordsUtils.js

// Helper: sort object keys alphabetically
const sortKeys = (obj) => {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
};

// Group verbs by tense → mood → list of forms
export const groupVerbForms = (forms) => {
  const grouped = forms.reduce((acc, f) => {
    const tense = f.tense || "unspecified";
    const mood = f.mood || "unspecified";
    const person = f.person || "unspecified";
    const number = f.number || "unspecified";

    acc[tense] = acc[tense] || {};
    acc[tense][mood] = acc[tense][mood] || [];
    acc[tense][mood].push({ form: f.inflectedForm, person, number });

    return acc;
  }, {});

  // Sort tenses and moods alphabetically
  const sorted = sortKeys(grouped);
  for (const tense in sorted) {
    sorted[tense] = sortKeys(sorted[tense]);
  }
  return sorted;
};

// Group nouns/adjectives/pronouns by number → case → list of forms
export const groupNominalForms = (forms) => {
  const grouped = forms.reduce((acc, f) => {
    const number = f.number || "unspecified";
    const caseName = f.case || "unspecified";
    const gender = f.gender || "unspecified";

    acc[number] = acc[number] || {};
    acc[number][caseName] = acc[number][caseName] || [];
    acc[number][caseName].push({ form: f.inflectedForm, gender });

    return acc;
  }, {});

  // Sort numbers and cases
  const sorted = sortKeys(grouped);
  for (const number in sorted) {
    sorted[number] = sortKeys(sorted[number]);
  }
  return sorted;
};

// Optional: simple grouping for other POS
export const groupOtherForms = (forms) => {
  return forms.map((f) => ({ form: f.inflectedForm }));
};
