import { Op } from "sequelize";

// Build dynamic WHERE clause for Sequelize
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

  const where = {};
  if (lemma) where.lemma = lemma;
  if (partOfSpeech) where.partOfSpeech = partOfSpeech.toUpperCase();
  if (caseValue) where.case = caseValue;
  if (number) where.number = number;
  if (gender) where.gender = gender;
  if (tense) where.tense = tense;
  if (person) where.person = person;
  if (mood) where.mood = mood;

  return where;
};

// Lemma search
export const buildLemmaQuery = (queryParams) => {
  const { search, pos, limit = 50 } = queryParams;
  const where = {};

  if (search) where.lemma = { [Op.iLike]: `%${search}%` };
  if (pos) where.partOfSpeech = pos.toUpperCase();

  return { where, limit: parseInt(limit, 10) };
};

// Stats query (raw SQL for performance)
export const buildStatsQuery = () => `
  SELECT 
    "partOfSpeech" AS "partOfSpeech",
    COUNT(*) AS "totalForms",
    COUNT(DISTINCT "lemma") AS "uniqueLemmas"
  FROM "Words"
  GROUP BY "partOfSpeech"
  ORDER BY "partOfSpeech" ASC;
`;
