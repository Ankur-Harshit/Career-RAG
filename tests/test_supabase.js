import supabase from "../src/config/supabase.js";

const { data, error } = await supabase.from("jobs").select("*").limit(1);
if (error) {
  console.error("Database error:", error);
} else {
  console.log("Connected to Supabase!");
  console.log(data);
}
