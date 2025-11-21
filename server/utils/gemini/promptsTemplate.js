/**
 * Gemini AI Prompts for Polish Language Validation
 */

/**
 * Get validation prompt based on user role and level
 * @param {string} text - Polish text to validate
 * @param {string} userRole - 'student' or 'teacher'
 * @param {string} level - 'beginner', 'intermediate', or 'advanced'
 * @returns {string} Formatted prompt
 */
export const getPromptForLevel = (text, userRole, level) => {
  const basePrompt = `You are an expert Polish language teacher analyzing text written by a ${userRole} at ${level} level.

IMPORTANT INSTRUCTIONS:
- Provide COMPLETE analysis with no truncation
- If you reach token limits, prioritize: 1) Grammar corrections, 2) Key improvements, 3) Examples
- Use concise markdown formatting
- End with "--- Analysis Complete ---" when finished

Text to analyze:
"${text}"

${getLevelSpecificGuidance(level, userRole)}

Format your response in markdown with these sections:
1. **Overall Assessment** (2-3 sentences)
2. **Grammar & Corrections** (table format)
3. **Key Improvements** (bullet points, max 5)
4. **Example Corrections** (max 3)

Keep your response focused and complete. End with "--- Analysis Complete ---"`;

  return basePrompt;
};

/**
 * Get level-specific guidance
 */
const getLevelSpecificGuidance = (level, userRole) => {
  const guidance = {
    beginner: {
      student: `Focus on:
- Basic spelling and simple grammar
- Common verb conjugations
- Sentence structure basics
- Encouragement and practical tips`,
      teacher: `Provide:
- Fundamental grammar points for teaching
- Common student mistakes at this level
- Teaching suggestions
- Simple correction examples`,
    },
    intermediate: {
      student: `Analyze:
- Complex sentence structures
- Case usage (all 7 cases)
- Verb aspects (perfective/imperfective)
- Vocabulary richness
- Style improvements`,
      teacher: `Deliver:
- Detailed grammatical analysis
- Advanced teaching points
- Student proficiency indicators
- Pedagogical recommendations`,
    },
    advanced: {
      student: `Examine:
- Stylistic nuances
- Idiomatic expressions
- Register appropriateness
- Advanced grammar subtleties
- Native-like fluency markers`,
      teacher: `Assess:
- Near-native proficiency markers
- Subtle errors that persist at high levels
- Advanced pedagogical strategies
- Cultural and contextual appropriateness`,
    },
  };

  return guidance[level]?.[userRole] || guidance.intermediate.student;
};

/**
 * Level detection prompt
 * @param {string} text - Polish text to analyze
 * @returns {string} Level detection prompt
 */
export const getLevelDetectionPrompt = (text) => {
  return `You are a Polish language expert. Analyze this text and determine the writer's proficiency level.

Text:
"${text}"

Analyze based on:
1. **Vocabulary**: Range and sophistication
2. **Grammar**: Complexity and accuracy (case usage, verb aspects, etc.)
3. **Sentence Structure**: Simple vs. complex constructions
4. **Orthography**: Spelling and punctuation accuracy
5. **Fluency**: Natural flow and idiomaticity

RESPOND WITH ONLY ONE WORD:
- "beginner" (A1-A2): Basic vocabulary, simple sentences, frequent errors
- "intermediate" (B1-B2): Varied vocabulary, complex sentences, occasional errors
- "advanced" (C1-C2): Rich vocabulary, sophisticated structures, rare errors

Your response (one word only):`;
};

/**
 * Concise validation prompt for faster responses
 * Use this if you're experiencing timeouts
 */
export const getConcisePrompt = (text, userRole, level) => {
  return `Analyze this Polish text (${level} ${userRole}):

"${text}"

Provide:
1. 2-3 sentence assessment
2. Top 3 corrections (table: Error | Correction | Explanation)
3. One example improvement

Be concise and complete. Use markdown.`;
};

/**
 * Prompt templates for specific error types
 */
export const getErrorSpecificPrompt = (text, errorType) => {
  const errorPrompts = {
    grammar: `Focus ONLY on grammatical errors in this Polish text:
"${text}"

List corrections in this format:
| Error | Correction | Rule |
|-------|-----------|------|

Limit to 5 most important errors.`,

    spelling: `Check ONLY spelling and orthography in this Polish text:
"${text}"

List:
1. Misspelled words
2. Correct spelling
3. Common mistake note`,

    style: `Analyze ONLY stylistic improvements for this Polish text:
"${text}"

Suggest:
- Better word choices (max 3)
- Flow improvements (max 2)
- Tone adjustments`,
  };

  return (
    errorPrompts[errorType] || getConcisePrompt(text, "student", "intermediate")
  );
};

/**
 * Progressive prompt - breaks analysis into chunks
 * Returns array of prompts for sequential processing
 */
export const getProgressivePrompts = (text, level) => {
  return [
    {
      step: 1,
      prompt: `Part 1: Quick assessment of this ${level} Polish text:
"${text}"

Provide: Overall level confirmation + top 3 grammar issues (table format only).`,
    },
    {
      step: 2,
      prompt: `Part 2: For the same text, provide:
"${text}"

3 key vocabulary/style improvements (bullet points).`,
    },
    {
      step: 3,
      prompt: `Part 3: For the same text:
"${text}"

One corrected example showing improvements.`,
    },
  ];
};

/**
 * Streaming-friendly prompt
 * Optimized for progressive rendering
 */
export const getStreamingPrompt = (text, userRole, level) => {
  return `Polish text analysis (${level} ${userRole}):

"${text}"

Provide analysis, in English, in this exact order:
## Assessment
[2-3 sentences]

## Corrections
| Original | Fixed | Why |
|----------|-------|-----|
[Max 5 rows]

## Improvements
- [Point 1]
- [Point 2]
- [Point 3]

## Example
[One before/after]

Keep concise. Use markdown.`;
};

export default {
  getPromptForLevel,
  getLevelDetectionPrompt,
  getConcisePrompt,
  getErrorSpecificPrompt,
  getProgressivePrompts,
  getStreamingPrompt,
};
