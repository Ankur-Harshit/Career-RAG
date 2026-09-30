import { searchJobs } from "../src/services/jobSearch_service.js";

const results = await searchJobs(
  "I want a backend developer role using Node.js and AWS",
  5,
);

console.log(results);
