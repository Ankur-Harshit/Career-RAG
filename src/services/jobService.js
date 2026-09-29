import supabase from "../config/supabase.js";

export async function insertJob(job, searchText, embedding) {
  return supabase.from("jobs").insert({ ...job, search_text: searchText, embedding }).select();
}

export async function matchJobs(queryEmbedding, matchCount = 5) {
  return supabase.rpc("match_jobs", { query_embedding: queryEmbedding, match_count: matchCount });
}
