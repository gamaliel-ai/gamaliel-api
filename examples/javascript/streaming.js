/**
 * Streaming example: Streaming chat completion with Gamaliel API
 */
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-...',  // Your OpenAI API key (required)
  baseURL: 'https://api.gamaliel.ai/v1'
});

const stream = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'What does the Bible say about forgiveness?' }
  ],
  stream: true,
  theology_slug: 'default',
  book_id: 'MAT',
  chapter: 6
} as any);

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
}

console.log();  // New line after stream completes
