import supabase from "../config/supabase.js";

export async function insertJob(job, searchText, embedding) {
  return supabase.from("jobs").insert({ ...job, search_text: searchText, embedding }).select();
}

export async function matchJobs(queryEmbedding, filters = {}, matchCount = 5) {
  const {
    city = null,
    min_experience = null,
    max_experience = null,
    min_salary = null,
    exclude_terms = [],
  } = filters;

  const { data, error } = await supabase.rpc("match_jobs", {
    query_embedding: queryEmbedding,
    match_count: matchCount,

    filter_city: city,
    filter_min_experience: min_experience,
    filter_max_experience: max_experience,
    filter_min_salary: min_salary,
    filter_exclude_terms: exclude_terms,
  });
  if (error) {
    console.log("Error in matchJobs:", error);
    throw new Error(`Job search failed: ${error.message}`);
  }
  return { data, error };
}
