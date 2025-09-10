import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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"
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
