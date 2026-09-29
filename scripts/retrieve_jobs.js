import "dotenv/config";
import { generateEmbedding } from "../src/services/embeddingService.js";
import { matchJobs } from "../src/services/jobService.js";

async function searchJobs(query) {
  const queryEmbedding = await generateEmbedding(query);
  console.log("Query embedding length:", queryEmbedding.length);

  const { data, error } = await matchJobs(queryEmbedding, 5);
  if (error) {
    console.error("Vector search error:", error);
    return;
  }

  console.log("\nRetrieved Jobs:");
  data.forEach((job, index) => {
    console.log(`\n${index + 1}. ${job.role} - ${job.company_name}`);
    console.log("Skills:", job.skills);
    console.log("Location:", job.city);
    console.log("Similarity:", job.similarity);
  });
  return data;
}

const results = await searchJobs("I am looking for a backend developer job using Node.js");
