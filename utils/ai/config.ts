import OpenAI from 'openai';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default configuration for chat completions
export const defaultConfig = {
  model: "gpt-4-turbo-preview",
  temperature: 0.7,
  max_tokens: 2000,
  // Add any other parameters you want to standardize
};

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}
