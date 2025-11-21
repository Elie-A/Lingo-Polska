/**
 * AI Service Layer for Gemini API interactions
 */

import { getModel } from "../config/gemini.js";

class AIService {
  constructor() {
    this.model = null;
  }

  /**
   * Get or initialize the model
   * @returns {Object} Gemini model instance
   */
  getModelInstance() {
    if (!this.model) {
      this.model = getModel();
    }
    return this.model;
  }

  /**
   * Generate content using Gemini AI
   * @param {string} prompt - Prompt to send to AI
   * @returns {Promise<string>} AI response text
   * @throws {Error} If API call fails
   */
  async generateContent(prompt) {
    try {
      const model = this.getModelInstance();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.handleAIError(error);
    }
  }

  /**
   * Validate Polish text with AI
   * @param {string} text - Text to validate
   * @param {string} userRole - User role
   * @param {string} level - Proficiency level
   * @param {Function} getPromptFn - Function to generate prompt
   * @returns {Promise<Object>} Validation result
   */
  async validateText(text, userRole, level, getPromptFn) {
    const prompt = getPromptFn(text, userRole, level);
    const feedback = await this.generateContent(prompt);

    return {
      originalText: text,
      feedback,
      level,
      userRole,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Detect proficiency level of text
   * @param {string} text - Text to analyze
   * @param {Function} getPromptFn - Function to generate prompt
   * @returns {Promise<Object>} Detection result
   */
  async detectLevel(text, getPromptFn) {
    const prompt = getPromptFn(text);
    const response = await this.generateContent(prompt);

    return {
      rawResponse: response,
      normalizedResponse: response.trim().toLowerCase(),
      timestamp: new Date().toISOString(),
    };
  }

  async continueAnalysis(text, previousFeedback, userRole, level, getPromptFn) {
    const prompt =
      getPromptFn(text, userRole, level, previousFeedback) +
      "Please only provide the new portion of the feedback that wasn't in the previous response.";

    const feedback = await this.generateContent(prompt);

    return {
      originalText: text,
      feedback: feedback.trim(),
      level,
      userRole,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handle AI-specific errors
   * @param {Error} error - Error object
   * @throws {Error} Formatted error
   */
  handleAIError(error) {
    console.error("[AI Service Error]:", error.message);

    if (
      error.message.includes("API key") ||
      error.message.includes("INVALID_API_KEY")
    ) {
      const err = new Error("INVALID_API_KEY");
      err.statusCode = 401;
      throw err;
    }

    if (
      error.message.includes("quota") ||
      error.message.includes("rate limit")
    ) {
      const err = new Error("Rate limit exceeded. Please try again later.");
      err.statusCode = 429;
      throw err;
    }

    if (error.message.includes("timeout")) {
      const err = new Error("Request timeout. Please try again.");
      err.statusCode = 504;
      throw err;
    }

    const err = new Error(`AI service error: ${error.message}`);
    err.statusCode = 500;
    throw err;
  }

  /**
   * Test AI connection
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      await this.generateContent("Test connection");
      return true;
    } catch (error) {
      console.error("[AI Service] Connection test failed:", error.message);
      return false;
    }
  }
}

// Export singleton instance
const aiService = new AIService();
export default aiService;
