import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function understandQuery(query) {
  const prompt = `
You are a job search query parser.

Convert the user's job search query into JSON.

Return ONLY valid JSON with exactly these fields:

{
  "semantic_query": string,
  "city": string | null,
  "min_experience": number | null,
  "max_experience": number | null,
  "min_salary": number | null,
  "exclude_terms": string[]
}

Rules:
- semantic_query should contain the main job/skill intent.
- city should only be extracted if explicitly mentioned.
- max_experience should only be extracted when the user specifies an upper experience limit.
- min_experience means the minimum required experience for the job.
- max_experience means the maximum required experience for the job.
- If the user says they are a fresher, set max_experience to 0.
- If the user explicitly asks for jobs requiring at least X years, set min_experience to X.
- If the user asks for jobs requiring at most X years, set max_experience to X.
- If the user specifies an experience range, extract both values.
- Do not infer an experience requirement unless the user explicitly indicates it.
- min_salary should be converted to INR.
- exclude_terms should contain technologies, roles, or categories the user explicitly says they do NOT want.
- Do not invent information.
- If something is not specified, use null.
- Return JSON only.

User query:
${query}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
  });

  const text = response.text.trim();
  console.log("response from Gemini API:", text);
  // console.log(typeof text);
  const jsonText = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(jsonText);
}
