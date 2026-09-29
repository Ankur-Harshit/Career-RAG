import "dotenv/config";
import { generateEmbedding } from "../src/services/embeddingService.js";
import { insertJob } from "../src/services/jobService.js";

const job = {
  job_id: "TEST-001",
  company_name: "TechCorp",
  role: "Backend Developer",
  skills: "Node.js, Express.js, MongoDB, AWS",
  job_description:
    "We are looking for a backend developer who can build scalable REST APIs and work with cloud infrastructure.",
  experience_min: 1,
  experience_max: 3,
  salary_inr: 800000,
  country: "India",
  city: "Bangalore",
};

const searchText = `
Role: ${job.role}

Company: ${job.company_name}

Skills: ${job.skills}

Experience: ${job.experience_min}-${job.experience_max} years

Location: ${job.city}, ${job.country}

Description:
${job.job_description}
`.trim();

console.log("Search text:");
console.log(searchText);

const embedding = await generateEmbedding(searchText);
console.log("Embedding length:", embedding.length);

const { data, error } = await insertJob(job, searchText, embedding);
if (error) {
  console.error("Insert failed:", error);
} else {
  console.log("Job inserted successfully!");
  console.log(data);
}
