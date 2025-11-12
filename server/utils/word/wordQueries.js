// Build MongoDB query dynamically from request body
export const buildSearchQuery = (body) => {
  const {
    lemma,
    partOfSpeech,
    case: caseValue,
    number,
    gender,
    tense,
    person,
    mood,
  } = body;
  const query = {};
  if (lemma) query.lemma = lemma;
  if (partOfSpeech) query.partOfSpeech = partOfSpeech.toUpperCase();
  if (caseValue) query.case = caseValue;
  if (number) query.number = number;
  if (gender) query.gender = gender;
  if (tense) query.tense = tense;
  if (person) query.person = person;
  if (mood) query.mood = mood;
  return query;
};

// Build aggregation pipeline for statistics
export const buildStatsAggregation = () => [
  {
    $group: {
      _id: "$partOfSpeech",
      totalForms: { $sum: 1 },
      uniqueLemmas: { $addToSet: "$lemma" },
    },
  },
  {
    $project: {
      partOfSpeech: "$_id",
      totalForms: 1,
      uniqueLemmas: { $size: "$uniqueLemmas" },
    },
  },
];

// Build lemma query and aggregation
export const buildLemmaQuery = (queryParams) => {
  const { search, pos, limit = 50 } = queryParams;
  const query = {};
  if (search) query.lemma = { $regex: search, $options: "i" };
  if (pos) query.partOfSpeech = pos.toUpperCase();

  const pipeline = [
    { $match: query },
    {
      $group: {
        _id: { lemma: "$lemma", pos: "$partOfSpeech" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.lemma": 1 } },
    { $limit: parseInt(limit, 10) },
  ];

  return { query, pipeline };
};
