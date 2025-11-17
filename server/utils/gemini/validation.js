/**
 * Validation utilities for Polish text validation
 */

export const VALID_LEVELS = ["beginner", "intermediate", "advanced"];
export const VALID_ROLES = ["student", "teacher"];

/**
 * Validate text input
 * @param {string} text - Text to validate
 * @throws {Error} If text is invalid
 */
export const validateTextInput = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required and must be a string");
  }

  if (text.trim().length === 0) {
    throw new Error("Text cannot be empty");
  }

  if (text.length > 10000) {
    throw new Error("Text is too long. Maximum length is 10,000 characters");
  }
};

/**
 * Validate proficiency level
 * @param {string} level - Level to validate
 * @throws {Error} If level is invalid
 */
export const validateLevel = (level) => {
  if (!VALID_LEVELS.includes(level)) {
    throw new Error(
      `Invalid level. Must be one of: ${VALID_LEVELS.join(", ")}`
    );
  }
};

/**
 * Validate user role
 * @param {string} userRole - Role to validate
 * @throws {Error} If role is invalid
 */
export const validateUserRole = (userRole) => {
  if (userRole && !VALID_ROLES.includes(userRole)) {
    throw new Error(
      `Invalid user role. Must be one of: ${VALID_ROLES.join(", ")}`
    );
  }
};

/**
 * Validate all inputs for text validation
 * @param {Object} inputs - Input object containing text, level, and userRole
 * @returns {Object} Validated and sanitized inputs
 */
export const validateValidationInputs = ({
  text,
  level = "intermediate",
  userRole = "student",
}) => {
  validateTextInput(text);
  validateLevel(level);
  validateUserRole(userRole);

  return {
    text: text.trim(),
    level,
    userRole,
  };
};

/**
 * Validate detected level from AI response
 * @param {string} detectedLevel - Level detected by AI
 * @returns {Object} Validated level with confidence
 */
export const validateDetectedLevel = (detectedLevel) => {
  const normalizedLevel = detectedLevel.trim().toLowerCase();
  const isValid = VALID_LEVELS.includes(normalizedLevel);

  return {
    level: isValid ? normalizedLevel : "intermediate",
    confidence: isValid ? "high" : "medium",
    raw: detectedLevel,
  };
};
