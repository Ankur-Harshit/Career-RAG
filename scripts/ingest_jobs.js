import fs from "fs";
import { parse } from "csv-parse/sync";
import "dotenv/config";

import supabase from "../src/config/supabase.js";
import { generateEmbedding } from "../src/services/embeddingService.js";

const CSV_PATH = new URL("../data/raw/job_postings_dataset.csv", import.meta.url);

const BATCH_SIZE = 50;

function parseExperience(experience) {
  if (!experience) {
    return {
      min: null,
      max: null,
    };
  }

  const numbers = experience.match(/\d+/g);

  if (!numbers || numbers.length === 0) {
    return {
      min: null,
      max: null,
    };
  }

  if (numbers.length === 1) {
    return {
      min: Number(numbers[0]),
      max: Number(numbers[0]),
    };
  }

  return {
    min: Number(numbers[0]),
    max: Number(numbers[1]),
  };
}

function createSearchText(job) {
  return `
Role: ${job.role}
Company: ${job.companyName}
Skills: ${job.skills}
Job Description: ${job.jobDescription}
Experience: ${job.experience}
Location: ${job.city}, ${job.country}
Salary: ${job.salary} INR
`.trim();
}

function transformJob(row) {
  const experience = parseExperience(row["Experience"]);

  const job = {
    jobId: row["Job ID"],
    companyName: row["Company Name"],
    role: row["Role"],
    skills: row["Skills"],
    jobDescription: row["Job Description"],
    experience: row["Experience"],
    salary: Number(row["Salary(INR)"]),
    country: row["Country"],
    city: row["City"],
  };

  return {
    job_id: job.jobId,
    company_name: job.companyName,
    role: job.role,
    skills: job.skills,
    job_description: job.jobDescription,

    experience_min: experience.min,
    experience_max: experience.max,

    salary_inr: job.salary,

    country: job.country,
    city: job.city,

    search_text: createSearchText(job),
  };
}

async function ingestJobs() {
  console.log("Reading dataset...");

  const csv = fs.readFileSync(CSV_PATH, "utf-8");

  const rows = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Found ${rows.length} jobs`);

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    console.log(
      `\nProcessing jobs ${i + 1}-${Math.min(i + BATCH_SIZE, rows.length)}`,
    );

    const jobsWithEmbeddings = [];

    for (const row of batch) {
      const job = transformJob(row);

      console.log(`Embedding: ${job.job_id}`);

      const embedding = await generateEmbedding(job.search_text);

      jobsWithEmbeddings.push({
        ...job,
        embedding,
      });
    }

    const { error } = await supabase.from("jobs").upsert(jobsWithEmbeddings, {
      onConflict: "job_id",
    });

    if (error) {
      console.error("Supabase insertion error:", error);
      throw error;
    }

    console.log(`Inserted ${jobsWithEmbeddings.length} jobs successfully`);
  }

  console.log("\n🎉 Ingestion completed!");
}

ingestJobs().catch((error) => {
  console.error("Ingestion failed:", error);
  process.exit(1);
});
