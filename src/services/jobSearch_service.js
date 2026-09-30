import supabase from "../config/supabase.js";
import { generateEmbedding } from "./embeddingService.js";
import {matchJobs} from "./jobService.js";

export async function searchJobs(query, limit = 5) {
  // 1. Convert query into an embedding
  const queryEmbedding = await generateEmbedding(query);

  // 2. Semantic search in Supabase
    const { data, error } = await matchJobs(queryEmbedding, limit);

  if (error) {
    throw new Error(`Job search failed: ${error.message}`);
  }

  return data;
}
