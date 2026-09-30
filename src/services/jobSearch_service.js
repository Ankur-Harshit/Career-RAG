import supabase from "../config/supabase.js";
import { generateEmbedding } from "./embeddingService.js";
import { matchJobs } from "./jobService.js";
import { understandQuery } from "./query_understanding_service.js";
import { explainJobs } from "./jobReasoningService.js";

export async function searchJobs(query, filters = {}, limit = 5) {
  const parsedQuery = await understandQuery(query);

  const queryEmbedding = await generateEmbedding(parsedQuery.semantic_query);

  const { data, error } = await matchJobs(queryEmbedding, parsedQuery, limit);

  if (error) {
    throw new Error(`Job search failed: ${error.message}`);
  }

  const explainedData = await explainJobs(parsedQuery.semantic_query, data);

  const explainedMap = new Map(
    explainedData.jobs.map((job) => [job.job_id, job]),
  );

  const finalJobs = data.map((job) => {
    const explanation = explainedMap.get(job.job_id);

    return {
      ...job,
      match_reason: explanation?.match_reason ?? [],
      skills_to_work_on: explanation?.skills_to_work_on ?? [],
    };
  });

  return finalJobs;
}