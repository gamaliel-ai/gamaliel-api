/**
 * Basic example: Non-streaming chat completion with Gamaliel API
 */
import OpenAI from 'openai';

// Initialize client with Gamaliel base URL
const openai = new OpenAI({
  apiKey: 'sk-...',  // Your OpenAI API key (required)
  baseURL: 'https://api.gamaliel.ai/v1'
});

// Standard OpenAI call with Gamaliel-specific parameters
const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'What does the Bible say about forgiveness?' }
  ],
  stream: false,
  // Gamaliel-specific parameters - SDK passes these through automatically
  theology_slug: 'reformed',
  profile_slug: 'universal_explorer',
  book_id: 'MAT',
  chapter: 6,
  verses: [14, 15],
  max_words: 300
} as any);  // Type assertion needed for TypeScript

console.log(response.choices[0].message.content);
console.log(`Tokens used: ${response.usage.total_tokens}`);
