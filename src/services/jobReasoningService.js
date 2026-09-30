import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function explainJobs(query, jobs) {
  const prompt = `
You are an AI career assistant.

The user searched for jobs using the query below.

USER QUERY:
${query}

Below are jobs retrieved from our job database.

RETRIEVED JOBS:
${JSON.stringify(jobs, null, 2)}

Your task is to analyze EACH retrieved job.

For every job:

1. Explain why the job is relevant to the user's query.
2. Identify skills from the job that the user should work on.

IMPORTANT RULES:

- Base your reasoning ONLY on the user query and the retrieved job information.
- Do not invent candidate skills or experience.
- Do not assume the user knows a technology unless the user explicitly mentioned it.
- If the query does not provide enough information to determine whether a skill is missing, still list the important skills required by the job rather than claiming the user is missing them.
- Keep the reasoning concise and practical.
- Do not change or invent job information.
- Return ONLY valid JSON.

Return exactly this structure:

{
  "jobs": [
    {
      "job_id": "string",
      "match_reason": [
        "string"
      ],
      "skills_to_work_on": [
        "string"
      ]
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
  });

  const text = response.text.trim();

  // console.log("Raw reasoning response:", text);

  const jsonText = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(jsonText);
}
