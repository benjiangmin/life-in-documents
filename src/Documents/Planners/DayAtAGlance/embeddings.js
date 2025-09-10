import OpenAI from "openai";
import dotenv from "dotenv";

// Load .env file
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // <- use your .env variable
});

export async function getClassEmbeddings(classes) {
  // classes: array of { name: string }
  const names = classes.map(c => c.name);

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small", // good for short text
    input: names,
  });

  return response.data.map(d => d.embedding); // array of embeddings
}
