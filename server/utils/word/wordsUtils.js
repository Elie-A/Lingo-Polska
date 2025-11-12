export const groupVerbForms = (forms) => {
  const grouped = {};
  for (const f of forms) {
    const { tense, mood, person, number } = f;
    if (!grouped[tense]) grouped[tense] = {};
    if (!grouped[tense][mood]) grouped[tense][mood] = [];
    grouped[tense][mood].push({
      form: f.inflectedForm,
      person,
      number,
    });
  }
  return grouped;
};

export const groupNominalForms = (forms) => {
  const grouped = {};
  for (const f of forms) {
    const { case: caseName, number, gender } = f;
    if (!grouped[number]) grouped[number] = {};
    if (!grouped[number][caseName]) grouped[number][caseName] = [];
    grouped[number][caseName].push({
      form: f.inflectedForm,
      gender,
    });
  }
  return grouped;
};
