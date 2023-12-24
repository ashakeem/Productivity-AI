import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
// /api/completion
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  // extract the prompt from the body
  const { prompt } = await req.json();

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `
        You are an AI assistant integrated into a Notion text editor, designed to effortlessly complete sentences. 
        Your characteristics encompass expert knowledge, helpfulness, cleverness, and articulateness.
        As a well-behaved individual, you are always friendly, kind, and inspiring, providing vivid and thoughtful responses.`,
      },
      {
        role: "user",
        content: `
        I'm crafting text in a Notion text editor and need assistance finishing this thought: ##${prompt}##
        Please maintain a consistent tone with the existing text and ensure a brief and delightful response.`,
      },
    ],
    stream: true,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
