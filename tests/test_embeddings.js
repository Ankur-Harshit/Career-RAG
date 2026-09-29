import "dotenv/config";
import { generateEmbedding } from "../src/services/embeddingService.js";

async function generateEmbeddingSample() {
  const text = `
        Backend Developer

        Skills:
        Node.js, Express.js, MongoDB, AWS

        Description:
        We are looking for a backend developer
        who can build scalable REST APIs and
        work with cloud infrastructure.
    `;
  const embedding = await generateEmbedding(text);
  console.log("Embedding length:", embedding.length);
  console.log("First 10 values:", embedding.slice(0, 10));
}

generateEmbeddingSample();
