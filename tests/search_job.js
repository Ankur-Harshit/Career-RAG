import { searchJobs } from "../src/services/jobSearch_service.js";
    
const results = await searchJobs(
  "I have done System DEsign and DSA and NodeJS and I want to work in a company that requires 0 years of experience in SDE. I am looking for jobs in India, and I want to exclude any roles related to frontend development or UI/UX design.",
  5,
);

const res = JSON.stringify(results, null, 2);
console.log(res);
